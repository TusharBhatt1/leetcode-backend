import mongoose, { Schema } from "mongoose";
import { model } from "mongoose";

export enum SubmissionStatus {
	PENDING = "pending", // Job is queued
	RUNNING = "running", // Code is currently executing
	ACCEPTED = "accepted", // Passed all test cases
	WRONG_ANSWER = "wrong_answer", // Failed one or more test cases
	ERROR = "error", // Compilation or runtime/system error
}

export enum SubmissionLanguage {
	JAVASCRIPT = "javascript",
	// CPP = "cpp",
	// PYTHON = "python",
	// JAVA = "java",
}

export interface ISubmissionResult {
	success: boolean;
	results: {
		input: string;
		expected?: unknown;
		actual?: unknown;
		passed: boolean;
		error?: {
			name: string;
			message: string;
		};
	}[];
	error?: {
		name: string;
		message: string;
	};
}

export interface ISubmission {
	problemId: string;
	code: string;
	userId: mongoose.Schema.Types.ObjectId;
	language: SubmissionLanguage;
	status: SubmissionStatus;
	result?: ISubmissionResult;
	createdAt: Date;
	updatedAt: Date;
	id?: string;
	token?:string
}

const resultSchema = new Schema(
	{
		success: {
			type: Boolean,
			required: true,
			default: false,
		},
		results: [
			{
				input: {
					type: String,
					required: true,
				},
				expected: Schema.Types.Mixed,
				actual: Schema.Types.Mixed,
				passed: {
					type: Boolean,
					required: true,
				},
				error: {
					name: String,
					message: String,
				},
			},
		],
		error: {
			name: String,
			message: String,
		},
	},
	{ _id: false },
);

const submissionSchema = new Schema<ISubmission>(
	{
		problemId: {
			type: String,
			required: [true, "Problem ID is required"],
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, "User ID is required"],
		},
		code: {
			type: String,
			required: [true, "Code is required"],
		},
		language: {
			type: String,
			enum: Object.values(SubmissionLanguage),
			required: [true, "Language is required"],
		},
		status: {
			type: String,
			enum: Object.values(SubmissionStatus),
			required: [true, "Status is required"],
			default: SubmissionStatus.PENDING,
		},
		result: {
			type: resultSchema,
			default: undefined,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_doc, ret) => {
				delete (ret as any)?.__v;
				(ret as any).id = ret._id;
				delete (ret as any)?._id;
				return ret;
			},
		},
	},
);

submissionSchema.index({ problemId: 1 });

export const SubmissionModel = model<ISubmission>(
	"submission",
	submissionSchema,
);
