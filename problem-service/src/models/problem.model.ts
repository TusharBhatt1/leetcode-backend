import mongoose, { Document, Schema } from "mongoose";

export interface ITestCase {
	input: string;
	output: string;
}
export interface IProblem extends Document {
	title: string;
	description: string;
	difficulty: "easy" | "medium" | "hard";
	testCases: ITestCase[];
	editorial?: string;
	createdAt: Date;
	updatedAt: Date;
}

const testSchema = new mongoose.Schema<ITestCase>(
	{
		input: {
			type: String,
			required: [true, "Input is required"],
		},
		output: {
			type: String,
			required: [true, "Output is required"],
		},
	},
	{
		_id: false,
	},
);

const problemSchema = new Schema<IProblem>(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			maxLength: [100, "Title must be less than 100 characters"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Description is requied."],
			trim: true,
		},
		difficulty: {
			type: String,
			enum: {
				values: ["easy", "medium", "hard"],
				message: "Difficulty can be easy, medium or hard",
			},
			default: "easy",
			required: [true, "Difficulty level is required"],
		},
		editorial: {
			type: String,
			trim: true,
		},
		testCases: [testSchema],
	},
	{
		timestamps: true,
	},
);

problemSchema.index({ title: 1 }, { unique: true });
problemSchema.index({ difficulty: 1 });

export const ProblemModel = mongoose.model<IProblem>("Problem", problemSchema);
