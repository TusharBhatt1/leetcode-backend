export interface ITestCase {
	input: string;
	output: string;
}
export interface IProblem {
	title: string;
	function: {
		name: string;
		parameters: string[];
	};
	description: string;
	difficulty: "easy" | "medium" | "hard";
	testCases: ITestCase[];
	editorial?: string;
	createdAt: Date;
	updatedAt: Date;
}

//TODO: instead of: {
//   "input": "[2,7,11,15], 9",
//   "output": "[0,1]"
// }
// make it:
// {
//     "input": {
//       "nums": [2, 7, 11, 15],
//       "target": 9
//     },
//     "output": [0, 1]
//   }

export function getWrapperJavascriptCode(problem: IProblem, code: string) {
	const { function: fn, testCases } = problem;

	return `
const testCases = ${JSON.stringify(testCases)};
const results = [];

let userFunction;

try {
	const module = new Function(\`
${code}
return ${fn.name};
\`);

	userFunction = module();

	if (typeof userFunction !== "function") {
		throw new Error("Function '${fn.name}' not found.");
	}
} catch (err) {
	console.log(JSON.stringify({
		success: false,
		error: {
			name: err.name,
			message: err.message,
		},
		results,
	}));
	process.exit(0);
}

try {
	for (const testCase of testCases) {
		try {
			const args = eval(\`[\${testCase.input}]\`);
			const actual = userFunction(...args);
			const expected = JSON.parse(testCase.output);

			results.push({
				input: testCase.input,
				expected,
				actual,
				passed: JSON.stringify(actual) === JSON.stringify(expected),
			});
		} catch (err) {
			results.push({
				input: testCase.input,
				passed: false,
				error: {
					name: err.name,
					message: err.message,
				},
			});
		}
	}

	console.log(JSON.stringify({
		success: true,
		results,
	}));
} catch (err) {
	console.log(JSON.stringify({
		success: false,
		error: {
			name: err.name,
			message: err.message,
		},
		results,
	}));
}
`;
}
