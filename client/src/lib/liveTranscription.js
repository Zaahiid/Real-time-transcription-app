const SAMPLE_RATE = 16_000;
const WORKLET_URL = '/pcm-recorder.worklet.js';

const MICROPHONE_ERRORS = {
  NotAllowedError: 'Microphone access is blocked. Allow it in your browser settings and try again.',
  NotFoundError: 'No microphone was found on this device.',
  NotReadableError: 'Your microphone is being used by another app.',
};

export async function startLiveTranscription({ onTranscript, onEnd }) {
  const microphone = await openMicrophone();
  const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });

  const release = () => {
    microphone.getTracks().forEach((track) => track.stop());
    audioContext.close();
  };

  let socket;
  try {
    await audioContext.audioWorklet.addModule(WORKLET_URL);
    socket = await openSocket('/ws/transcribe');
  } catch (error) {
    release();
    throw error;
  }

  const source = audioContext.createMediaStreamSource(microphone);
  const recorder = new AudioWorkletNode(audioContext, 'pcm-recorder');
  const analyser = new AnalyserNode(audioContext, { fftSize: 64, smoothingTimeConstant: 0.75 });
  source.connect(recorder);
  source.connect(analyser);

  recorder.port.onmessage = ({ data }) => {
    if (socket.readyState === WebSocket.OPEN) socket.send(data);
  };

  const startedAt = Date.now();
  let stoppedAt = null;
  let text = '';
  let interim = '';
  let error = null;

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);

    if (message.type === 'error') error = message.message;
    if (message.type === 'interim') interim = message.text;
    if (message.type === 'final') {
      text = appendSegment(text, message.text);
      interim = '';
    }
    onTranscript({ text, interim });
  };

  socket.onclose = () => {
    release();
    onEnd({ text: appendSegment(text, interim), error, durationMs: (stoppedAt ?? Date.now()) - startedAt });
  };

  return {
    analyser,
    startedAt,
    stop() {
      if (stoppedAt || socket.readyState !== WebSocket.OPEN) return;

      stoppedAt = Date.now();
      recorder.port.onmessage = null;
      microphone.getTracks().forEach((track) => track.stop());
      socket.send(JSON.stringify({ type: 'stop' }));
    },
  };
}

async function openMicrophone() {
  if (!navigator.mediaDevices) throw new Error('Recording needs a secure (HTTPS) connection.');

  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    });
  } catch (error) {
    throw new Error(MICROPHONE_ERRORS[error.name] ?? error.message);
  }
}

function openSocket(path) {
  const url = new URL(path, window.location.href);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(url);

  return new Promise((resolve, reject) => {
    socket.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      if (message.type === 'ready') resolve(socket);
      if (message.type === 'error') reject(new Error(message.message));
    };
    socket.onclose = () => reject(new Error('Could not reach the transcription server'));
  });
}

function appendSegment(text, segment) {
  return [text, segment.trim()].filter(Boolean).join(' ');
}
