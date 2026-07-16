'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageInfo {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevCursor?: string;
  nextCursor?: string;
}

interface ProblemPaginationProps {
  pageInfo?: PageInfo;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

export function ProblemPagination({
  pageInfo,
  onPrevious,
  onNext,
  isLoading = false,
}: ProblemPaginationProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        disabled={!pageInfo?.hasPrevPage || isLoading}
        onClick={onPrevious}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      <Button disabled={!pageInfo?.hasNextPage || isLoading} onClick={onNext}>
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
