"use client";

import { useProblem } from "@/app/hooks/useProblem";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSubmitSolution } from "@/app/hooks/useSubmitSolution";
import { submitSolution } from "@/app/apis/queries/mutations/submission";

const LANGUAGES = [
	{ label: "JavaScript", value: "javascript" },
	{ label: "TypeScript", value: "typescript" },
	{ label: "Python", value: "python" },
];

interface ProblemFunction {
	name: string;
	parameters: string[];
}

function buildSnippet(language: string, fn: ProblemFunction): string {
	const params = fn.parameters.join(", ");

	switch (language) {
		case "javascript":
			return `function ${fn.name}(${params}) {\n  // your code here\n}`;
		case "typescript": {
			const typedParams = fn.parameters.map((p) => `${p}: any`).join(", ");
			return `function ${fn.name}(${typedParams}): any {\n  // your code here\n}`;
		}
		case "python":
			return `def ${fn.name}(${params}):\n    # your code here\n    pass`;
		default:
			return "";
	}
}

export default function ProblemPage() {
	const { id } = useParams<{ id: string }>();
	const { data: problem, isLoading, isError } = useProblem(id);

	const [language, setLanguage] = useState("javascript");
	const [code, setCode] = useState<string>("");
    const { mutate: submitSolution, isPending } = useSubmitSolution();
    
	const [consoleOutput, setConsoleOutput] =
		useState<string>("Run your code...");
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		if (problem?.function) {
			setCode(buildSnippet(language, problem.function));
		}
	}, [problem, language]);

	if (isLoading) {
		return <div className="container mx-auto py-8">Loading...</div>;
	}

	if (isError || !problem) {
		return <div className="container mx-auto py-8">Problem not found.</div>;
	}

	const handleRun = async () => {
		setIsRunning(true);
		setConsoleOutput("Running...");
		try {
			// TODO: wire this up to your sandboxed execution service
			setConsoleOutput("(stub) Execution result will appear here.");
		} catch (err) {
			setConsoleOutput(
				err instanceof Error ? err.message : "Execution failed.",
			);
		} finally {
			setIsRunning(false);
		}
	};

	const handleSubmit = () => {
        setConsoleOutput("Submitting...");
      
        submitSolution(
          {
            problemId: problem.id,
            language,
            code,
          },
         
        );
      };

	return (
		<div className="h-screen">
			<ResizablePanelGroup direction="horizontal">
				{/* Left: Description / Editorial */}
				<ResizablePanel defaultSize={50} minSize={25}>
					<div className="h-full overflow-y-auto border-r p-6 space-y-6">
						<div>
							<h1 className="text-2xl font-bold">{problem.title}</h1>
							<Badge variant="secondary" className="mt-2 capitalize">
								{problem.difficulty}
							</Badge>
						</div>

						<Tabs defaultValue="description">
							<TabsList>
								<TabsTrigger value="description">Description</TabsTrigger>
								<TabsTrigger value="editorial">Editorial</TabsTrigger>
							</TabsList>

							<TabsContent value="description" className="space-y-6 mt-4">
								<section>
									<p className="whitespace-pre-wrap">{problem.description}</p>
								</section>

								<section>
									<h2 className="mb-2 text-lg font-semibold">Function</h2>
									<div className="rounded-md border p-4">
										<p>
											<strong>Name:</strong> {problem.function.name}
										</p>
										<p className="mt-2">
											<strong>Parameters:</strong>{" "}
											{problem.function.parameters.join(", ")}
										</p>
									</div>
								</section>

								<section>
									<h2 className="mb-4 text-lg font-semibold">Examples</h2>
									<div className="space-y-4">
										{problem.testCases.map(
											(
												testCase: { input: string; output: string },
												index: number,
											) => (
												<div key={index} className="rounded-md border p-4">
													<p className="font-medium">Example {index + 1}</p>
													<pre className="mt-2 whitespace-pre-wrap rounded bg-muted p-3">
														Input: {testCase.input}
													</pre>
													<pre className="mt-2 whitespace-pre-wrap rounded bg-muted p-3">
														Output: {testCase.output}
													</pre>
												</div>
											),
										)}
									</div>
								</section>
							</TabsContent>

							<TabsContent value="editorial" className="mt-4">
								<div className="rounded-md border p-4 whitespace-pre-wrap">
									{problem.editorial}
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				{/* Right: Editor + Console */}
				<ResizablePanel defaultSize={50} minSize={35}>
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={70} minSize={30}>
							<div className="flex h-full flex-col">
								<div className="flex items-center justify-between border-b px-4 py-2">
									<Select value={language} onValueChange={setLanguage}>
										<SelectTrigger className="w-[160px]">
											<SelectValue placeholder="Language" />
										</SelectTrigger>
										<SelectContent>
											{LANGUAGES.map((lang) => (
												<SelectItem key={lang.value} value={lang.value}>
													{lang.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<div className="flex gap-2">
										<Button
											variant="outline"
											onClick={handleRun}
											disabled={isRunning}
										>
											Run
										</Button>
										<Button
											onClick={handleSubmit}
											disabled={isRunning}
											className="bg-green-600 hover:bg-green-700"
										>
											Submit
										</Button>
									</div>
								</div>

								<div className="flex-1">
									<Editor
										height="100%"
										language={language}
										value={code}
										onChange={(value) => setCode(value ?? "")}
										theme="vs-dark"
										options={{
											minimap: { enabled: false },
											fontSize: 14,
											scrollBeyondLastLine: false,
											automaticLayout: true,
										}}
									/>
								</div>
							</div>
						</ResizablePanel>

						<ResizableHandle withHandle />
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
