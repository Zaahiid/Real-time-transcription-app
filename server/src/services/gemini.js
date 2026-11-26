import { GoogleGenAI, Modality } from '@google/genai';

import { config } from '../config.js';

const AUDIO_SAMPLE_RATE = 16_000;

const ai = new GoogleGenAI({
  apiKey: config.geminiApiKey,
  httpOptions: { apiVersion: 'v1beta' },
});

export async function connectTranscriber({ onInterim, onFinal, onTurnComplete, onClose }) {
  let open = true;

  const session = await ai.live.connect({
    model: config.geminiModel,
    config: {
      responseModalities: [Modality.TEXT],
      inputAudioTranscription: { languageCodes: [] },
    },
    callbacks: {
      onmessage: ({ serverContent: content }) => {
        if (!content) return;
        if (content.interimInputTranscription?.text) onInterim(content.interimInputTranscription.text);
        if (content.inputTranscription?.text) onFinal(content.inputTranscription.text);
        if (content.turnComplete || content.generationComplete) onTurnComplete();
      },
      onerror: (event) => console.error('Gemini Live error:', event.message),
      onclose: (event) => {
        open = false;
        onClose(event.reason);
      },
    },
  });

  return {
    sendAudio(pcm) {
      if (!open) return;
      session.sendRealtimeInput({
        audio: { data: pcm.toString('base64'), mimeType: `audio/pcm;rate=${AUDIO_SAMPLE_RATE}` },
      });
    },
    endAudio() {
      if (open) session.sendRealtimeInput({ audioStreamEnd: true });
    },
    close() {
      if (open) session.close();
    },
  };
}
