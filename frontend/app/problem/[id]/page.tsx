'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { useProblem } from '@/app/hooks/useProblem';
import { useSubmitSolution } from '@/app/hooks/useSubmitSolution';
import { useSubmission } from '@/app/hooks/useSubmission';
import { useRunCode } from '@/app/hooks/useRunCode';
import { useRunResult } from '@/app/hooks/useRunResult';

const LANGUAGES = [{ label: 'JavaScript', value: 'javascript' }];

enum SubmissionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  ACCEPTED = 'accepted',
  WRONG_ANSWER = 'wrong_answer',
  ERROR = 'error',
}

enum RunStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED',
}

function buildSnippet(language: string, fn: any): string {
  const params = fn.parameters.join(', ');
  if (language === 'javascript') {
    return `function ${fn.name}(${params}) {\n  // your code here\n}`;
  }
  return '';
}

function formatValue(value: unknown): string {
  if (value === undefined) return 'Not returned';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function ConsoleView({
  message,
  results,
  showResults,
}: {
  message: string;
  results: any[] | null;
  showResults: boolean;
}) {
  if (!showResults || !results) {
    return (
      <pre className="flex-1 overflow-auto bg-muted p-4 text-sm whitespace-pre-wrap font-mono">
        {message}
      </pre>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 space-y-3">
      {results.map((tc, i) => (
        <div
          key={i}
          className={`rounded border p-3 text-sm transition-colors ${
            tc.passed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
          }`}
        >
          <div className="mb-2 flex items-center gap-2 font-medium">
            {tc.passed ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            Test case {i + 1} — {tc.passed ? 'Passed' : 'Failed'}
          </div>
          <div className="space-y-1 font-mono text-xs">
            <p>
              <span className="text-muted-foreground">Argument:</span> {tc.input}
            </p>
            <p>
              <span className="text-muted-foreground">Expected:</span>{' '}
              {formatValue(tc.expected)}
            </p>
            <p>
              <span className="text-muted-foreground">Actual:</span>{' '}
              <span className={tc.passed ? '' : 'text-red-700 font-semibold'}>
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
  const { data: problem, isLoading, isError } = useProblem(id);

  const [submissionId, setSubmissionId] = useState<string>();
  const { data: submission } = useSubmission(submissionId);

  const [runId, setRunId] = useState<string>();
  const { mutate: runCode, isPending: isRunPending } = useRunCode();
  const { data: runResult } = useRunResult(runId);

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const { mutate: submitSolution, isPending: isSubmitting } = useSubmitSolution();

  const [consoleMessage, setConsoleMessage] = useState('Run your code...');
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [showResults, setShowResults] = useState(false);

  const isCodeRunning = !!runId && (!runResult || runResult.status === RunStatus.PENDING);
  const isJudging =
    !!submissionId &&
    (!submission ||
      submission.status === SubmissionStatus.PENDING ||
      submission.status === SubmissionStatus.RUNNING);

  useEffect(() => {
    if (problem?.function) {
      setCode(buildSnippet(language, problem.function));
    }
  }, [problem, language]);

  useEffect(() => {
    if (!submission) return;
    const status = submission.status as SubmissionStatus;

    if (status === SubmissionStatus.PENDING) {
      setShowResults(false);
      setConsoleMessage('⏳ Waiting for judge...');
      return;
    }

    if (status === SubmissionStatus.RUNNING) {
      setShowResults(false);
      setConsoleMessage('🏃 Running test cases...');
      return;
    }

    const results = submission.result?.results ?? [];
    const passedCount = results.filter((r: any) => r.passed).length;
    const allPassed = status === SubmissionStatus.ACCEPTED;

    setTestResults(results);
    setShowResults(true);

    if (allPassed) {
      toast.success('All test cases passed! 🎉', {
        description: `${results.length}/${results.length} passed`,
      });
    } else if (status === SubmissionStatus.ERROR) {
      toast.error('Runtime error', { description: 'Your code threw an error.' });
    } else {
      toast.error('Wrong answer', {
        description: `${passedCount}/${results.length} passed`,
      });
    }
  }, [submission]);

  useEffect(() => {
    if (!runResult) return;

    if (runResult.status === RunStatus.PENDING) {
      setShowResults(false);
      setConsoleMessage('Running...');
      return;
    }

    if (runResult.status === RunStatus.FAILED) {
      setShowResults(false);
      setConsoleMessage(runResult.error ?? 'Execution failed.');
      toast.error('Run failed', { description: runResult.error ?? 'Error.' });
      return;
    }

    const results = (Array.isArray(runResult.result)
      ? runResult.result
      : (runResult.result as any)?.results ?? []) as any[];
    const passedCount = results.filter((r) => r.passed).length;

    setTestResults(results);
    setShowResults(true);

    if (results.length > 0 && passedCount === results.length) {
      toast.success('Sample cases passed! 🎉', {
        description: `${passedCount}/${results.length} passed`,
      });
    } else if (results.length > 0) {
      toast.error('Some sample cases failed', {
        description: `${passedCount}/${results.length} passed`,
      });
    }
  }, [runResult]);

  const handleRun = () => {
    setShowResults(false);
    setTestResults(null);
    setConsoleMessage('Running...');

    runCode(
      { problemId: problem!.id, language: language as any, code },
      {
        onSuccess: ({ runId }: any) => {
          setRunId(runId);
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message ?? 'Failed to start run.';
          setConsoleMessage(msg);
          toast.error('Run failed', { description: msg });
        },
      }
    );
  };

  const handleSubmit = () => {
    setShowResults(false);
    setConsoleMessage('Submitting...');

    submitSolution(
      { problemId: problem!.id, language: language as any, code },
      {
        onSuccess: ({ data }: any) => {
          setSubmissionId(data.id);
          setConsoleMessage(`Submission queued...\nStatus: ${data.status}`);
          toast('Submission queued', { description: 'Waiting for judge...' });
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message ?? 'Submission failed.';
          setConsoleMessage(msg);
          toast.error('Submission failed', { description: msg });
        },
      }
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (isError || !problem) {
    return <div className="flex items-center justify-center h-screen">Problem not found.</div>;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen">
      {/* @ts-expect-error todo */ }
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={25}>
          <div className="h-full overflow-y-auto border-r p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <Badge className={`mt-2 capitalize border ${getDifficultyColor(problem.difficulty)}`}>
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
                  <div className="rounded border p-4">
                    <p>
                      <strong>Name:</strong> {problem.function.name}
                    </p>
                    <p className="mt-2">
                      <strong>Parameters:</strong>{' '}
                      {problem.function.parameters.join(', ')}
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 text-lg font-semibold">Examples</h2>
                  <div className="space-y-4">
                    {problem.testCases.map((testCase: any, index: number) => (
                      <div key={index} className="rounded border p-4">
                        <p className="font-medium">Example {index + 1}</p>
                        <pre className="mt-2 whitespace-pre-wrap rounded bg-muted p-3 text-sm">
                          Input: {testCase.input}
                        </pre>
                        <pre className="mt-2 whitespace-pre-wrap rounded bg-muted p-3 text-sm">
                          Output: {testCase.output}
                        </pre>
                      </div>
                    ))}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="editorial" className="mt-4">
                <div className="rounded border p-4 whitespace-pre-wrap">
                  {problem.editorial}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={35}>
          {/* @ts-ignore */}
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} minSize={30}>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <Select value={language} onValueChange={(val) => val && setLanguage(val)}>
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
                      {isRunPending || isCodeRunning ? 'Running...' : 'Run'}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isJudging}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting || isJudging ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </div>

                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value ?? '')}
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
                <div className="border-b px-4 py-3 text-sm font-semibold">Console</div>
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