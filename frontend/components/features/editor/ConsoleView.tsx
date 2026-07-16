'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { TestCaseResult } from '@/app/types/domain';
import { formatValue } from '@/app/utils';

interface ConsoleViewProps {
  message: string;
  results: TestCaseResult[] | null;
  showResults: boolean;
}

export function ConsoleView({ message, results, showResults }: ConsoleViewProps) {
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
          className={`rounded-md border p-3 text-sm transition-colors ${
            tc.passed
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
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
