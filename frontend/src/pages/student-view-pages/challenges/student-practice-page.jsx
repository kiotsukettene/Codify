import { useState, useEffect, useRef } from "react";
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
  const [activeTab, setActiveTab] = useState("test-cases");
  const { toast } = useToast();

  useEffect(() => {
    const selectedChallenge = challenges.find((c) => c.id === id);
    if (selectedChallenge) {
      setChallenge(selectedChallenge);
      setValue(selectedChallenge.starterCode[language].trim());
    }
  }, [id, language]);

  const parseError = (errorString) => {
    if (!errorString) return { message: "Unknown error", line: null };

    // Split the error into lines
    const lines = errorString.split("\n");

    // Look for line number in the format "file0.code:5"
    let lineNumber = null;
    const lineMatch = errorString.match(/file\d+\.code:(\d+)/);
    if (lineMatch) {
      lineNumber = parseInt(lineMatch[1], 10);
    }

    // Extract the core error message (e.g., "SyntaxError: Unexpected end of input")
    let errorMessage = lines.find((line) => line.includes("Error") || line.includes("error")) || lines[0];
    if (!errorMessage) errorMessage = "Unknown error";

    // Clean up the message (remove file paths, stack traces, etc.)
    errorMessage = errorMessage.replace(/\/piston\/jobs\/[^:]+\/file\d+\.code:\d+\s*/, "").trim();

    return { message: errorMessage, line: lineNumber };
  };

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
      const data = response.data;

      // Handle API-level errors
      if (data.message) {
        const { message, line } = parseError(data.message);
        return { output: "", error: message, errorLine: line };
      }

      // Handle compilation errors
      if (data.compile && data.compile.code !== 0) {
        const error = data.compile.stderr || data.compile.output || "Compilation failed";
        const { message, line } = parseError(error);
        return { output: "", error: message, errorLine: line };
      }

      // Handle runtime errors
      if (data.run && data.run.code !== 0) {
        const error = data.run.stderr || data.run.output || "Runtime error";
        const { message, line } = parseError(error);
        return { output: "", error: message, errorLine: line };
      }

      // Successful execution
      const output = data.run.output;
      return { output: output.trim(), error: null, errorLine: null };
    } catch (error) {
      console.error("Execution failed:", error);
      const { message, line } = parseError(error.message);
      return { output: "", error: `Error executing code: ${message}`, errorLine: line };
    }
  };

  const handleRunCode = async () => {
    if (!challenge) return;

    setRunStatus("loading");
    const testCodeSnippets = challenge.runCode(language, value, challenge.testCases);
    let results = [];
    let hasError = false;
    const inputKeys = Object.keys(challenge.testCases).filter((key) => key !== "answers");

    // Run only the first test case to check for errors
    for (let index = 0; index < Math.min(1, testCodeSnippets.length); index++) {
      const executionCode = testCodeSnippets[index];
      const testCase = {};
      inputKeys.forEach((key) => {
        testCase[key] = challenge.testCases[key][index];
      });
      testCase.expected = challenge.testCases.answers[index];

      const inputStr = inputKeys
        .map((key) => {
          const value = testCase[key];
          return `${key} = ${Array.isArray(value) ? `[${value.join(",")}]` : value}`;
        })
        .join(", ");

      try {
        const { output, error, errorLine } = await executeCode(executionCode);
        const parsedOutput = error ? "Error" : challenge.parseOutput(output);
        const expectedStr = JSON.stringify(testCase.expected);
        const actualOutputStr = error ? "Error" : JSON.stringify(parsedOutput);

        if (error) {
          hasError = true;
          results.push({
            id: 1,
            input: inputStr,
            expected: expectedStr,
            output: actualOutputStr,
            passed: false,
            errorMessage: error,
            errorLine,
          });
          break;
        } else {
          results.push({
            id: index + 1,
            input: inputStr,
            expected: expectedStr,
            output: actualOutputStr,
            passed: actualOutputStr === expectedStr,
            errorMessage: null,
            errorLine: null,
          });
        }
      } catch (error) {
        hasError = true;
        const { message, line } = parseError(error.message);
        results.push({
          id: 1,
          input: inputStr,
          expected: JSON.stringify(testCase.expected),
          output: "Error",
          passed: false,
          errorMessage: `Error running test case: ${message}`,
          errorLine: line,
        });
        break;
      }
    }

    // If no error in the first case, run all test cases
    if (!hasError && testCodeSnippets.length > 1) {
      for (let index = 1; index < testCodeSnippets.length; index++) {
        const executionCode = testCodeSnippets[index];
        const testCase = {};
        inputKeys.forEach((key) => {
          testCase[key] = challenge.testCases[key][index];
        });
        testCase.expected = challenge.testCases.answers[index];

        const inputStr = inputKeys
          .map((key) => {
            const value = testCase[key];
            return `${key} = ${Array.isArray(value) ? `[${value.join(",")}]` : value}`;
          })
          .join(", ");

        try {
          const { output, error, errorLine } = await executeCode(executionCode);
          const parsedOutput = error ? "Error" : challenge.parseOutput(output);
          const expectedStr = JSON.stringify(testCase.expected);
          const actualOutputStr = error ? "Error" : JSON.stringify(parsedOutput);

          results.push({
            id: index + 1,
            input: inputStr,
            expected: expectedStr,
            output: actualOutputStr,
            passed: actualOutputStr === expectedStr,
            errorMessage: error,
            errorLine,
          });

          if (error) {
            hasError = true;
            break;
          }
        } catch (error) {
          hasError = true;
          const { message, line } = parseError(error.message);
          results.push({
            id: index + 1,
            input: inputStr,
            expected: JSON.stringify(testCase.expected),
            output: "Error",
            passed: false,
            errorMessage: `Error running test case: ${message}`,
            errorLine: line,
          });
          break;
        }

        if (index < testCodeSnippets.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }
    }

    setTestResults(results);
    setRunStatus("success");
    setActiveTab("test-results");

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
              {runStatus === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Code
                </>
              )}
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
            <ul>
              <li>For Java, implement the method logic—don’t hardcode output in main.</li>
              <li>Imports are included as needed.</li>
              <li>Test all cases before submitting.</li>
              <li>Contact support if stuck!</li>
            </ul>
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                        result.output === "Error"
                          ? "border-red-500 bg-red-50"
                          : result.passed
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                      }`}
                    >
                      <div className="space-y-2">
                        <h3 className="font-medium">
                          Test Case #{result.id} -{" "}
                          <span
                            className={
                              result.output === "Error"
                                ? "text-red-600"
                                : result.passed
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {result.output === "Error" ? "Error" : result.passed ? "Accepted" : "Failed"}
                          </span>
                        </h3>
                        {result.output === "Error" ? (
                          <>
                            <p className="text-red-600">
                              <span className="font-medium">Error:</span> {result.errorMessage}
                            </p>
                            {result.errorLine && (
                              <p className="text-red-600">
                                <span className="font-medium">Line:</span> {result.errorLine}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-neutral-700">
                              <span className="font-medium">Input:</span> {result.input}
                            </p>
                            <p className="text-neutral-700">
                              <span className="font-medium">Expected:</span> {result.expected}
                            </p>
                            <p className="text-neutral-700">
                              <span className="font-medium">Output:</span> {result.output}
                            </p>
                          </>
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