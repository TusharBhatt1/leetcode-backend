//@ts-nocheck
import { Writable } from 'stream';

export class DockerLogCapturer {

  async capture(container, stream, timeoutMs = 10000) {
    let stdoutLogs = "";
    let stderrLogs = "";

    // 1. Create custom writable memory streams
    const stdoutTracker = new Writable({
      write(chunk, encoding, callback) {
        stdoutLogs += chunk.toString();
        callback();
      }
    });

    const stderrTracker = new Writable({
      write(chunk, encoding, callback) {
        stderrLogs += chunk.toString();
        callback();
      }
    });

    // 2. Wait for the stream processing to complete
    await new Promise((resolve, reject) => {
      let timer;

      const cleanup = () => {
        clearTimeout(timer);
        stream?.removeListener("end", onEnd);
        stream?.removeListener("close", onEnd);
        stream?.removeListener("error", onError);
      };

      const onEnd = () => {
        cleanup();
        resolve();
      };

      const onError = (err) => {
        cleanup();
        reject(err || new Error("Docker stream error"));
      };

      timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Docker stream timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      stream?.on("end", onEnd);
      stream?.on("close", onEnd);
      stream?.on("error", onError);

      // Route the data into our memory trackers
      container?.modem.demuxStream(stream, stdoutTracker, stderrTracker);
    });

    // 3. Return the result as a clean data object
    return {
      stdout: stdoutLogs,
      stderr: stderrLogs
    };
  }
}