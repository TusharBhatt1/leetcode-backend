import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateRequestBody =
	(schema: ZodSchema) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const body = req.body;
		try {
			await schema.parseAsync(body);
			next();
		} catch (error) {
			res.status(400).json({
				message:
					error instanceof ZodError
						? error.issues
						: "Request body validation failed",
				success: false,
			});
		}
	};

export const validateRequestParams =
	(schema: ZodSchema) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
            console.log(req.params)
			await schema.parseAsync(req.params);
			next();
		} catch (error) {
			res.status(400).json({
				message:
					error instanceof ZodError
						? error.issues
						: "Param validation failed",
				success: false,
			});
		}
	};
