import { Schema } from "mongoose";
import { model } from "mongoose";

export enum SubmissionStatus {
	PENDING = "pending", // Job is queued
	RUNNING = "running", // Code is currently executing
	ACCEPTED = "accepted", // Passed all test cases
	WRONG_ANSWER = "wrong_answer", // Failed one or more test cases
	ERROR = "error", // Compilation or runtime/system error
}

export enum SubmissionLanguage {
	CPP = "cpp",
	PYTHON = "python",
	JAVASCRIPT = "javascript",
	JAVA = "java",
}
export interface ISubmission {
	problemId: string;
	code: string;
	language: SubmissionLanguage;
	status: SubmissionStatus;
	createdAt: Date;
	updatedAt: Date;
	id?:string;
}

const submissionSchema = new Schema<ISubmission>(
	{
		problemId: {
			type: String,
			required: [true, "Problem ID is required"],
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
