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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import challenges, { LANGUAGE_VERSIONS } from "@/constants/challenges";
import axios from "axios";

function StudentPracticePage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  const [testResults, setTestResults] = useState([]);
  const [runStatus, setRunStatus] = useState("idle");
  const { toast } = useToast();

  useEffect(() => {
    const selectedChallenge = challenges.find((c) => c.id === id);
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
      return { output: response.data.run.output.trim(), stderr: response.data.run.stderr };
    } catch (error) {
      console.error("Execution failed:", error);
      return { output: `Error executing code: ${error.message}`, stderr: error.message };
    }
  };

  const handleRunCode = async () => {
    if (!challenge) return;

    setRunStatus("loading");
    const testCodeSnippets = challenge.runCode(language, value, challenge.testCases);
    let results = [];

    for (let index = 0; index < testCodeSnippets.length; index++) {
      const executionCode = testCodeSnippets[index];
      const testCase = {
        nums: challenge.testCases.nums[index],
        target: challenge.testCases.targets[index],
        expected: challenge.testCases.answers[index],
      };

      try {
        const { output, stderr } = await executeCode(executionCode);
        const parsedOutput = challenge.parseOutput(output);
        const expectedStr = JSON.stringify(testCase.expected);
        const actualOutputStr = JSON.stringify(parsedOutput);

        results.push({
          id: index + 1,
          input: `nums = [${testCase.nums.join(",")}], target = ${testCase.target}`,
          expected: expectedStr,
          output: actualOutputStr,
          passed: actualOutputStr === expectedStr,
          errorLine: stderr?.match(/line (\d+)/) ? parseInt(stderr.match(/line (\d+)/)[1]) : null,
          errorMessage: stderr || (parsedOutput.includes("Error") ? parsedOutput : null),
        });

        // Add delay to prevent API rate limit issues
        if (index < testCodeSnippets.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 250)); // 250ms delay
        }
      } catch (error) {
        results.push({
          id: index + 1,
          input: `nums = [${testCase.nums.join(",")}], target = ${testCase.target}`,
          expected: JSON.stringify(testCase.expected),
          output: "Error",
          passed: false,
          errorMessage: `Error running test case: ${error.message}`,
        });
      }
    }

    setTestResults(results);
    setRunStatus("success");

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
            <Button onClick={handleRunCode} disabled={runStatus === "loading"}>
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
              Input: {challenge.examples[0].input} <br />
              Output: {challenge.examples[0].output} <br />
              Explanation: {challenge.examples[0].explanation || ""}
            </p>
          </CardContent>
        </Card>
        <div className="mt-5">
          <Tabs defaultValue="test-cases">
            <TabsList>
              <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
              <TabsTrigger value="test-results">Test Results</TabsTrigger>
            </TabsList>
            <TabsContent value="test-cases">
              <TestCases
                testCases={challenge.examples.map((example, idx) => ({
                  id: idx + 1,
                  input: example.input,
                  expected: example.output.replace(/"/g, ""),
                  output: null,
                  explanation: example.explanation || null,
                }))}
              />
            </TabsContent>
            <TabsContent value="test-results">
              <Card className="shadow-none bg-white rounded-md p-6">
                <CardTitle className="text-2xl font-semibold text-neutral-800 mb-4">Test Results</CardTitle>
                <div className="space-y-4">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className={`rounded-lg p-4 border ${
                        result.passed ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                      }`}
                    >
                      <div className="space-y-2">
                        <h3 className="font-medium">
                          Test Case #{result.id} -{" "}
                          <span className={result.passed ? "text-green-600" : "text-red-600"}>
                            {result.passed ? "Accepted" : "Failed"}
                          </span>
                        </h3>
                        <p className="text-neutral-700"><span className="font-medium">Input:</span> {result.input}</p>
                        <p className="text-neutral-700"><span className="font-medium">Expected:</span> {result.expected}</p>
                        <p className="text-neutral-700"><span className="font-medium">Output:</span> {result.output}</p>
                        {result.errorLine && (
                          <p className="text-red-600">
                            <span className="font-medium">Error Line:</span> {result.errorLine}
                          </p>
                        )}
                        {result.errorMessage && (
                          <p className="text-red-600">
                            <span className="font-medium">Error:</span> {result.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default StudentPracticePage;