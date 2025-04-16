export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  csharp: "6.12.0",
  python: "3.10.0",
  c: "10.2.0",
  cpp: "10.2.0",
};

const challenges = [
  {
  id: "1",
  title: "Two Sum",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  difficulty: "hard", // Back to reality (unless you insist)
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    { input: "nums = [3,3], target = 6", output: "[0,1]" },
  ],
  testCases: {
    nums: [[2, 7, 11, 15], [3, 2, 4], [3, 3]],
    targets: [9, 6, 6],
    answers: [[0, 1], [1, 2], [0, 1]],
  },
  status: "pending",
  starterCode: {
    javascript: `function twoSum(nums, target) {\n  // Write your code here\n  return [];\n}`,
    csharp: `public class Solution {\n  public int[] TwoSum(int[] nums, int target) {\n    // Write your code here\n    return new int[]{};\n  }\n}`,
    python: `def two_sum(nums, target):\n  # Write your code here\n  return []`,
    c: `#include <stdio.h>\n#include <stdlib.h>\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n  int* result = malloc(2 * sizeof(int));\n  // Write your code here\n  *returnSize = 2;\n  return result;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  std::vector<int> twoSum(std::vector<int>& nums, int target) {\n    // Write your code here\n    return {};\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { nums, targets } = testCases;
    const testCodeSnippets = nums.map((numArray, index) => {
      const numsStr = numArray.join(",");
      const target = targets[index];
      const templates = {
        javascript: `${code}\nconsole.log(JSON.stringify(twoSum([${numsStr}], ${target})));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); int[] result = sol.TwoSum(new int[]{${numsStr}}, ${target}); System.Console.Write("[" + result[0] + "," + result[1] + "]"); } }`,
        python: `${code}\nresult = two_sum([${numsStr}], ${target})\nprint(str(result).replace(" ", ""))`,
        c: `#include <stdio.h>\n#include <stdlib.h>\n${code}\nint main() { int nums[] = {${numsStr}}; int numsSize = ${numsStr.split(",").length}; int target = ${target}; int returnSize; int* result = twoSum(nums, numsSize, target, &returnSize); printf("[%d,%d]", result[0], result[1]); free(result); return 0; }`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main() { vector<int> nums = {${numsStr}}; int target = ${target}; Solution sol; vector<int> result = sol.twoSum(nums, target); cout << "[" << result[0] << "," << result[1] << "]"; return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      const cleanedOutput = output.trim().replace(/\s+/g, "");
      if (cleanedOutput.startsWith("[") && cleanedOutput.endsWith("]")) {
        return JSON.parse(cleanedOutput);
      }
      return cleanedOutput;
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
},
  {
  id: "2",
  title: "Add Two Numbers",
  description: "Given two whole numbers, a and b, add them together and return the result of their sum.",
  difficulty: "easy",
  examples: [
    { input: "a = 2, b = 3", output: "5", explanation: "2 + 3 = 5" },
    { input: "a = 0, b = 0", output: "0" },
    { input: "a = -1, b = 7", output: "6" },
  ],
  testCases: {
    a: [2, 0, -1],
    b: [3, 0, 7],
    answers: [5, 0, 6],
  },
  status: "pending",
  starterCode: {
    javascript: `function addTwoNumbers(a, b) {\n  // Write your code here\n  return 0;\n}`,
    csharp: `public class Solution {\n  public int AddTwoNumbers(int a, int b) {\n    // Write your code here\n    return 0;\n  }\n}`,
    python: `def add_two_numbers(a, b):\n  # Write your code here\n  return 0`,
    c: `#include <stdio.h>\nint addTwoNumbers(int a, int b) {\n  // Write your code here\n  return 0;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  int addTwoNumbers(int a, int b) {\n    // Write your code here\n    return 0;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { a, b } = testCases;
    const testCodeSnippets = a.map((numA, index) => {
      const numB = b[index];
      const templates = {
        javascript: `${code}\nconsole.log(addTwoNumbers(${numA}, ${numB}));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.AddTwoNumbers(${numA}, ${numB})); } }`,
        python: `${code}\nprint(add_two_numbers(${numA}, ${numB}))`,
        c: `#include <stdio.h>\n${code}\nint main() { printf("%d", addTwoNumbers(${numA}, ${numB})); return 0; }`,
        cpp: `#include <iostream>\nusing namespace std;\n${code}\nint main() { Solution sol; cout << sol.addTwoNumbers(${numA}, ${numB}); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      return parseInt(output.trim());
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  
  {
  id: "3",
  title: "Subtract Two Numbers",
  description: "Given two integers a and b, return the result of a minus b.",
  difficulty: "easy",
  examples: [
    { input: "a = 5, b = 3", output: "2", explanation: "5 - 3 = 2" },
    { input: "a = 0, b = 7", output: "-7" },
    { input: "a = -2, b = -3", output: "1" },
  ],
  testCases: {
    a: [5, 0, -2],
    b: [3, 7, -3],
    answers: [2, -7, 1],
  },
  status: "pending",
  starterCode: {
    javascript: `function subtractTwoNumbers(a, b) {\n  // Write your code here\n  return 0;\n}`,
    csharp: `public class Solution {\n  public int SubtractTwoNumbers(int a, int b) {\n    // Write your code here\n    return 0;\n  }\n}`,
    python: `def subtract_two_numbers(a, b):\n  # Write your code here\n  return 0`,
    c: `#include <stdio.h>\nint subtractTwoNumbers(int a, int b) {\n  // Write your code here\n  return 0;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  int subtractTwoNumbers(int a, int b) {\n    // Write your code here\n    return 0;\n  }\n};`,
},
  runCode: (language, code, testCases) => {
    const { a, b } = testCases;
    const testCodeSnippets = a.map((numA, index) => {
      const numB = b[index];
      const templates = {
        javascript: `${code}\nconsole.log(subtractTwoNumbers(${numA}, ${numB}));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.SubtractTwoNumbers(${numA}, ${numB})); } }`,
        python: `${code}\nprint(subtract_two_numbers(${numA}, ${numB}))`,
        c: `#include <stdio.h>\n${code}\nint main() { printf("%d", subtractTwoNumbers(${numA}, ${numB})); return 0; }`,
        cpp: `#include <iostream>\nusing namespace std;\n${code}\nint main() { Solution sol; cout << sol.subtractTwoNumbers(${numA}, ${numB}); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      return parseInt(output.trim());
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "4",
  title: "Is Positive",
  description: "Given an integer n, return true if it is positive (greater than 0), false otherwise.",
  difficulty: "easy",
  examples: [
    { input: "n = 5", output: "true", explanation: "5 > 0, so true" },
    { input: "n = -3", output: "false" },
    { input: "n = 0", output: "false" },
  ],
  testCases: {
    n: [5, -3, 0],
    answers: [true, false, false],
  },
  status: "pending",
  starterCode: {
    javascript: `function isPositive(n) {\n  // Write your code here\n  return false;\n}`,
    csharp: `public class Solution {\n  public bool IsPositive(int n) {\n    // Write your code here\n    return false;\n  }\n}`,
    python: `def is_positive(n):\n  # Write your code here\n  return False`,
    c: `#include <stdbool.h>\nbool isPositive(int n) {\n  // Write your code here\n  return false;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  bool isPositive(int n) {\n    // Write your code here\n    return false;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { n } = testCases;
    const testCodeSnippets = n.map((num) => {
      const templates = {
        javascript: `${code}\nconsole.log(isPositive(${num}));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.IsPositive(${num})); } }`,
        python: `${code}\nprint(str(is_positive(${num})).lower())`,
        c: `#include <stdio.h>\n${code}\nint main() { printf("%d", isPositive(${num})); return 0; }`,
        cpp: `#include <iostream>\nusing namespace std;\n${code}\nint main() { Solution sol; cout << (sol.isPositive(${num}) ? "1" : "0"); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      const trimmed = output.trim().toLowerCase();
      return trimmed === "true" || trimmed === "1";
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "5",
  title: "Max of Three",
  description: "Given three integers a, b, and c, return the largest value.",
  difficulty: "easy",
  examples: [
    { input: "a = 1, b = 5, c = 3", output: "5", explanation: "5 is the largest" },
    { input: "a = -2, b = -5, c = -1", output: "-1" },
    { input: "a = 4, b = 4, c = 4", output: "4" },
  ],
  testCases: {
    a: [1, -2, 4],
    b: [5, -5, 4],
    c: [3, -1, 4],
    answers: [5, -1, 4],
  },
  status: "pending",
  starterCode: {
    javascript: `function maxOfThree(a, b, c) {\n  // Write your code here\n  return 0;\n}`,
    csharp: `public class Solution {\n  public int MaxOfThree(int a, int b, int c) {\n    // Write your code here\n    return 0;\n  }\n}`,
    python: `def max_of_three(a, b, c):\n  # Write your code here\n  return 0`,
    c: `#include <stdio.h>\nint maxOfThree(int a, int b, int c) {\n  // Write your code here\n  return 0;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  int maxOfThree(int a, int b, int c) {\n    // Write your code here\n    return 0;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { a, b, c } = testCases;
    const testCodeSnippets = a.map((numA, index) => {
      const numB = b[index];
      const numC = c[index];
      const templates = {
        javascript: `${code}\nconsole.log(maxOfThree(${numA}, ${numB}, ${numC}));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.MaxOfThree(${numA}, ${numB}, ${numC})); } }`,
        python: `${code}\nprint(max_of_three(${numA}, ${numB}, ${numC}))`,
        c: `#include <stdio.h>\n${code}\nint main() { printf("%d", maxOfThree(${numA}, ${numB}, ${numC})); return 0; }`,
        cpp: `#include <iostream>\nusing namespace std;\n${code}\nint main() { Solution sol; cout << sol.maxOfThree(${numA}, ${numB}, ${numC}); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      return parseInt(output.trim());
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "6",
  title: "Sum of Array",
  description: "Given an array of integers nums, return the sum of all elements.",
  difficulty: "easy",
  examples: [
    { input: "nums = [1,2,3]", output: "6", explanation: "1 + 2 + 3 = 6" },
    { input: "nums = [0, -1, 5]", output: "4" },
    { input: "nums = []", output: "0" },
  ],
  testCases: {
    nums: [[1, 2, 3], [0, -1, 5], []],
    answers: [6, 4, 0],
  },
  status: "pending",
  starterCode: {
    javascript: `function sumOfArray(nums) {\n  // Write your code here\n  return 0;\n}`,
    csharp: `public class Solution {\n  public int SumOfArray(int[] nums) {\n    // Write your code here\n    return 0;\n  }\n}`,
    python: `def sum_of_array(nums):\n  # Write your code here\n  return 0`,
    c: `#include <stdio.h>\nint sumOfArray(int* nums, int numsSize) {\n  // Write your code here\n  return 0;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  int sumOfArray(std::vector<int>& nums) {\n    // Write your code here\n    return 0;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { nums } = testCases;
    const testCodeSnippets = nums.map((numArray) => {
      const numsStr = numArray.join(",");
      const templates = {
        javascript: `${code}\nconsole.log(sumOfArray([${numsStr}])));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.SumOfArray(new int[]{${numsStr}})); } }`,
        python: `${code}\nprint(sum_of_array([${numsStr}]))`,
        c: `#include <stdio.h>\n${code}\nint main() { int nums[] = {${numsStr}}; int numsSize = ${numsStr ? numsStr.split(",").length : 0}; printf("%d", sumOfArray(nums, numsSize)); return 0; }`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main() { vector<int> nums = {${numsStr}}; Solution sol; cout << sol.sumOfArray(nums); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      return parseInt(output.trim());
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "7",
  title: "Reverse Array",
  description: "Given an array of integers nums, return the array with its elements in reverse order.",
  difficulty: "medium",
  examples: [
    { input: "nums = [1,2,3]", output: "[3,2,1]", explanation: "Reversed order" },
    { input: "nums = [5]", output: "[5]" },
    { input: "nums = [0, -1, 2]", output: "[2, -1, 0]" },
  ],
  testCases: {
    nums: [[1, 2, 3], [5], [0, -1, 2]],
    answers: [[3, 2, 1], [5], [2, -1, 0]],
  },
  status: "pending",
  starterCode: {
    javascript: `function reverseArray(nums) {\n  // Write your code here\n  return [];\n}`,
    csharp: `public class Solution {\n  public int[] ReverseArray(int[] nums) {\n    // Write your code here\n    return new int[]{};\n  }\n}`,
    python: `def reverse_array(nums):\n  # Write your code here\n  return []`,
    c: `#include <stdio.h>\n#include <stdlib.h>\nint* reverseArray(int* nums, int numsSize, int* returnSize) {\n  int* result = malloc(numsSize * sizeof(int));\n  // Write your code here\n  *returnSize = numsSize;\n  return result;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  std::vector<int> reverseArray(std::vector<int>& nums) {\n    // Write your code here\n    return {};\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { nums } = testCases;
    const testCodeSnippets = nums.map((numArray) => {
      const numsStr = numArray.join(",");
      const templates = {
        javascript: `${code}\nconsole.log(JSON.stringify(reverseArray([${numsStr}])));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); int[] result = sol.ReverseArray(new int[]{${numsStr}}); System.Console.Write("[" + string.Join(",", result) + "]"); } }`,
        python: `${code}\nresult = reverse_array([${numsStr}])\nprint(str(result).replace(" ", ""))`,
        c: `#include <stdio.h>\n#include <stdlib.h>\n${code}\nint main() { int nums[] = {${numsStr}}; int numsSize = ${numsStr ? numsStr.split(",").length : 0}; int returnSize; int* result = reverseArray(nums, numsSize, &returnSize); printf("["); for(int i = 0; i < returnSize; i++) { printf("%d%s", result[i], i < returnSize - 1 ? "," : ""); } printf("]"); free(result); return 0; }`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main() { vector<int> nums = {${numsStr}}; Solution sol; vector<int> result = sol.reverseArray(nums); cout << "["; for(size_t i = 0; i < result.size(); i++) { cout << result[i] << (i < result.size() - 1 ? "," : ""); } cout << "]"; return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      const cleanedOutput = output.trim().replace(/\s+/g, "");
      if (cleanedOutput.startsWith("[") && cleanedOutput.endsWith("]")) {
        return JSON.parse(cleanedOutput);
      }
      return cleanedOutput;
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "8",
  title: "Count Evens",
  description: "Given an array of integers nums, return the number of even elements.",
  difficulty: "medium",
  examples: [
    { input: "nums = [1,2,3,4]", output: "2", explanation: "2 and 4 are even" },
    { input: "nums = [1,3,5]", output: "0" },
    { input: "nums = [2,4,6,8]", output: "4" },
  ],
  testCases: {
    nums: [[1, 2, 3, 4], [1, 3, 5], [2, 4, 6, 8]],
    answers: [2, 0, 4],
  },
  status: "pending",
  starterCode: {
    javascript: `function countEvens(nums) {\n  // Write your code here\n  return 0;\n}`,
    csharp: `public class Solution {\n  public int CountEvens(int[] nums) {\n    // Write your code here\n    return 0;\n  }\n}`,
    python: `def count_evens(nums):\n  # Write your code here\n  return 0`,
    c: `#include <stdio.h>\nint countEvens(int* nums, int numsSize) {\n  // Write your code here\n  return 0;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  int countEvens(std::vector<int>& nums) {\n    // Write your code here\n    return 0;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { nums } = testCases;
    const testCodeSnippets = nums.map((numArray) => {
      const numsStr = numArray.join(",");
      const templates = {
        javascript: `${code}\nconsole.log(countEvens([${numsStr}])));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.CountEvens(new int[]{${numsStr}})); } }`,
        python: `${code}\nprint(count_evens([${numsStr}]))`,
        c: `#include <stdio.h>\n${code}\nint main() { int nums[] = {${numsStr}}; int numsSize = ${numsStr.split(",").length}; printf("%d", countEvens(nums, numsSize)); return 0; }`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main() { vector<int> nums = {${numsStr}}; Solution sol; cout << sol.countEvens(nums); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      return parseInt(output.trim());
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "9",
  title: "Is Even",
  description: "Given an integer n, return true if it is even (divisible by 2), false otherwise.",
  difficulty: "easy",
  examples: [
    { input: "n = 4", output: "true", explanation: "4 is divisible by 2" },
    { input: "n = 7", output: "false" },
    { input: "n = 0", output: "true" },
  ],
  testCases: {
    n: [4, 7, 0],
    answers: [true, false, true],
  },
  status: "pending",
  starterCode: {
    javascript: `function isEven(n) {\n  // Write your code here\n  return false;\n}`,
    csharp: `public class Solution {\n  public bool IsEven(int n) {\n    // Write your code here\n    return false;\n  }\n}`,
    python: `def is_even(n):\n  # Write your code here\n  return False`,
    c: `#include <stdbool.h>\nbool isEven(int n) {\n  // Write your code here\n  return false;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  bool isEven(int n) {\n    // Write your code here\n    return false;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { n } = testCases;
    const testCodeSnippets = n.map((num) => {
      const templates = {
        javascript: `${code}\nconsole.log(isEven(${num}));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.IsEven(${num})); } }`,
        python: `${code}\nprint(str(is_even(${num})).lower())`,
        c: `#include <stdio.h>\n${code}\nint main() { printf("%d", isEven(${num})); return 0; }`,
        cpp: `#include <iostream>\nusing namespace std;\n${code}\nint main() { Solution sol; cout << (sol.isEven(${num}) ? "1" : "0"); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      const trimmed = output.trim().toLowerCase();
      return trimmed === "true" || trimmed === "1";
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "10",
  title: "Absolute Value",
  description: "Given an integer n, return its absolute value (non-negative magnitude).",
  difficulty: "easy",
  examples: [
    { input: "n = 5", output: "5", explanation: "Absolute value of 5 is 5" },
    { input: "n = -3", output: "3" },
    { input: "n = 0", output: "0" },
  ],
  testCases: {
    n: [5, -3, 0],
    answers: [5, 3, 0],
  },
  status: "pending",
  starterCode: {
    javascript: `function absoluteValue(n) {\n  // Write your code here\n  return 0;\n}`,
    csharp: `public class Solution {\n  public int AbsoluteValue(int n) {\n    // Write your code here\n    return 0;\n  }\n}`,
    python: `def absolute_value(n):\n  # Write your code here\n  return 0`,
    c: `#include <stdio.h>\nint absoluteValue(int n) {\n  // Write your code here\n  return 0;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  int absoluteValue(int n) {\n    // Write your code here\n    return 0;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { n } = testCases;
    const testCodeSnippets = n.map((num) => {
      const templates = {
        javascript: `${code}\nconsole.log(absoluteValue(${num}));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.AbsoluteValue(${num})); } }`,
        python: `${code}\nprint(absolute_value(${num}))`,
        c: `#include <stdio.h>\n${code}\nint main() { printf("%d", absoluteValue(${num})); return 0; }`,
        cpp: `#include <iostream>\nusing namespace std;\n${code}\nint main() { Solution sol; cout << sol.absoluteValue(${num}); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      return parseInt(output.trim());
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "11",
  title: "First Element",
  description: "Given an array of integers nums, return the first element. Return -1 if the array is empty.",
  difficulty: "easy",
  examples: [
    { input: "nums = [1,2,3]", output: "1", explanation: "First element is 1" },
    { input: "nums = [5]", output: "5" },
    { input: "nums = []", output: "-1" },
  ],
  testCases: {
    nums: [[1, 2, 3], [5], []],
    answers: [1, 5, -1],
  },
  status: "pending",
  starterCode: {
    javascript: `function firstElement(nums) {\n  // Write your code here\n  return -1;\n}`,
    csharp: `public class Solution {\n  public int FirstElement(int[] nums) {\n    // Write your code here\n    return -1;\n  }\n}`,
    python: `def first_element(nums):\n  # Write your code here\n  return -1`,
    c: `#include <stdio.h>\nint firstElement(int* nums, int numsSize) {\n  // Write your code here\n  return -1;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  int firstElement(std::vector<int>& nums) {\n    // Write your code here\n    return -1;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { nums } = testCases;
    const testCodeSnippets = nums.map((numArray) => {
      const numsStr = numArray.join(",");
      const templates = {
        javascript: `${code}\nconsole.log(firstElement([${numsStr}])));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.FirstElement(new int[]{${numsStr}})); } }`,
        python: `${code}\nprint(first_element([${numsStr}]))`,
        c: `#include <stdio.h>\n${code}\nint main() { int nums[] = {${numsStr}}; int numsSize = ${numsStr ? numsStr.split(",").length : 0}; printf("%d", firstElement(nums, numsSize)); return 0; }`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main() { vector<int> nums = {${numsStr}}; Solution sol; cout << sol.firstElement(nums); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      return parseInt(output.trim());
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "12",
  title: "Contains Target",
  description: "Given an array of integers nums and an integer target, return true if target exists in nums, false otherwise.",
  difficulty: "medium",
  examples: [
    { input: "nums = [1,2,3], target = 2", output: "true", explanation: "2 exists in the array" },
    { input: "nums = [4,5,6], target = 7", output: "false" },
    { input: "nums = [], target = 1", output: "false" },
  ],
  testCases: {
    nums: [[1, 2, 3], [4, 5, 6], []],
    targets: [2, 7, 1],
    answers: [true, false, false],
  },
  status: "pending",
  starterCode: {
    javascript: `function containsTarget(nums, target) {\n  // Write your code here\n  return false;\n}`,
    csharp: `public class Solution {\n  public bool ContainsTarget(int[] nums, int target) {\n    // Write your code here\n    return false;\n  }\n}`,
    python: `def contains_target(nums, target):\n  # Write your code here\n  return False`,
    c: `#include <stdbool.h>\nbool containsTarget(int* nums, int numsSize, int target) {\n  // Write your code here\n  return false;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  bool containsTarget(std::vector<int>& nums, int target) {\n    // Write your code here\n    return false;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { nums, targets } = testCases;
    const testCodeSnippets = nums.map((numArray, index) => {
      const numsStr = numArray.join(",");
      const target = targets[index];
      const templates = {
        javascript: `${code}\nconsole.log(containsTarget([${numsStr}], ${target}));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.ContainsTarget(new int[]{${numsStr}}, ${target})); } }`,
        python: `${code}\nprint(str(contains_target([${numsStr}], ${target})).lower())`,
        c: `#include <stdio.h>\n${code}\nint main() { int nums[] = {${numsStr}}; int numsSize = ${numsStr ? numsStr.split(",").length : 0}; printf("%d", containsTarget(nums, numsSize, ${target})); return 0; }`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main() { vector<int> nums = {${numsStr}}; int target = ${target}; Solution sol; cout << (sol.containsTarget(nums, target) ? "1" : "0"); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      const trimmed = output.trim().toLowerCase();
      return trimmed === "true" || trimmed === "1";
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "13",
  title: "Swap Ends",
  description: "Given an array of integers nums, swap its first and last elements and return the modified array. If the array has less than 2 elements, return it unchanged.",
  difficulty: "medium",
  examples: [
    { input: "nums = [1,2,3]", output: "[3,2,1]", explanation: "Swap 1 and 3" },
    { input: "nums = [5]", output: "[5]" },
    { input: "nums = [1,2]", output: "[2,1]" },
  ],
  testCases: {
    nums: [[1, 2, 3], [5], [1, 2]],
    answers: [[3, 2, 1], [5], [2, 1]],
  },
  status: "pending",
  starterCode: {
    javascript: `function swapEnds(nums) {\n  // Write your code here\n  return nums;\n}`,
    csharp: `public class Solution {\n  public int[] SwapEnds(int[] nums) {\n    // Write your code here\n    return nums;\n  }\n}`,
    python: `def swap_ends(nums):\n  # Write your code here\n  return nums`,
    c: `#include <stdio.h>\n#include <stdlib.h>\nint* swapEnds(int* nums, int numsSize, int* returnSize) {\n  int* result = malloc(numsSize * sizeof(int));\n  for (int i = 0; i < numsSize; i++) result[i] = nums[i];\n  // Write your code here\n  *returnSize = numsSize;\n  return result;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  std::vector<int> swapEnds(std::vector<int>& nums) {\n    // Write your code here\n    return nums;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { nums } = testCases;
    const testCodeSnippets = nums.map((numArray) => {
      const numsStr = numArray.join(",");
      const templates = {
        javascript: `${code}\nconsole.log(JSON.stringify(swapEnds([${numsStr}])));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); int[] result = sol.SwapEnds(new int[]{${numsStr}}); System.Console.Write("[" + string.Join(",", result) + "]"); } }`,
        python: `${code}\nresult = swap_ends([${numsStr}])\nprint(str(result).replace(" ", ""))`,
        c: `#include <stdio.h>\n#include <stdlib.h>\n${code}\nint main() { int nums[] = {${numsStr}}; int numsSize = ${numsStr ? numsStr.split(",").length : 0}; int returnSize; int* result = swapEnds(nums, numsSize, &returnSize); printf("["); for(int i = 0; i < returnSize; i++) { printf("%d%s", result[i], i < returnSize - 1 ? "," : ""); } printf("]"); free(result); return 0; }`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main() { vector<int> nums = {${numsStr}}; Solution sol; vector<int> result = sol.swapEnds(nums); cout << "["; for(size_t i = 0; i < result.size(); i++) { cout << result[i] << (i < result.size() - 1 ? "," : ""); } cout << "]"; return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      const cleanedOutput = output.trim().replace(/\s+/g, "");
      if (cleanedOutput.startsWith("[") && cleanedOutput.endsWith("]")) {
        return JSON.parse(cleanedOutput);
      }
      return cleanedOutput;
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "14",
  title: "Is Palindrome",
  description: "Given a string s, return true if it is a palindrome (reads the same forward and backward), false otherwise. Ignore case and non-alphanumeric characters.",
  difficulty: "medium",
  examples: [
    { input: 's = "racecar"', output: "true", explanation: "racecar reads the same backward" },
    { input: 's = "hello"', output: "false" },
    { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
  ],
  testCases: {
    s: ["racecar", "hello", "A man, a plan, a canal: Panama"],
    answers: [true, false, true],
  },
  status: "pending",
  starterCode: {
    javascript: `function isPalindrome(s) {\n  // Write your code here\n  return false;\n}`,
    csharp: `public class Solution {\n  public bool IsPalindrome(string s) {\n    // Write your code here\n    return false;\n  }\n}`,
    python: `def is_palindrome(s):\n  # Write your code here\n  return False`,
    c: `#include <stdbool.h>\n#include <string.h>\nbool isPalindrome(char* s) {\n  // Write your code here\n  return false;\n}`,
    cpp: `#include <string>\nclass Solution {\npublic:\n  bool isPalindrome(std::string s) {\n    // Write your code here\n    return false;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { s } = testCases;
    const testCodeSnippets = s.map((str) => {
      const strLiteral = `"${str.replace(/"/g, '\\"')}"`; // Escape quotes
      const templates = {
        javascript: `${code}\nconsole.log(isPalindrome(${strLiteral}));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.IsPalindrome(${strLiteral})); } }`,
        python: `${code}\nprint(str(is_palindrome(${strLiteral})).lower())`,
        c: `#include <stdio.h>\n${code}\nint main() { char s[] = ${strLiteral}; printf("%d", isPalindrome(s)); return 0; }`,
        cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n${code}\nint main() { string s = ${strLiteral}; Solution sol; cout << (sol.isPalindrome(s) ? "1" : "0"); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      const trimmed = output.trim().toLowerCase();
      return trimmed === "true" || trimmed === "1";
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
  },
  {
  id: "15",
  title: "Find Median",
  description: "Given an array of integers nums, return the median value. If the array length is odd, return the middle element; if even, return the average of the two middle elements.",
  difficulty: "hard",
  examples: [
    { input: "nums = [3,1,2]", output: "2", explanation: "Sorted: [1,2,3], median is 2" },
    { input: "nums = [4,1,3,2]", output: "2.5", explanation: "Sorted: [1,2,3,4], median is (2+3)/2 = 2.5" },
    { input: "nums = [5]", output: "5" },
  ],
  testCases: {
    nums: [[3, 1, 2], [4, 1, 3, 2], [5]],
    answers: [2, 2.5, 5],
  },
  status: "pending",
  starterCode: {
    javascript: `function findMedian(nums) {\n  // Write your code here\n  return 0;\n}`,
    csharp: `public class Solution {\n  public double FindMedian(int[] nums) {\n    // Write your code here\n    return 0;\n  }\n}`,
    python: `def find_median(nums):\n  # Write your code here\n  return 0`,
    c: `#include <stdio.h>\ndouble findMedian(int* nums, int numsSize) {\n  // Write your code here\n  return 0;\n}`,
    cpp: `#include <vector>\nclass Solution {\npublic:\n  double findMedian(std::vector<int>& nums) {\n    // Write your code here\n    return 0;\n  }\n};`,
  },
  runCode: (language, code, testCases) => {
    const { nums } = testCases;
    const testCodeSnippets = nums.map((numArray) => {
      const numsStr = numArray.join(",");
      const templates = {
        javascript: `${code}\nconsole.log(findMedian([${numsStr}])));`,
        csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); System.Console.Write(sol.FindMedian(new int[]{${numsStr}})); } }`,
        python: `${code}\nprint(find_median([${numsStr}]))`,
        c: `#include <stdio.h>\n${code}\nint main() { int nums[] = {${numsStr}}; int numsSize = ${numsStr ? numsStr.split(",").length : 0}; printf("%f", findMedian(nums, numsSize)); return 0; }`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main() { vector<int> nums = {${numsStr}}; Solution sol; cout << sol.findMedian(nums); return 0; }`,
      };
      return templates[language];
    });
    return testCodeSnippets;
  },
  parseOutput: (output) => {
    if (/error/i.test(output)) return output;
    try {
      return parseFloat(output.trim());
    } catch (e) {
      console.log("Parse error, raw output:", output);
      return output;
    }
  },
},
];

export default challenges;