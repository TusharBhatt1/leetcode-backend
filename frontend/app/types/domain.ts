export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum ProgrammingLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
  function: ProblemFunction;
  testCases: TestCase[];
  editorial: string;
}

export interface ProblemFunction {
  name: string;
  parameters: string[];
}

export interface TestCase {
  input: string;
  output: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  problemId: string;
  userId: string;
  language: ProgrammingLanguage;
  code: string;
  status: SubmissionStatus;
  result?: SubmissionResult;
  createdAt: string;
  updatedAt: string;
}

export enum SubmissionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  ACCEPTED = 'accepted',
  WRONG_ANSWER = 'wrong_answer',
  ERROR = 'error',
}

export interface SubmissionResult {
  results: TestCaseResult[];
}

export interface TestCaseResult {
  input: string;
  expected: unknown;
  actual?: unknown;
  passed: boolean;
}

export interface RunResult {
  runId: string;
  status: RunStatus;
  result?: unknown;
  error?: string;
}

export enum RunStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED',
}
