'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { SUPPORTED_LANGUAGES } from '@/app/constants/languages';
import { ProgrammingLanguage } from '@/app/types/domain';

interface EditorToolbarProps {
  language: ProgrammingLanguage;
  onLanguageChange: (language: ProgrammingLanguage) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export function EditorToolbar({
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
  disabled = false,
}: EditorToolbarProps) {
  const isLoading = isRunning || isSubmitting;

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <Select value={language} onValueChange={(val: any) => val && onLanguageChange(val)} disabled={disabled}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRun}
          disabled={isLoading || disabled}
        >
          {isRunning ? 'Running...' : 'Run'}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isLoading || disabled}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}
