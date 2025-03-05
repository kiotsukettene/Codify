export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  java: "15.0.2",
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
    difficulty: "easy",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
    ],
    testCases: {
      nums: [
        [2, 7, 11, 15],
        [3, 2, 4],
        [3, 3],
      ],
      targets: [9, 6, 6],
      answers: [
        [0, 1],
        [1, 2],
        [0, 1],
      ],
    },
    status: "pending",
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your code here\n  return [];\n}`,
      java: `class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n    return new int[]{};\n  }\n}`,
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
          java: `${code}\npublic class Main { public static void main(String[] args) { Solution sol = new Solution(); int[] result = sol.twoSum(new int[]{${numsStr}}, ${target}); System.out.print("[" + result[0] + "," + result[1] + "]"); } }`,
          csharp: `${code}\nclass Program { static void Main(string[] args) { Solution sol = new Solution(); int[] result = sol.TwoSum(new int[]{${numsStr}}, ${target}); System.Console.Write("[" + result[0] + "," + result[1] + "]"); } }`,
          python: `${code}\nresult = two_sum([${numsStr}], ${target})\nprint(str(result).replace(" ", ""))`,
          c: `#include <stdio.h>\n#include <stdlib.h>\n${code}\nint main() { int nums[] = {${numsStr}}; int numsSize = ${numsStr.split(",").length}; int target = ${target}; int returnSize; int* result = twoSum(nums, numsSize, target, &returnSize); printf("[%d,%d]", result[0], result[1]); free(result); return 0; }`,
          cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main() { vector<int> nums = {${numsStr}}; int target = ${target}; Solution sol; vector<int> result = sol.twoSum(nums, target); cout << "[" << result[0] << "," << result[1] << "]"; return 0; }`,
        };
        return templates[language];
      });
      return testCodeSnippets; // Return an array of code snippets to execute
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
  // Other challenges remain unchanged
];

export default challenges;