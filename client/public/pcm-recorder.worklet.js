const CHUNK_SIZE = Math.round(sampleRate * 0.1);

class PcmRecorder extends AudioWorkletProcessor {
  chunk = new Int16Array(CHUNK_SIZE);
  length = 0;

  process([channels]) {
    for (const sample of channels[0] ?? []) {
      this.chunk[this.length++] = Math.max(-1, Math.min(1, sample)) * 0x7fff;
      if (this.length === CHUNK_SIZE) this.flush();
    }

    return true;
  }

  flush() {
    this.port.postMessage(this.chunk.buffer, [this.chunk.buffer]);
    this.chunk = new Int16Array(CHUNK_SIZE);
    this.length = 0;
  }
}

registerProcessor('pcm-recorder', PcmRecorder);
