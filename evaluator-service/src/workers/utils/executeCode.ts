import {
	getWrapperJavascriptCode,
	IProblem,
} from "@/docker/utils/wrappedCode.util";
import { DockerLogCapturer } from "./capture-docker-logs";
import { createDockerContainer } from "@/docker/utils/createContainer.util";
import { JAVASCRIPT_IMAGE } from "@/docker/constants";
import { logger } from "@/config/logger.config";

export async function initializeContainerAndExecuteCode({
	problem,
	code,
}: {
	problem: IProblem;
	code: string;
}) {
	try {
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
	
		console.log(stdout);
		console.log(stderr);
	
		await container?.kill();
		await container?.remove();
	
		const result = JSON.parse(stdout);
		return result;
	} catch (error) {
		console.log(error)
		logger.error("Initialize code and execute code failed")
	}
	
}
