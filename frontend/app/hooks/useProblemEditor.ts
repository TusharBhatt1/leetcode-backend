import { useEffect, useState } from 'react';
import { ProgrammingLanguage, Problem, SubmissionStatus, RunStatus, TestCaseResult } from '@/app/types/domain';
import { toast } from 'sonner';
import { buildCodeSnippet } from '@/app/utils/snippets';
import { useSubmitSolution } from './useSubmitSolution';
import { useSubmission } from './useSubmission';
import { useRunCode } from './useRunCode';
import { useRunResult } from './useRunResult';

interface UseProblemEditorProps {
  problem: Problem;
}

export function useProblemEditor({ problem }: UseProblemEditorProps) {
  const [language, setLanguage] = useState<ProgrammingLanguage>(ProgrammingLanguage.JAVASCRIPT);
  const [code, setCode] = useState('');
  const [submissionId, setSubmissionId] = useState<string>();
  const [runId, setRunId] = useState<string>();
  const [consoleMessage, setConsoleMessage] = useState('Run your code...');
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [showResults, setShowResults] = useState(false);

  const { data: submission } = useSubmission(submissionId);
  const { mutate: submitSolution, isPending: isSubmitting } = useSubmitSolution();

  const { mutate: runCode, isPending: isRunPending } = useRunCode();
  const { data: runResult } = useRunResult(runId);

  const isCodeRunning = !!runId && (!runResult || runResult.status === RunStatus.PENDING);
  const isJudging =
    !!submissionId &&
    (!submission ||
      submission.status === SubmissionStatus.PENDING ||
      submission.status === SubmissionStatus.RUNNING);

  useEffect(() => {
    setCode(buildCodeSnippet(language, problem.function));
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
    const passedCount = results.filter((r: TestCaseResult) => r.passed).length;
    const allPassed = status === SubmissionStatus.ACCEPTED;

    setTestResults(results);
    setShowResults(true);

    if (allPassed) {
      toast.success('All test cases passed! 🎉', {
        description: `${results.length}/${results.length} passed`,
      });
    } else if (status === SubmissionStatus.ERROR) {
      toast.error('Runtime error', {
        description: 'Your code threw an error during execution.',
      });
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
      toast.error('Run failed', {
        description: runResult.error ?? 'Your code threw an error during execution.',
      });
      return;
    }

    const results = (Array.isArray(runResult.result)
      ? runResult.result
      : (runResult.result as any)?.results ?? []) as TestCaseResult[];
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
      { problemId: problem.id, language, code },
      {
        onSuccess: ({ data }) => {
          setRunId(data.runId);
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
      { problemId: problem.id, language, code },
      {
        onSuccess: ({ data }) => {
          setSubmissionId(data.id);
          setConsoleMessage(`Submission queued...\nStatus: ${data.status}`);
          toast('Submission queued', {
            description: 'Waiting for the judge to pick it up.',
          });
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message ?? 'Submission failed.';
          setConsoleMessage(msg);
          toast.error('Submission failed', { description: msg });
        },
      }
    );
  };

  return {
    language,
    setLanguage,
    code,
    setCode,
    consoleMessage,
    testResults,
    showResults,
    isCodeRunning,
    isJudging,
    isRunPending,
    isSubmitting,
    handleRun,
    handleSubmit,
  };
}
