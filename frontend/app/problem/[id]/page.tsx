"use client";

import { useProblem } from "@/app/hooks/useProblem";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

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
import { useSubmission } from "@/app/hooks/useSubmission";
import { useRunCode } from "@/app/hooks/useRunCode";
import { useRunResult } from "@/app/hooks/useRunResult";

const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  // { label: "TypeScript", value: "typescript" },
  // { label: "Python", value: "python" },
];

interface ProblemFunction {
  name: string;
  parameters: string[];
}

export enum SubmissionStatus {
  PENDING = "pending", // Job is queued
  RUNNING = "running", // Code is currently executing
  ACCEPTED = "accepted", // Passed all test cases
  WRONG_ANSWER = "wrong_answer", // Failed one or more test cases
  ERROR = "error", // Compilation or runtime/system error
}

// ⚠️ Run-result status casing differs from SubmissionStatus (uppercase here vs.
// lowercase there). Kept as-is to match the run hook's actual response — worth
// confirming with the backend whether this is intentional or should be aligned.
export enum RunStatus {
  PENDING = "PENDING",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

// Matches the real API shape: result.results[] with input / expected (any) / passed,
// and an optional `actual` (not currently returned by the submission API, rendered
// defensively). The run endpoint is assumed to return the same shape for sample cases.
interface TestCaseResult {
  input: string;
  expected: unknown;
  actual?: unknown;
  passed: boolean;
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

function formatValue(value: unknown): string {
  if (value === undefined) return "Not returned";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

// Defensively normalizes the run result into TestCaseResult[], since the run
// endpoint's shape isn't fully confirmed yet. Handles either
// { results: TestCaseResult[] } or a bare TestCaseResult[] at the top level.
function extractResults(result: unknown): TestCaseResult[] {
  if (!result) return [];
  if (Array.isArray(result)) return result as TestCaseResult[];
  if (typeof result === "object" && Array.isArray((result as any).results)) {
    return (result as any).results as TestCaseResult[];
  }
  return [];
}

// Renders the console area: idle message, status text, or the result breakdown
function ConsoleView({
  message,
  results,
  showResults,
}: {
  message: string;
  results: TestCaseResult[] | null;
  showResults: boolean;
}) {
  if (!showResults || !results) {
    return (
      <pre className="flex-1 overflow-auto bg-muted p-4 text-sm whitespace-pre-wrap">
        {message}
      </pre>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 space-y-3">
      {results.map((tc, i) => (
        <div
          key={i}
          className={`rounded-md border p-3 text-sm ${
            tc.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
          }`}
        >
          <div className="mb-2 flex items-center gap-2 font-medium">
            {tc.passed ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            Test case {i + 1} — {tc.passed ? "Passed" : "Failed"}
          </div>
          <div className="space-y-1 font-mono text-xs">
            <p>
              <span className="text-muted-foreground">Argument:</span> {tc.input}
            </p>
            <p>
              <span className="text-muted-foreground">Expected:</span>{" "}
              {formatValue(tc.expected)}
            </p>
            <p>
              <span className="text-muted-foreground">Actual:</span>{" "}
              <span className={tc.passed ? "" : "text-red-700 font-semibold"}>
                {formatValue(tc.actual)}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const [submissionId, setSubmissionId] = useState<string>();
  const { data: submission } = useSubmission(submissionId);
  const { data: problem, isLoading, isError } = useProblem(id);

  const [runId, setRunId] = useState<string>();
  const { mutate: runCode, isPending: isRunPending } = useRunCode();
  const { data: runResult } = useRunResult(runId);

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState<string>("");
  const { mutate: submitSolution, isPending: isSubmitting } = useSubmitSolution();

  const [consoleMessage, setConsoleMessage] = useState<string>("Run your code...");
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [showResults, setShowResults] = useState(false);

  // True from the moment a submission is queued until it reaches a terminal status.
  // Derived from the submission's own status, not the query's loading state —
  // isPending on the query only reflects "no data yet", which resolves after the
  // first poll even while the judge is still pending/running.
  const isJudging =
    !!submissionId &&
    (!submission ||
      submission.status === SubmissionStatus.PENDING ||
      submission.status === SubmissionStatus.RUNNING);

  // Same pattern for the Run flow: stays true from the moment a run is queued
  // until the poll comes back COMPLETED or FAILED.
  const isCodeRunning =
    !!runId && (!runResult || runResult.status === RunStatus.PENDING);

  useEffect(() => {
    if (!submission) return;

    const status = submission.status as SubmissionStatus;

    if (status === SubmissionStatus.PENDING) {
      setShowResults(false);
      setConsoleMessage("⏳ Waiting for judge...");
      return;
    }

    if (status === SubmissionStatus.RUNNING) {
      setShowResults(false);
      setConsoleMessage("🏃 Running test cases...");
      return;
    }

    // Terminal states: ACCEPTED | WRONG_ANSWER | ERROR
    const results = submission.result?.results ?? [];
    const passedCount = results.filter((r: TestCaseResult) => r.passed).length;
    const allPassed = status === SubmissionStatus.ACCEPTED;

    setTestResults(results);
    setShowResults(true);

    if (allPassed) {
      toast.success("All test cases passed! 🎉", {
        description: `${results.length}/${results.length} passed`,
      });
    } else if (status === SubmissionStatus.ERROR) {
      toast.error("Runtime error", {
        description: "Your code threw an error during execution.",
      });
    } else if (status === SubmissionStatus.WRONG_ANSWER) {
      toast.error("Wrong answer", {
        description: `${passedCount}/${results.length} passed`,
      });
    }
  }, [submission]);

  useEffect(() => {
    if (!runResult) return;

    switch (runResult.status) {
      case RunStatus.PENDING:
        setShowResults(false);
        setConsoleMessage("Running...");
        break;

      case RunStatus.FAILED:
        setShowResults(false);
        setConsoleMessage(runResult.error ?? "Execution failed.");
        toast.error("Run failed", {
          description: runResult.error ?? "Your code threw an error during execution.",
        });
        break;

      case RunStatus.COMPLETED: {
        const results = extractResults(runResult.result);
        const passedCount = results.filter((r) => r.passed).length;

        setTestResults(results);
        setShowResults(true);

        if (results.length > 0 && passedCount === results.length) {
          toast.success("Sample cases passed! 🎉", {
            description: `${passedCount}/${results.length} passed`,
          });
        } else if (results.length > 0) {
          toast.error("Some sample cases failed", {
            description: `${passedCount}/${results.length} passed`,
          });
        }
        break;
      }
    }
  }, [runResult]);

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

  const handleRun = () => {
    setShowResults(false);
    setTestResults(null);
    setConsoleMessage("Running...");

    runCode(
      { problemId: problem.id, language, code },
      {
        onSuccess: ({ runId }) => {
          setRunId(runId);
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message ?? "Failed to start run.";
          setConsoleMessage(msg);
          toast.error("Run failed", { description: msg });
        },
      }
    );
  };

  const handleSubmit = () => {
    setShowResults(false);
    setConsoleMessage("Submitting...");

    submitSolution(
      {
        problemId: problem.id,
        language,
        code,
      },
      {
        onSuccess: ({ data }) => {
          setSubmissionId(data.id);
          setConsoleMessage(`Submission queued...\nStatus: ${data.status}`);
          toast("Submission queued", {
            description: "Waiting for the judge to pick it up.",
          });
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message ?? "Submission failed.";
          setConsoleMessage(msg);
          toast.error("Submission failed", { description: msg });
        },
      }
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
                        index: number
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
                      )
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
                      disabled={isRunPending || isCodeRunning}
                    >
                      {isRunPending || isCodeRunning ? "Running..." : "Run"}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isJudging}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting || isJudging ? "Submitting..." : "Submit"}
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

            <ResizablePanel defaultSize={30} minSize={15}>
              <div className="flex h-full flex-col">
                <div className="border-b px-4 py-2 text-sm font-semibold">
                  Console
                </div>
                <ConsoleView
                  message={consoleMessage}
                  results={testResults}
                  showResults={showResults}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}