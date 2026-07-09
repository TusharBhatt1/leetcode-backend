import { Worker } from "bullmq";
import { logger } from "@/config/logger.config";
import { createNewRedisConnection } from "@/config/redis.config";
import { createDockerContainer } from "@/docker/utils/createContainer.util";
import { JAVASCRIPT_IMAGE } from "@/docker/constants";
import { getWrapperJavascriptCode } from "@/docker/utils/wrappedCode.util";
import { Writable } from "stream";

async function setupEvaluationWorker() {
	const worker = new Worker(
		"submission",
		async (job) => {
			logger.info(`Proccessing job ${job.id}`);
			const { id: submissionId, problem, code, language } = job.data;
			const container = await createDockerContainer({
				imageName: JAVASCRIPT_IMAGE,
			});

			await container?.start();
			const exec = await container?.exec({
				Cmd: ["node", "-e", getWrapperJavascriptCode(problem, code)],
				AttachStdin: true,
				AttachStdout: true,
				AttachStderr: true,
			});

			const stream = await exec?.start({});

			let stdoutLogs = "";
			let stderrLogs = "";

			const stdoutTracker = new Writable({
				write(chunk, encoding, callback) {
					stdoutLogs += chunk.toString();
					callback();
				},
			});

			const stderrTracker = new Writable({
				write(chunk, encoding, callback) {
					stderrLogs += chunk.toString();
					callback();
				},
			});

			await new Promise<void>((resolve, reject) => {
				// 1. Declare the timer variable
				let timer: any;

				// 2. Define a cleanup function to prevent memory leaks
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

				const onError = (err: any) => {
					cleanup();
					reject(err || new Error("Stream error"));
				};

				// 3. Set the 10-second timeout
				timer = setTimeout(() => {
					cleanup();
					reject(new Error("Docker stream timed out after 10000ms"));
				}, 10000);

				// 4. Attach listeners and execute
				stream?.on("end", onEnd);
				stream?.on("close", onEnd);
				stream?.on("error", onError);

				container?.modem.demuxStream(stream, stdoutTracker, stderrTracker);
			});

			logger.info(stdoutLogs);
			logger.error(stderrLogs);

			await container?.kill();
			await container?.remove();
		},

		{
			//@ts-ignore
			connection: createNewRedisConnection(),
		},
	);

	worker.on("ready", () => logger.info("Evaluation Worker is ready"));
}

async function startEvaluationWorkers() {
	await setupEvaluationWorker();
}

export { startEvaluationWorkers };
