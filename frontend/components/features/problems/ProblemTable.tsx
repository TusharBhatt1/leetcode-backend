'use client';

import Link from 'next/link';
import { Problem } from '@/app/types/domain';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getDifficultyClasses, formatDate } from '@/app/utils';

interface ProblemTableProps {
  problems?: Problem[];
  isLoading: boolean;
  onRowClick?: (problemId: string) => void;
}

export function ProblemTable({ problems, isLoading, onRowClick }: ProblemTableProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
              Loading problems...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (!problems || problems.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
              No problems found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {problems.map((problem) => (
          <TableRow
            key={problem.id}
            onClick={() => onRowClick?.(problem.id)}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell>
              <Link href={`/problem/${problem.id}`} className="hover:underline font-medium">
                {problem.title}
              </Link>
            </TableCell>
            <TableCell>
              <Badge className={`capitalize border ${getDifficultyClasses(problem.difficulty)}`}>
                {problem.difficulty}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(problem.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
