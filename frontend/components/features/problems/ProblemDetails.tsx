'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Problem } from '@/app/types/domain';
import { getDifficultyClasses } from '@/app/utils';

interface ProblemDetailsProps {
  problem: Problem;
}

export function ProblemDetails({ problem }: ProblemDetailsProps) {
  return (
    <div className="h-full overflow-y-auto border-r p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{problem.title}</h1>
        <Badge className={`mt-2 capitalize border ${getDifficultyClasses(problem.difficulty)}`}>
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
                <strong>Parameters:</strong> {problem.function.parameters.join(', ')}
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Examples</h2>
            <div className="space-y-4">
              {problem.testCases.map((testCase, index) => (
                <div key={index} className="rounded-md border p-4">
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
          <div className="rounded-md border p-4 whitespace-pre-wrap">
            {problem.editorial}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
