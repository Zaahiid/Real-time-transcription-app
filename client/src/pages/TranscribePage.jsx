import { toast } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import MicButton from '../components/MicButton.jsx';
import RecordingTimer from '../components/RecordingTimer.jsx';
import TranscriptPanel from '../components/TranscriptPanel.jsx';
import VoiceVisualizer from '../components/VoiceVisualizer.jsx';
import { api } from '../lib/api.js';
import { startLiveTranscription } from '../lib/liveTranscription.js';

const EMPTY_TRANSCRIPT = { text: '', interim: '' };

const STATUS_HINTS = {
  idle: 'Tap the mic and start speaking',
  connecting: 'Connecting…',
  recording: 'Listening — tap to stop',
  finishing: 'Finishing up…',
  saving: 'Saving to history…',
};

export default function TranscribePage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [transcript, setTranscript] = useState(EMPTY_TRANSCRIPT);
  const [session, setSession] = useState(null);

  useEffect(() => () => session?.stop(), [session]);

  async function start() {
    setTranscript(EMPTY_TRANSCRIPT);
    setStatus('connecting');

    try {
      setSession(await startLiveTranscription({ onTranscript: setTranscript, onEnd: handleEnd }));
      setStatus('recording');
    } catch (error) {
      toast.danger(error.message);
      setStatus('idle');
    }
  }

  function stop() {
    setStatus('finishing');
    session.stop();
  }

  async function handleEnd({ text, durationMs, error }) {
    setSession(null);
    setTranscript({ text, interim: '' });
    if (error) toast.danger(error);

    if (text) {
      setStatus('saving');
      await save({ text, durationMs });
    }

    setStatus('idle');
  }

  async function save(transcription) {
    try {
      await api('/transcriptions', { method: 'POST', body: transcription });
      toast.success('Saved to history', {
        actionProps: { children: 'View', variant: 'tertiary', onPress: () => navigate('/history') },
      });
      setTranscript(EMPTY_TRANSCRIPT);
    } catch (error) {
      toast.danger(`Could not save the transcription: ${error.message}`);
    }
  }

  const isLive = status === 'recording';

  return (
    <div className="flex flex-1 flex-col items-center gap-3 sm:gap-6 short:landscape:flex-row short:landscape:items-stretch">
      <header className="text-center short:hidden">
        <h1 className="text-xl font-semibold sm:text-3xl">Live transcription</h1>
        <p className="mt-1 text-sm text-muted sm:text-base">Speak in Hindi, English, or a mix of both.</p>
      </header>

      <div className="flex shrink-0 flex-col items-center gap-2 short:landscape:w-60 short:landscape:justify-center">
        <MicButton status={status} onStart={start} onStop={stop} />
        <VoiceVisualizer analyser={session?.analyser} />
        <p className="flex items-center gap-2 text-sm text-muted" aria-live="polite">
          {STATUS_HINTS[status]}
          {isLive && (
            <span className="text-foreground">
              <RecordingTimer startedAt={session.startedAt} /> / 10:00
            </span>
          )}
        </p>
      </div>

      <TranscriptPanel text={transcript.text} interim={transcript.interim} isLive={isLive} />
    </div>
  );
}
