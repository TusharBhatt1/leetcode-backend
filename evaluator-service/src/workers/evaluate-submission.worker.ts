import { Worker } from "bullmq";
import { logger } from "@/config/logger.config";
import { createNewRedisConnection } from "@/config/redis.config";
import { createDockerContainer } from "@/docker/utils/createContainer.util";
import { JAVASCRIPT_IMAGE } from "@/docker/constants";
import { getWrapperJavascriptCode } from "@/docker/utils/wrappedCode.util";
import { Writable } from "stream";
import { DockerLogCapturer } from "./utils/capture-docker-logs";
import { updateSubmissionStatus } from "@/apis/updateSubmissionStatus";

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

			const dockerCapture = new DockerLogCapturer();
			const { stdout, stderr } = await dockerCapture.capture(container, stream);
			const result = JSON.parse(stdout) as {
				success: boolean;
				results: {
					input: string;
					expected: any;
					actual: any;
					passed: boolean;
					error?:{
						name:string,
						message:string
					}
				}[];
			};

			console.log(stdout)
			console.log(stderr)

			await container?.kill();
			await container?.remove();

			const allPassed = result.results.every((r) => r.passed);
			const error=result.results.some((r)=>r.error)

			await updateSubmissionStatus(allPassed, error, submissionId);
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
