export enum SubmissionLanguage {
	CPP = "cpp",
	PYTHON = "python",
	JAVASCRIPT = "javascript",
	JAVA = "java",
}
export const LANGUAGE_CONFIG = {
  [SubmissionLanguage.CPP]: {
    image: "gcc:latest",
    filename: "main.cpp",
    compile: "g++ main.cpp -o main",
    run: "./main",
  },

  [SubmissionLanguage.PYTHON]: {
    image: "python:3.12",
    filename: "main.py",
    compile: null,
    run: "python main.py",
  },

  [SubmissionLanguage.JAVASCRIPT]: {
    image: "node:22",
    filename: "main.js",
    compile: null,
    run: "node main.js",
  },

  [SubmissionLanguage.JAVA]: {
    image: "eclipse-temurin:21",
    filename: "Main.java",
    compile: "javac Main.java",
    run: "java Main",
  },
} as const;