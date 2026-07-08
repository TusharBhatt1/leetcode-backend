import { logger } from "@/config/logger.config";
import { docker } from "..";

export interface ICreateDockerContainerOptions {
	name?: string;
	imageName: string;
	commands?: string[];
	memoryLimit: number;
}

export async function createDockerContainer({
	name,
	imageName,
	commands,
	memoryLimit,
}: ICreateDockerContainerOptions) {
	try {
		const container = await docker.createContainer({
			name,
			Image: imageName,
			Cmd: ["node", "-e", "setInterval(() => {}, 1000000)"],
			AttachStdout: true,
			AttachStderr: true,
			Tty: false,
			HostConfig: {
				Memory: memoryLimit,
				PidsLimit: 100, // to limit number of processes
				CpuQuota: 50000,
				CpuPeriod: 100000,
				SecurityOpt: ["no-new-privileges"], //to prevent esacalation
				NetworkMode: "none", // to prevent network access
			},
		});
		return container;
	} catch (error) {
		logger.error("Error with creating/executing docker", error);
	}
}
