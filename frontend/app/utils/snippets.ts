import { ProgrammingLanguage, ProblemFunction } from '@/app/types/domain';
import { LANGUAGE_SNIPPETS } from '@/app/constants/languages';

export function buildCodeSnippet(language: ProgrammingLanguage, fn: ProblemFunction): string {
  const builder = LANGUAGE_SNIPPETS[language];
  if (!builder) {
    return '';
  }
  return builder(fn.name, fn.parameters);
}
