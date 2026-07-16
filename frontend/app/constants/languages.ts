import { ProgrammingLanguage } from '@/app/types/domain';

export const SUPPORTED_LANGUAGES = [
  { label: 'JavaScript', value: ProgrammingLanguage.JAVASCRIPT },
] as const;

export const LANGUAGE_SNIPPETS: Record<ProgrammingLanguage, (fnName: string, params: string[]) => string> = {
  [ProgrammingLanguage.JAVASCRIPT]: (fnName, params) =>
    `function ${fnName}(${params.join(', ')}) {\n  // your code here\n}`,

  [ProgrammingLanguage.TYPESCRIPT]: (fnName, params) =>
    `function ${fnName}(${params.map(p => `${p}: any`).join(', ')}): any {\n  // your code here\n}`,

  [ProgrammingLanguage.PYTHON]: (fnName, params) =>
    `def ${fnName}(${params.join(', ')}):\n    # your code here\n    pass`,

  [ProgrammingLanguage.JAVA]: (fnName, params) =>
    `public static Object ${fnName}(${params.join(', ')}) {\n    // your code here\n    return null;\n}`,

  [ProgrammingLanguage.CPP]: (fnName, params) =>
    `#include <iostream>\nusing namespace std;\n\nObject ${fnName}(${params.join(', ')}) {\n    // your code here\n}`,
};
