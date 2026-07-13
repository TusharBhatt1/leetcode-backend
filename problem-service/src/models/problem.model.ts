import mongoose, { Schema } from "mongoose";

export interface ITestCase {
	input: string;
	output: string;
}
export interface IProblem {
	title: string;
	function: {
		name: string;
		parameters: string[];
	};
	userId: mongoose.Schema.Types.ObjectId;
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

const functionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Function name is required"],
			maxLength: [100, "Function name must be less than 25 characters"],
			trim: true,
		},
		parameters: [String],
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
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, "User ID is required"],
		},
		function: { type: functionSchema, required: true },
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

problemSchema.index({ title: 1 }, { unique: true });
problemSchema.index({ difficulty: 1 });

export const ProblemModel = mongoose.model<IProblem>("Problem", problemSchema);
