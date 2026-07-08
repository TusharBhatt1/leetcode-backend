import { logger } from "@/config/logger.config";
import Dockerode from "dockerode";

const IMAGES = ["node:latest"];

async function pullImage(image: string) {
	const docker = new Dockerode();
	return new Promise((res, rej) => {
		docker.pull(image, function (err: Error, stream: NodeJS.ReadableStream) {
			if (err) return rej(err);
			docker.modem.followProgress(
				stream,
				function onFinished(finalErr, output) {
					if (finalErr) return rej(finalErr);
					res(output);
				},
				function onProgress(event) {
					logger.info(`Pulling image:${image}, ${event.status}`);
				},
			);
		});
	});
}

export async function pullAllImages() {
	try {
		await Promise.all(IMAGES.map((i) => pullImage(i)));
		logger.info("All images pulled successfully");
	} catch (error) {
		logger.error("Error pulling images", error);
	}
}
