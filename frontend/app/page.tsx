'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Header } from '@/components/common/Header';
import { useProblems } from './hooks/useProblems';

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [cursor, setCursor] = useState<string | undefined>();
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const { data, isLoading } = useProblems({
    search,
    cursor,
    direction,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setCursor(undefined);
  };

  const handlePrevious = () => {
    setDirection('prev');
    setCursor(data?.pageInfo.prevCursor);
  };

  const handleNext = () => {
    setDirection('next');
    setCursor(data?.pageInfo.nextCursor);
  };

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
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Problems</h1>
          <p className="text-muted-foreground">Solve coding challenges and improve your skills</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              className="pl-9"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    Loading problems...
                  </TableCell>
                </TableRow>
              ) : !data?.problems || data.problems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No problems found
                  </TableCell>
                </TableRow>
              ) : (
                data.problems.map((problem: any) => (
                  <TableRow key={problem.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>
                      <Link href={`/problem/${problem.id}`} className="font-medium hover:text-primary">
                        {problem.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={`capitalize border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={!data?.pageInfo.hasPrevPage || isLoading}
            onClick={handlePrevious}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            disabled={!data?.pageInfo.hasNextPage || isLoading}
            onClick={handleNext}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </>
  );
}
