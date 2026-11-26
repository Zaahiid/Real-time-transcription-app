import { WebSocket, WebSocketServer } from 'ws';

import { isAuthenticated } from '../lib/session.js';
import { connectTranscriber } from '../services/gemini.js';

const SOCKET_PATH = '/ws/transcribe';
const FLUSH_TIMEOUT_MS = 3000;

export function attachTranscriptionSocket(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url, 'http://localhost');
    if (pathname !== SOCKET_PATH) return socket.destroy();

    if (!isAuthenticated(request)) {
      return socket.end('HTTP/1.1 401 Unauthorized\r\n\r\n');
    }

    wss.handleUpgrade(request, socket, head, handleClient);
  });
}

async function handleClient(client) {
  client.on('error', (error) => console.error('Client socket error:', error.message));

  const send = (message) => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(message));
  };
  const finish = () => client.close(1000);
  let stopping = false;

  let transcriber;
  try {
    transcriber = await connectTranscriber({
      onInterim: (text) => send({ type: 'interim', text }),
      onFinal: (text) => send({ type: 'final', text }),
      onTurnComplete: () => {
        if (stopping) finish();
      },
      onClose: (reason) => {
        if (!stopping) send({ type: 'error', message: reason || 'Transcription session ended' });
        finish();
      },
    });
  } catch (error) {
    console.error('Could not connect to Gemini Live:', error.message);
    send({ type: 'error', message: 'Could not connect to the transcription service' });
    return client.close(1011);
  }

  if (client.readyState !== WebSocket.OPEN) return transcriber.close();

  client.on('message', (data, isBinary) => {
    if (isBinary) return transcriber.sendAudio(data);

    if (parse(data).type === 'stop' && !stopping) {
      stopping = true;
      transcriber.endAudio();
      setTimeout(finish, FLUSH_TIMEOUT_MS);
    }
  });

  client.on('close', () => transcriber.close());

  send({ type: 'ready' });
}

function parse(data) {
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}
