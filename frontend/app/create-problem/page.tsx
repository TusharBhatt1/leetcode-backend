"use client";

import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { apiClient } from "@/app/lib/axios";
import { toast } from "sonner";

export default function CreateProblemPage() {
	const [formData, setFormData] = useState({
		title: "Longest Substring Without Repeating Characters",
		functionName: "lengthOfLongestSubstring",
		parameters: "s",
		description:
			"Given a string s, find the length of the longest substring without repeating characters.",
		difficulty: "medium",
		testCases: '"abcabcbb" → 3\n"bbbbb" → 1\n"pwwkew" → 3\n"" → 0\n"dvdf" → 3',
		editorial:
			"Use a sliding window with a hash map to track the last seen index of each character. Expand the window by moving the right pointer, and when a duplicate character is encountered within the current window, move the left pointer to one position after its previous occurrence. Keep track of the maximum window length.",
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const parseTestCases = (input: string) => {
		return input.split("\n").map((line) => {
			const [inputPart, outputPart] = line.split("→").map((s) => s.trim());
			return {
				input: inputPart,
				output: outputPart,
			};
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const testCases = parseTestCases(formData.testCases);
			const parameters = formData.parameters.split(",").map((p) => p.trim());

			const payload = {
				title: formData.title,
				function: {
					name: formData.functionName,
					parameters,
				},
				description: formData.description,
				difficulty: formData.difficulty,
				testCases,
				editorial: formData.editorial,
			};

			await apiClient.post("/problem/create", payload);
			toast.success("Problem created!", {
				description: "Your problem has been added successfully.",
			});
			setFormData({
				title: "",
				functionName: "",
				parameters: "",
				description: "",
				difficulty: "easy",
				testCases: "",
				editorial: "",
			});
		} catch (error: any) {
			const errorMsg =
				error?.response?.data?.message ||
				"Failed to create problem. Please try again.";

			// Handle authorization error
			if (
				error?.response?.status === 403 ||
				errorMsg.includes("Unauthorized")
			) {
				setError(
					"Only Admin and Problem Setter roles can create problems. Please log in with the appropriate role.",
				);
			} else {
				setError(errorMsg);
			}

			toast.error("Error", { description: errorMsg });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Header />
			<main className="container mx-auto px-4 py-8">
				<div className="space-y-6 max-w-2xl">
					<div>
						<h1 className="text-3xl font-bold">Create Problem</h1>
						<p className="text-muted-foreground mt-2">
							Design a new coding challenge for the community
						</p>
					</div>

					{error && (
						<div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
							{error}
						</div>
					)}

					<form
						onSubmit={handleSubmit}
						className="space-y-6 border rounded-lg p-6"
					>
						<div className="space-y-2">
							<Label htmlFor="title">Problem Title</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => handleChange("title", e.target.value)}
								placeholder="e.g., Two Sum"
								disabled={isLoading}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="functionName">Function Name</Label>
								<Input
									id="functionName"
									value={formData.functionName}
									onChange={(e) => handleChange("functionName", e.target.value)}
									placeholder="e.g., twoSum"
									disabled={isLoading}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="parameters">Parameters (comma separated)</Label>
								<Input
									id="parameters"
									value={formData.parameters}
									onChange={(e) => handleChange("parameters", e.target.value)}
									placeholder="e.g., nums, target"
									disabled={isLoading}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<textarea
								id="description"
								value={formData.description}
								onChange={(e) => handleChange("description", e.target.value)}
								placeholder="Problem description"
								disabled={isLoading}
								className="w-full px-3 py-2 border rounded-md text-sm disabled:opacity-50"
								rows={4}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="difficulty">Difficulty</Label>
							<Select
								value={formData.difficulty}
								onValueChange={(val: any) => handleChange("difficulty", val)}
								disabled={isLoading}
							>
								<SelectTrigger id="difficulty">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="easy">Easy</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="hard">Hard</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="testCases">
								Test Cases (input → output, one per line)
							</Label>
							<textarea
								id="testCases"
								value={formData.testCases}
								onChange={(e) => handleChange("testCases", e.target.value)}
								placeholder="[2,7,11,15], 9 → [0,1]"
								disabled={isLoading}
								className="w-full px-3 py-2 border rounded-md text-sm font-mono text-xs disabled:opacity-50"
								rows={5}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="editorial">Editorial Solution</Label>
							<textarea
								id="editorial"
								value={formData.editorial}
								onChange={(e) => handleChange("editorial", e.target.value)}
								placeholder="Explain the solution approach"
								disabled={isLoading}
								className="w-full px-3 py-2 border rounded-md text-sm disabled:opacity-50"
								rows={4}
							/>
						</div>

						<Button type="submit" disabled={isLoading} className="w-full">
							{isLoading ? "Creating..." : "Create Problem"}
						</Button>
					</form>
				</div>
			</main>
		</>
	);
}
