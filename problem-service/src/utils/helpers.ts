import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { logger } from "../config/logger.config";
import Turndown from "turndown";

export async function getSanitizedMarkDown(markdown: string): Promise<string> {
	try {
		const html = await marked.parse(markdown);
		const cleanHTML = sanitizeHtml(html, {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat([
				"img",
				"pre",
				"code",
			]),
			allowedAttributes: {
				...sanitizeHtml.defaults.allowedAttributes,
				img: ["src", "alt", "width", "height"],
				code: ["class"],
				pre: ["class"],
				a: ["href", "target"],
			},
			allowedSchemes: ["http", "https"],
			allowedSchemesByTag: {
				img: ["http", "https"],
			},
		});

		const turndownService = new Turndown();
		return turndownService.turndown(cleanHTML);
	} catch (error) {
		logger.error("Sanitizing HTML failed");
		return "";
	}
}
