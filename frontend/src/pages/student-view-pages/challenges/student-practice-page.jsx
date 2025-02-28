import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Play, Send, Sparkles, Loader2, Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CodeTimer from "@/components/student-view/timer";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import TestCases from "@/components/student-view/test-cases";
import { useToast } from "@/hooks/use-toast";
import { CODING_CHALLENGES, LANGUAGE_VERSIONS } from "@/constants";
import axios from "axios";

function StudentPracticePage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  const [testResults, setTestResults] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const selectedChallenge = CODING_CHALLENGES.find((c) => c.id === parseInt(id));
    if (selectedChallenge) {
      setChallenge(selectedChallenge);
      setValue(selectedChallenge.starterCode[language].trim());
    }
  }, [id, language]);

  const executeCode = async (code) => {
    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: language,
          version: LANGUAGE_VERSIONS[language],
          files: [{ content: code }],
        },
        { withCredentials: false }
      );
      return response.data.run.output.trim();
    } catch (error) {
      console.error("Execution failed:", error);
      return `Error executing code: ${error.message}`;
    }
  };

  const generateExecutionCode = (challengeId, lang, code, testCase) => {
    let nums, target, inputStr;

    switch (challengeId) {
      case 1: // Two Sum
        [nums, target] = testCase.input.split(", ");
        nums = JSON.parse(nums);
        inputStr = nums.join(",");
        break;
      case 2: // Reverse a String
        inputStr = testCase.input.replace(/"/g, "");
        break;
      case 3: // Palindrome Number
        inputStr = testCase.input;
        break;
      case 4: // Find the Missing Number
        nums = JSON.parse(testCase.input);
        inputStr = nums.join(",");
        break;
      case 5: // Valid Parentheses
        inputStr = testCase.input.replace(/"/g, "");
        break;
      case 6: // Maximum Subarray
        nums = JSON.parse(testCase.input);
        inputStr = nums.join(",");
        break;
      case 7: // Longest Common Prefix
        nums = JSON.parse(testCase.input);
        inputStr = nums.map(s => `"${s}"`).join(",");
        break;
      default:
        return code;
    }

    switch (lang) {
      case "javascript":
        return {
          1: `${code}\nconsole.log(JSON.stringify(twoSum([${inputStr}], ${target})));`,
          2: `${code}\nconsole.log(JSON.stringify(reverseString("${inputStr}")));`,
          3: `${code}\nconsole.log(isPalindrome(${inputStr}));`,
          4: `${code}\nconsole.log(missingNumber([${inputStr}]));`,
          5: `${code}\nconsole.log(isValid("${inputStr}"));`,
          6: `${code}\nconsole.log(maxSubArray([${inputStr}]));`,
          7: `${code}\nconsole.log(longestCommonPrefix([${inputStr}]))`,
        }[challengeId];
      case "java":
        return {
          1: `${code}\npublic class Main { public static void main(String[] args) { Solution sol = new Solution(); int[] result = sol.twoSum(new int[]{${inputStr}}, ${target}); System.out.println("[" + result[0] + "," + result[1] + "]"); } }`,
          2: `${code}\npublic class Main { public static void main(String[] args) { Solution sol = new Solution(); System.out.println(sol.reverseString("${inputStr}")); } }`,
          3: `${code}\npublic class Main { public static void main(String[] args) { Solution sol = new Solution(); System.out.println(sol.isPalindrome(${inputStr})); } }`,
          4: `${code}\npublic class Main { public static void main(String[] args) { Solution sol = new Solution(); System.out.println(sol.missingNumber(new int[]{${inputStr}})); } }`,
          5: `${code}\npublic class Main { public static void main(String[] args) { Solution sol = new Solution(); System.out.println(sol.isValid("${inputStr}")); } }`,
          6: `${code}\npublic class Main { public static void main(String[] args) { Solution sol = new Solution(); System.out.println(sol.maxSubArray(new int[]{${inputStr}})); } }`,
          7: `${code}\npublic class Main { public static void main(String[] args) { Solution sol = new Solution(); System.out.println(sol.longestCommonPrefix(new String[]{${inputStr}})); } }`,
        }[challengeId];
      default:
        return code;
    }
  };

  const handleRunCode = async () => {
    if (!challenge) return;

    setSubmissionStatus("loading");
    const results = [];

    const testCases = challenge.testCases;
    for (const testCase of testCases) {
      let formattedInput, executionCode, expected;

      switch (challenge.id) {
        case 1: // Two Sum
          const [inputArray, target] = testCase.input.split(", ");
          const nums = JSON.parse(inputArray);
          formattedInput = { nums, target: parseInt(target) };
          expected = JSON.parse(testCase.expected);
          break;
        case 2: // Reverse a String
          formattedInput = { nums: testCase.input.replace(/"/g, "") };
          expected = testCase.expected.replace(/"/g, "");
          break;
        case 3: // Palindrome Number
          formattedInput = { nums: parseInt(testCase.input) };
          expected = testCase.expected === "true";
          break;
        case 4: // Find the Missing Number
          formattedInput = { nums: JSON.parse(testCase.input) };
          expected = parseInt(testCase.expected);
          break;
        case 5: // Valid Parentheses
          formattedInput = { nums: testCase.input.replace(/"/g, "") };
          expected = testCase.expected === "true";
          break;
        case 6: // Maximum Subarray
          formattedInput = { nums: JSON.parse(testCase.input) };
          expected = parseInt(testCase.expected);
          break;
        case 7: // Longest Common Prefix
          formattedInput = { nums: JSON.parse(testCase.input) };
          expected = testCase.expected.replace(/"/g, "");
          break;
        default:
          continue;
      }

      executionCode = generateExecutionCode(challenge.id, language, value, testCase);
      const output = await executeCode(executionCode);

      let parsedOutput = output;
      if (output !== "Error executing code" && !output.includes("Error executing code")) {
        try {
          parsedOutput = 
            challenge.id === 1 ? JSON.parse(output) : 
            challenge.id === 3 || challenge.id === 5 ? output === "true" : 
            challenge.id === 4 || challenge.id === 6 ? parseInt(output) : 
            output;
        } catch (e) {
          parsedOutput = output;
        }
      }

      results.push({
        id: testCases.indexOf(testCase) + 1,
        input: formattedInput,
        expected: expected,
        output: parsedOutput,
        passed:
          parsedOutput === "Error executing code" || parsedOutput.includes("Error executing code")
            ? false
            : String(parsedOutput) === String(challenge.id === 1 ? `[${expected.join(",")}]` : expected),
      });
    }

    setTestResults(results);
    setSubmissionStatus("success");
    toast({
      title: "✅ Code Executed!",
      description: `${results.filter((r) => r.passed).length}/${results.length} test cases passed.`,
    });
  };

  const handleSubmit = async () => {
    setSubmissionStatus("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const isSuccess = Math.random() > 0.5;
      if (!isSuccess) throw new Error();
      setSubmissionStatus("success");
      toast({
        title: "✅ Submission Successful!",
        description: "Great job! Your solution has been submitted.",
      });
    } catch (error) {
      setSubmissionStatus("error");
      toast({
        title: "❌ Submission Failed",
        description: "Please check your code and try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setSubmissionStatus("idle"), 2000);
    }
  };

  const getSubmitButton = () => {
    switch (submissionStatus) {
      case "loading":
        return (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </Button>
        );
      case "success":
        return (
          <Button className="bg-green-500 hover:bg-green-600">
            <Check className="mr-2 h-4 w-4" />
            Submitted!
          </Button>
        );
      case "error":
        return (
          <Button variant="destructive">
            <AlertCircle className="mr-2 h-4 w-4" />
            Failed
          </Button>
        );
      default:
        return (
          <Button variant="outline" onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
        );
    }
  };

  if (!challenge) return <div>Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 p-4">
      <div className="w-full lg:w-2/3">
        <div className="flex items-center gap-3 mt-2">
          <div className="p-2 bg-violet-200 rounded-lg">
            <Sparkles fill="#7548C1" />
          </div>
          <div>
            <p className="text-sm text-gray-800 font-medium">{challenge.title}</p>
          </div>
          <Separator className="h-12 w-[1px] bg-primary" />
          <Badge>{challenge.difficulty}</Badge>
        </div>
        <Editor
          height={600}
          language={language}
          theme="vs-dark"
          value={value}
          onChange={(val) => setValue(val)}
          className="mt-3"
        />

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            <Button onClick={handleRunCode} disabled={submissionStatus === "loading"}>
              <Play className="mr-2 h-4 w-4" /> Run Code
            </Button>
            {getSubmitButton()}
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="rounded-md mt-4 p-4 text-neutral-900 bg-indigo-50 border-none shadow-none">
          <CardContent>
            <h1 className="font-medium mb-3">Problem Guidelines</h1>
            <li>1</li>
            <li>1</li>
            <li>1</li>
            <li>1</li>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-1/3">
        <div className="items-center flex justify-end">
          <CodeTimer />
        </div>

        <Card className="mt-3 shadow-none bg-white border-gray-200 p-4 rounded-md">
          <CardTitle className="text-neutral-800 font-medium text-lg">Problem Description</CardTitle>
          <CardDescription className="text-neutral-700 font-normal text-sm text-justify mt-2 leading-5">
            {challenge.description}
          </CardDescription>
          <CardContent className="mt-4 bg-purple-50 p-4">
            <p className="font-semibold text-neutral-800">Example:</p>
            <p className="text-sm mt-3">
              Input: {challenge.example.input} <br />
              Output: {challenge.example.output} <br />
              Explanation: {challenge.example.explanation}
            </p>
          </CardContent>
        </Card>

        <div className="mt-5">
          <TestCases
            testCases={
              testResults.length > 0
                ? testResults
                : challenge.testCases.map((tc, idx) => ({
                    id: idx + 1,
                    input:
                      challenge.id === 1
                        ? { nums: JSON.parse(tc.input.split(", ")[0]), target: parseInt(tc.input.split(", ")[1]) }
                        : challenge.id === 2 || challenge.id === 5
                        ? { nums: tc.input.replace(/"/g, "") }
                        : challenge.id === 3
                        ? { nums: parseInt(tc.input) }
                        : challenge.id === 4 || challenge.id === 6
                        ? { nums: JSON.parse(tc.input) }
                        : { nums: JSON.parse(tc.input) },
                    expected: challenge.id === 1 ? JSON.parse(tc.expected) : challenge.id === 3 || challenge.id === 5 ? tc.expected === "true" : challenge.id === 4 || challenge.id === 6 ? parseInt(tc.expected) : tc.expected.replace(/"/g, ""),
                    output: null,
                    explanation: idx === 0 ? challenge.example.explanation : null,
                  }))
            }
          />
        </div>
      </div>
    </div>
  );
}

export default StudentPracticePage;