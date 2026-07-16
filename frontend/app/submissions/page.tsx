'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubmissions } from '@/app/hooks/useSubmissions';
import { SubmissionStatus } from '@/app/types/domain';
import { ChevronDown } from 'lucide-react';

export default function SubmissionsPage() {
  const { data: submissions, isLoading, isError } = useSubmissions();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case SubmissionStatus.ACCEPTED:
        return 'bg-green-100 text-green-800 border-green-300';
      case SubmissionStatus.WRONG_ANSWER:
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case SubmissionStatus.ERROR:
        return 'bg-red-100 text-red-800 border-red-300';
      case SubmissionStatus.RUNNING:
      case SubmissionStatus.PENDING:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">Loading submissions...</div>
        </main>
      </>
    );
  }

  if (isError || !submissions) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64 text-red-600">
            Failed to load submissions
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">My Submissions</h1>
            <p className="text-muted-foreground mt-2">
              View all your submitted solutions
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="rounded border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No submissions yet</p>
              <Link href="/">
                <Button className="mt-4">Solve a Problem</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="rounded border bg-card overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === submission.id ? null : submission.id)
                    }
                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div
                        className={`transform transition-transform ${
                          expandedId === submission.id ? 'rotate-180' : ''
                        }`}
                      >
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="flex-1">
                        <Link
                          href={`/problem/${submission.problemId}`}
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          Problem {submission.problemId.slice(0, 8)}...
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(submission.createdAt)}
                        </p>
                      </div>

                      <Badge
                        className={`capitalize border ${getStatusColor(submission.status)}`}
                      >
                        {submission.status.replace(/_/g, ' ')}
                      </Badge>

                      <Badge variant="outline" className="capitalize text-xs">
                        {submission.language}
                      </Badge>
                    </div>
                  </button>

                  {expandedId === submission.id && (
                    <div className="border-t bg-muted/30 p-4 space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Code</h4>
                        <pre className="bg-background rounded p-3 text-xs overflow-x-auto border max-h-64 overflow-y-auto">
                          <code>{submission.code}</code>
                        </pre>
                      </div>

                      {submission.result && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Result</h4>
                          {submission.result?.error && (
                            <div className="bg-red-50 border border-red-300 rounded p-3 text-sm text-red-700">
                              <p className="font-medium">{submission.result.error.name}</p>
                              <p className="text-xs mt-1">
                                {submission.result.error.message}
                              </p>
                            </div>
                          )}

                          {submission.result?.results && submission.result.results.length > 0 && (
                            <div className="space-y-2">
                              {submission.result.results.map((result: any, idx: number) => (
                                <div
                                  key={idx}
                                  className={`rounded border p-2 text-xs ${
                                    result.passed
                                      ? 'border-green-300 bg-green-50'
                                      : 'border-red-300 bg-red-50'
                                  }`}
                                >
                                  <p className={result.passed ? 'text-green-700' : 'text-red-700'}>
                                    Test case {idx + 1}: {result.passed ? '✓ Passed' : '✗ Failed'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <Link href={`/problem/${submission.problemId}`}>
                        <Button size="sm" className="w-full">
                          View Problem
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
