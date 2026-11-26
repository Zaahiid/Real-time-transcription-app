import { createServer } from 'node:http';

import { createApp } from './app.js';
import { config } from './config.js';
import { migrate, pool } from './db/index.js';
import { attachTranscriptionSocket } from './realtime/transcription.js';

await migrate();

const server = createServer(createApp());
attachTranscriptionSocket(server);

server.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});

process.on('SIGTERM', () => {
  server.close(() => pool.end().finally(() => process.exit(0)));
});
