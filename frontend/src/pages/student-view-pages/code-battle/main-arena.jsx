import { useState, useEffect, useRef, useContext } from "react";
import { Editor } from "@monaco-editor/react";
import {
  Clock,
  Play,
  Send,
  XCircle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Trophy,
  User,
  Users,
  ArrowLeft,
  Expand,
  Minimize,
  Loader2,
  CheckCheck,
  ChevronUp,
  FileText,
  ListChecks,
  BarChart,
  Lock,
  ArrowRight,
  CheckSquare,
  Unlock,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useParams } from "react-router-dom";
import useBattleStore from "@/store/battleStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { SocketContext } from '@/context/auth-context/SocketProvider';

// Language options with Piston API versions
const languageOptions = [
  { value: "javascript", label: "JavaScript", version: "18.15.0" },
  { value: "java", label: "Java", version: "15.0.2" },
  { value: "csharp", label: "C#", version: "6.12.0" },
  { value: "python", label: "Python", version: "3.10.0" },
  { value: "c", label: "C", version: "10.2.0" },
  { value: "cpp", label: "C++", version: "10.2.0" },
];

// Map languageOptions to LANGUAGE_VERSIONS
const LANGUAGE_VERSIONS = languageOptions.reduce((acc, { value, version }) => {
  acc[value] = version;
  return acc;
}, {});

// Static challenges data as fallback (updated to include functionName and numArguments)
const staticChallengesData = [
  {
    id: 1,
    title: "Sort Array",
    points: 150,
    timeLimit: 1800,
    description: `You are given an array of integers. Implement the function sortArray to sort the array in ascending order and return the sorted array.`,
    examples: [
      {
        input: "5 2 9 1 5",
        output: "1 2 5 5 9",
        explanation: "The sorted array in ascending order.",
      },
      {
        input: "3 1 2",
        output: "1 2 3",
        explanation: "The sorted array in ascending order.",
      },
    ],
    hints: [
      "Consider using built-in sorting functions for simplicity.",
      "Ensure the output is a space-separated string for console output.",
    ],
    testCases: [
      { id: 1, input: "5 2 9 1 5", expectedOutput: "1 2 5 5 9", status: "waiting" },
      { id: 2, input: "3 1 2", expectedOutput: "1 2 3", status: "waiting" },
      { id: 3, input: "10 -5 0 100 20", expectedOutput: "-5 0 10 20 100", status: "waiting" },
    ],
    functionName: "sortArray",
    numArguments: 1,
  },
];

// Mock data for backend integration
const mockUserData = {
  id: "user123",
  name: "Player1",
  totalScore: 0,
  completedChallenges: [],
  submissionHistory: [],
};

// Mock API endpoints for backend integration
const mockApiEndpoints = {
  submitChallenge: "/api/challenges/submit",
  getChallenge: "/api/challenges/:id",
  getUserProgress: "/api/users/:id/progress",
  updateUserScore: "/api/users/:id/score",
};

// Basic parseError function
const parseError = (errorMessage) => {
  const match = errorMessage.match(/line (\d+):(.+)/i);
  if (match) {
    return { line: parseInt(match[1], 10), message: match[2].trim() };
  }
  return { line: null, message: errorMessage || "Unknown error" };
};

// Utility for delayed execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Request queue implementation
const requestQueue = {
  queue: [],
  processing: false,
  
  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  },

  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const { fn, resolve, reject } = this.queue.shift();
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.processing = false;
      setTimeout(() => this.process(), 1000); // Add 1s delay between requests
    }
  }
};

export default function CodeBattle() {
  const { battleCode } = useParams();
  const { fetchBattleDetails, battleDetails, updateChallengeProgress } = useBattleStore();
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const socket = useContext(SocketContext);

  // Battle state
  const [battleTitle, setBattleTitle] = useState("Algorithmic Coding Battle");
  const [challengesData, setChallengesData] = useState([]);
  const [opponents] = useState([
    {
      id: 'player2',
      name: 'Player 2',
      avatar: null,
      progress: 33,
      status: 'typing'
    }
  ]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [challengeResults, setChallengeResults] = useState([]);
  const [unlockedChallenges, setUnlockedChallenges] = useState([1]);
  const [totalBattlePoints, setTotalBattlePoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Current challenge data
  const currentChallenge = challengesData[currentChallengeIndex] || {
    testCases: [],
    timeLimit: 1800,
    title: "",
    points: 0,
    description: "",
    examples: [],
    hints: [],
    functionName: "",
    numArguments: 0,
  };

  // Editor state
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState(currentChallenge.testCases || []);
  const [timeLeft, setTimeLeft] = useState(currentChallenge.timeLimit || 1800);
  const [userProgress, setUserProgress] = useState(0);
  const [theme, setTheme] = useState("vs-dark");
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("output");
  const [userStatus, setUserStatus] = useState("idle");
  const [isEditorReadOnly, setIsEditorReadOnly] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showNextChallengeButton, setShowNextChallengeButton] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Collapsible panel states
  const [isProblemPanelOpen, setIsProblemPanelOpen] = useState(true);
  const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false);
  const [isOutputPanelOpen, setIsOutputPanelOpen] = useState(true);

  // Refs for scrollable elements
  const testCasesRef = useRef(null);
  const outputRef = useRef(null);
  const editorRef = useRef(null);

  // Add this new state to store submitted code for each challenge
  const [submittedCodes, setSubmittedCodes] = useState({});

  // Calculate progress percentage based on completed challenges
  const calculateProgressPercentage = (completedChallenges, totalChallenges) => {
    console.log('Calculating progress:', { completedChallenges, totalChallenges });
    if (totalChallenges === 0) return 0;
    // Ensure we're working with numbers
    const completed = Array.isArray(completedChallenges) ? completedChallenges.length : 0;
    const total = Number(totalChallenges) || 1;
    const progress = Math.round((completed / total) * 100);
    console.log('Progress calculated:', progress);
    return progress;
  };

  // Add useEffect to monitor progress changes
  useEffect(() => {
    console.log('Progress updated:', userProgress);
  }, [userProgress]);

  // Load battle details and progress
  const loadBattleAndProgress = async () => {
    try {
      if (!battleCode) {
        throw new Error("No battle code provided");
      }

      const data = await fetchBattleDetails(battleCode);
      console.log("Raw battle data:", data);

      // Validate the response data
      if (!data || typeof data !== "object") {
        throw new Error("Invalid battle data received");
      }

      // Check if challenges array exists and is valid
      if (!Array.isArray(data.challenges) || data.challenges.length === 0) {
        console.error("Received data:", data);
        throw new Error("No challenges found in battle data");
      }

      const formattedChallenges = data.challenges.map((challenge, index) => {
        console.log(`Challenge ${index + 1}:`, challenge);
        
        if (!challenge) {
          throw new Error(`Challenge ${index + 1} is undefined`);
        }

        // Get player's progress for this challenge
        const progress = challenge.playerProgress?.find(
          p => p.playerId === data.player1?.id // Assuming current user is player1
        );

        // Determine if this challenge should be unlocked
        const isCompleted = progress?.status === "completed";
        const shouldBeUnlocked = index === 0 || (index > 0 && data.challenges[index - 1]?.playerProgress?.some(
          p => p.playerId === data.player1?.id && p.status === "completed"
        ));

        // If the challenge is completed, store its code in submittedCodes
        if (progress?.status === "completed") {
          setSubmittedCodes(prev => ({
            ...prev,
            [challenge.challengeId]: {
              code: progress.code || "",
              language: progress.language || "javascript"
            }
          }));
        }

        return {
          challengeId: challenge.challengeId,
          title: challenge.problemTitle,
          points: challenge.points,
          timeLimit: challenge.timeLimit || Math.floor((data.duration || 30) * 60 / data.challenges.length),
          description: challenge.problemDescription,
          examples: challenge.examples || [],
          hints: challenge.hints || [],
          testCases: challenge.inputConstraints.map((input, i) => ({
            id: i + 1,
            input,
            expectedOutput: challenge.expectedOutput[i],
            status: isCompleted ? "passed" : "waiting"
          })),
          functionName: challenge.functionName,
          numArguments: challenge.numArguments,
          status: isCompleted ? "completed" : (shouldBeUnlocked ? "unlocked" : "locked"),
          savedCode: progress?.code || "",
          savedLanguage: progress?.language
        };
      });

      setChallengesData(formattedChallenges);
      setBattleTitle(data.title || "Algorithmic Coding Battle");

      // Calculate total points
      const totalPoints = formattedChallenges.reduce((sum, challenge) => sum + challenge.points, 0);
      setTotalBattlePoints(totalPoints);

      // Find completed challenges
      const completedIds = formattedChallenges
        .filter(c => c.status === "completed")
        .map(c => c.challengeId);
      
      console.log('Found completed challenges:', completedIds);
      
      // Update state in correct order
      await Promise.all([
        new Promise(resolve => {
          setCompletedChallenges(completedIds);
          resolve();
        }),
        new Promise(resolve => {
          const progress = calculateProgressPercentage(completedIds, formattedChallenges.length);
          console.log('Setting progress to:', progress);
          setUserProgress(progress);
          resolve();
        })
      ]);

      // Calculate earned points
      const completedPoints = formattedChallenges
        .filter(challenge => completedIds.includes(challenge.challengeId))
        .reduce((sum, challenge) => sum + challenge.points, 0);
      setEarnedPoints(completedPoints);

      // Restore saved code and language if available
      if (formattedChallenges[currentChallengeIndex].savedCode) {
        setCode(formattedChallenges[currentChallengeIndex].savedCode);
        setLanguage(formattedChallenges[currentChallengeIndex].savedLanguage || "javascript");
      }

      setIsLoadingProgress(false);
    } catch (error) {
      console.error("Failed to fetch battle details:", error.message, error.stack);
      setIsLoadingProgress(false);
      // Show error state
      return (
        <div className="flex items-center justify-center h-screen bg-[#0D0A1A]">
          <div className="text-center">
            <XCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
            <p className="text-[#F5F5F5] mb-2">Failed to load battle data</p>
            <p className="text-[#C2C2DD] text-sm">{error.message}</p>
          </div>
        </div>
      );
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle editor mounting
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Modify the handleFinalizeSubmission function to store the submitted code
  const handleFinalizeSubmission = async () => {
    const allTestsPassed = testResults.every(test => test.status === "passed");
    
    if (!allTestsPassed) {
      setIsSubmitModalOpen(false);
      setIsErrorModalOpen(true);
      return;
    }

    try {
      // Update challenge progress in the backend
      await updateChallengeProgress(battleCode, currentChallenge.challengeId, {
        status: "completed",
        code,
        language,
        score: currentChallenge.points,
        submittedAt: new Date().toISOString()
      });

      // Store the submitted code
      setSubmittedCodes(prev => ({
        ...prev,
        [currentChallenge.challengeId]: {
          code,
          language
        }
      }));

      setIsSubmitModalOpen(false);
      setIsEditorReadOnly(true);
      setIsSubmitted(true);
      setUserStatus("submitted");

      const result = {
        challengeId: currentChallenge.challengeId,
        title: currentChallenge.title,
        passedTests: testResults.length,
        totalTests: testResults.length,
        score: currentChallenge.points,
        timeSpent: currentChallenge.timeLimit - timeLeft,
      };

      // Update challenge results
      const newChallengeResults = [...challengeResults, result];
      setChallengeResults(newChallengeResults);
      
      // Update completed challenges
      const newCompletedChallenges = [...completedChallenges, currentChallenge.challengeId];
      setCompletedChallenges(newCompletedChallenges);

      // Update earned points and progress
      const newEarnedPoints = earnedPoints + currentChallenge.points;
      setEarnedPoints(newEarnedPoints);
      setUserProgress(calculateProgressPercentage(newCompletedChallenges, challengesData.length));

      // Unlock next challenge if available
      if (currentChallengeIndex < challengesData.length - 1) {
        const nextChallenge = challengesData[currentChallengeIndex + 1];
        if (!unlockedChallenges.includes(nextChallenge.challengeId)) {
          await updateChallengeProgress(battleCode, nextChallenge.challengeId, {
            status: "unlocked"
          });
          setUnlockedChallenges([...unlockedChallenges, nextChallenge.challengeId]);
        }
        setShowNextChallengeButton(true);
      }
    } catch (error) {
      console.error("Failed to update challenge progress:", error);
      toast.error("Failed to submit challenge. Please try again.");
    }
  };

  // Modify the useEffect that handles challenge changes to restore submitted code
  useEffect(() => {
    if (currentChallenge) {
      // Check if there's submitted code for this challenge
      const submittedCode = submittedCodes[currentChallenge.challengeId];
      if (submittedCode && completedChallenges.includes(currentChallenge.challengeId)) {
        setCode(submittedCode.code);
        setLanguage(submittedCode.language);
      } else {
        // If no submitted code, use saved code or empty string
        setCode(currentChallenge.savedCode || "");
        setLanguage(currentChallenge.savedLanguage || "javascript");
      }

      setTestResults(currentChallenge.testCases || []);
      setTimeLeft(currentChallenge.timeLimit || 1800);
      setOutput("");
      setUserProgress(0);
      setIsEditorReadOnly(completedChallenges.includes(currentChallenge.challengeId));
      setIsSubmitted(completedChallenges.includes(currentChallenge.challengeId));
      setShowNextChallengeButton(false);
      setUserStatus(completedChallenges.includes(currentChallenge.challengeId) ? "submitted" : "idle");
      setIsProblemPanelOpen(true);
    }
  }, [currentChallengeIndex, currentChallenge?.challengeId, completedChallenges, submittedCodes]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Handle editor layout
  useEffect(() => {
    if (editorRef.current) {
      const handleResize = () => {
        editorRef.current.layout();
      };
      window.addEventListener("resize", handleResize);
      editorRef.current.layout();
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isEditorExpanded, isProblemPanelOpen, isProgressPanelOpen, isOutputPanelOpen]);

  // Set user status to typing
  useEffect(() => {
    let timer;
    if (code !== "" && !isEditorReadOnly) {
      setUserStatus("typing");
      timer = setTimeout(() => {
        setUserStatus("idle");
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [code, isEditorReadOnly]);

  // Toggle editor expansion
  const toggleEditorExpansion = () => {
    setIsEditorExpanded((prev) => {
      const newExpanded = !prev;
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.layout();
        }
      }, 100);
      return newExpanded;
    });
  };

  // Check if challenge is unlocked
  const isChallengeUnlocked = (challengeId) => {
    // A challenge is unlocked if:
    // 1. It's the first challenge
    // 2. It's in the unlockedChallenges array
    // 3. The previous challenge is completed
    const challengeIndex = challengesData.findIndex(c => c.challengeId === challengeId);
    if (challengeIndex === 0) return true;
    if (challengeIndex > 0) {
      const previousChallenge = challengesData[challengeIndex - 1];
      return completedChallenges.includes(previousChallenge.challengeId);
    }
    return unlockedChallenges.includes(challengeId);
  };

  // Update the executeCode function to use the queue
  const executeCode = async (codeToExecute, testInput, functionName, numArguments, language, retries = 3, initialDelay = 1000) => {
    const executeRequest = async () => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          // Parse testInput based on the format (handle both string and array formats)
          let args;
          try {
            args = JSON.parse(testInput);
            if (!Array.isArray(args)) {
              args = [args];
            }
            args = args.map(arg => (typeof arg === 'string' ? `"${arg}"` : arg));
          } catch (e) {
            // Handle single array argument like "1,2,3"
if (numArguments === 1 && testInput.includes(",")) {
  const elements = testInput.split(",").map(x => {
    const num = Number(x.trim());
    return isNaN(num) ? `"${x.trim()}"` : num;
  });
  args = [`[${elements.join(",")}]`]; // Final result: one argument which is an array
} else {
  args = testInput.trim().split(/\s+/).map(arg => {
    const num = Number(arg);
    return isNaN(num) ? `"${arg}"` : num;
  });
}
          }

          if (args.length !== numArguments) {
            return { 
              output: "", 
              error: `Expected ${numArguments} arguments, got ${args.length}. Input: ${testInput}`, 
              errorLine: null 
            };
          }

          // Construct the execution code based on language
          let executionCode;
          if (language === "javascript") {
            executionCode = `
              ${codeToExecute}
              const result = ${functionName}(${args.join(", ")});
              if (typeof result === 'string') {
                console.log(result);
              } else {
                console.log(JSON.stringify(result));
              }
            `;
          } else if (language === "python") {
            executionCode = `
${codeToExecute}
result = ${functionName}(${args.join(", ")})
print(str(result))
            `;
          } else if (language === "java") {
            executionCode = `
public class Solution {
    ${codeToExecute}
    public static void main(String[] args) {
        System.out.println(${functionName}(${args.join(", ")}));
    }
}
            `;
          } else {
            return { output: "", error: `Unsupported language: ${language}`, errorLine: null };
          }

          const response = await axios.post(
            "https://emkc.org/api/v2/piston/execute",
            {
              language: language,
              version: LANGUAGE_VERSIONS[language],
              files: [{ content: executionCode }],
            },
            { withCredentials: false }
          );

          const data = response.data;

          if (data.message) {
            const { message, line } = parseError(data.message);
            return { output: "", error: message, errorLine: line };
          }

          if (data.compile && data.compile.code !== 0) {
            const error = data.compile.stderr || data.compile.output || "Compilation failed";
            const { message, line } = parseError(error);
            return { output: "", error: message, errorLine: line };
          }

          if (data.run && data.run.code !== 0) {
            const error = data.run.stderr || data.run.output || "Runtime error";
            const { message, line } = parseError(error);
            return { output: "", error: message, errorLine: line };
          }

          const output = data.run.output.trim();
          return { output, error: null, errorLine: null };

        } catch (error) {
          if (error.response && error.response.status === 429 && attempt < retries) {
            const delayMs = initialDelay * Math.pow(2, attempt - 1);
            console.warn(`Rate limit hit, retrying after ${delayMs}ms (attempt ${attempt}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
          throw error;
        }
      }
      throw new Error("Max retries reached");
    };

    // Add the request to the queue
    return requestQueue.add(executeRequest);
  };

  // Handle run code
  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput("Executing code...");

    try {
      const updatedTestResults = await Promise.all(
        currentChallenge.testCases.map(async (test) => {
          const result = await executeCode(
            code,
            test.input,
            currentChallenge.functionName,
            currentChallenge.numArguments,
            language
          );

          if (result.error) {
            return {
              ...test,
              status: "failed",
              actualOutput: result.error,
              errorLine: result.errorLine,
            };
          }

          const isPassed = result.output === test.expectedOutput;
          return {
            ...test,
            status: isPassed ? "passed" : "failed",
            actualOutput: result.output,
            errorLine: null,
          };
        })
      );

      setTestResults(updatedTestResults);

      const failedResults = updatedTestResults.filter(t => t.status === "failed");
      const firstError = failedResults[0]?.actualOutput;
      const allSameError = failedResults.every(t => t.actualOutput === firstError);

      const passedCount = updatedTestResults.filter((t) => t.status === "passed").length;
      let outputText = "";

      const parseErrorMessage = (errorText) => {
        const errorLines = errorText.split('\n');
        const fileLine = errorLines.find(line => line.includes('/piston/jobs/'));
        
        if (fileLine) {
          const lineMatch = fileLine.match(/:(\d+)(?::(\d+))?$/);
          const lineNumber = lineMatch ? parseInt(lineMatch[1]) : null;
          
          const fileLineIndex = errorLines.indexOf(fileLine);
          const codeLine = errorLines[fileLineIndex + 1];
          const pointerLine = errorLines.find(line => line.includes('^'));
          
          const errorMessageLine = errorLines.find(line => 
            line.includes('Error:') || 
            line.includes('SyntaxError:') || 
            line.includes('TypeError:') || 
            line.includes('ReferenceError:')
          );

          if (codeLine && pointerLine && errorMessageLine) {
            return `${fileLine}\n${codeLine}\n${pointerLine}\n\n${errorMessageLine}`;
          }
        }
        return errorText;
      };

      if (failedResults.length > 0 && allSameError) {
        outputText = parseErrorMessage(firstError);
      } else {
        outputText = updatedTestResults
          .map((t) => {
            if (t.status === "passed") {
              return `Test ${t.id}: Passed`;
            }
            if (t.actualOutput.includes('Error:') || t.actualOutput.includes('/piston/jobs/')) {
              return `Test ${t.id}: Failed\n${parseErrorMessage(t.actualOutput)}`;
            }
            return `Test ${t.id}: Failed (Got: ${t.actualOutput}, Expected: ${t.expectedOutput})`;
          })
          .join("\n\n");
      }

      outputText += `\n\nPassed ${passedCount}/${updatedTestResults.length} tests`;
      setOutput(outputText);
    } catch (error) {
      console.error("Run code error:", error);
      setOutput(`Error running code: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle submit code
  const handleSubmitCode = () => {
    // Check if all test cases pass before showing finalize modal
    const allTestsPassed = testResults.every(test => test.status === "passed");
    
    if (allTestsPassed) {
      setIsSubmitModalOpen(true);
    } else {
      setIsErrorModalOpen(true);
    }
  };

  // Modify the auto-save useEffect
  useEffect(() => {
    let saveTimer;
    if (!isSubmitted && code && currentChallenge?.challengeId && battleCode) {
      saveTimer = setTimeout(async () => {
        try {
          // Don't auto-save if the challenge is completed and has submitted code
          if (!completedChallenges.includes(currentChallenge.challengeId)) {
            await updateChallengeProgress(battleCode, currentChallenge.challengeId, {
              code,
              language
            });
          }
        } catch (error) {
          console.error("Failed to auto-save code:", error);
        }
      }, 5000);

      return () => clearTimeout(saveTimer);
    }
  }, [code, language, currentChallenge?.challengeId, isSubmitted, battleCode, updateChallengeProgress, completedChallenges]);

  // Handle next challenge
  const handleNextChallenge = () => {
    if (currentChallengeIndex < challengesData.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      // Maintain progress when moving to next challenge
      const progress = calculateProgressPercentage(completedChallenges, challengesData.length);
      setUserProgress(progress);
    }
  };

  // Handle select challenge
  const handleSelectChallenge = (index) => {
    if (isChallengeUnlocked(challengesData[index].challengeId)) {
      setCurrentChallengeIndex(index);
      // Recalculate progress to ensure it's maintained
      const progress = calculateProgressPercentage(completedChallenges, challengesData.length);
      setUserProgress(progress);
    }
  };

  // Add effect to maintain progress when switching challenges
  useEffect(() => {
    if (challengesData.length > 0 && completedChallenges.length > 0) {
      const progress = calculateProgressPercentage(completedChallenges, challengesData.length);
      setUserProgress(progress);
    }
  }, [currentChallengeIndex, completedChallenges, challengesData]);

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "typing":
        return (
          <span className="flex items-center text-blue-400">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Typing...
          </span>
        );
      case "submitted":
        return (
          <span className="flex items-center text-green-400">
            <CheckCheck className="h-3 w-3 mr-1" /> Submitted
          </span>
        );
      case "idle":
      default:
        return null;
    }
  };

  // Get time color class
  const getTimeColorClass = () => {
    if (timeLeft < 60) return "text-red-500 animate-pulse font-bold";
    if (timeLeft < 300) return "text-red-400 font-bold";
    if (timeLeft < 600) return "text-yellow-400";
    return "text-gray-200";
  };

  // Get challenge status badge
  const getChallengeStatusBadge = (challengeId, index) => {
    if (completedChallenges.includes(challengeId)) {
      return (
        <Badge variant="outline" className="ml-1 bg-green-500/20 text-green-400 border-green-500">
          <CheckCircle className="h-3 w-3 mr-1" /> Completed
        </Badge>
      );
    }
    if (index === currentChallengeIndex) {
      return (
        <Badge variant="outline" className="ml-1 bg-blue-500/20 text-blue-400 border-blue-500">
          Current
        </Badge>
      );
    }
    if (isChallengeUnlocked(challengeId)) {
      return (
        <Badge variant="outline" className="ml-1 bg-yellow-500/20 text-yellow-400 border-yellow-500">
          <Unlock className="h-3 w-3 mr-1" /> Unlocked
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="ml-1 bg-gray-500/20 text-gray-400 border-gray-500">
        <Lock className="h-3 w-3 mr-1" /> Locked
      </Badge>
    );
  };

  // Load battle details and progress
  useEffect(() => {
    if (battleCode) {
      loadBattleAndProgress();
    }
  }, [battleCode]);

  // Modify the onChange handler in the Editor component
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    
    // Emit code update to server
    if (socket && battleCode) {
      socket.emit("codeUpdate", {
        battleCode,
        playerId: battleDetails?.player1?.id === userId ? "player1" : "player2",
        code: newCode,
        language
      });
      
      // Also emit typing status
      socket.emit("playerTyping", {
        battleCode,
        playerId: battleDetails?.player1?.id === userId ? "player1" : "player2"
      });
    }
  };

  if (isLoadingProgress) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0D0A1A]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#B689F4] mx-auto mb-4" />
          <p className="text-[#F5F5F5]">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0D0A1A] text-[#F5F5F5] overflow-hidden">
      {!isEditorExpanded && (
        <header className="flex items-center justify-between px-3 py-2 bg-[#18122B] border-b border-[#2B1F4A] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="p-1 h-8 w-8 hover:bg-[#2B1F4A] rounded-full text-[#C2C2DD] hover:text-[#F5F5F5]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-base font-bold flex items-center gap-1 truncate">
              <Trophy className="h-4 w-4 text-yellow-400 flex-shrink-0" />
              <span className="truncate">{battleTitle}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#231b3d] border border-[#2B1F4A] rounded">
              {currentChallengeIndex === 2 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 px-2 text-sm">
                      Challenge {currentChallengeIndex + 1} / {challengesData.length}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#231b3d] border border-[#2B1F4A]">
                    {challengesData.map((challenge, index) => (
                      <DropdownMenuItem
                        key={challenge.challengeId}
                        disabled={!isChallengeUnlocked(challenge.challengeId)}
                        onClick={() => handleSelectChallenge(index)}
                        className={`flex items-center justify-between ${
                          !isChallengeUnlocked(challenge.challengeId) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        } ${index === currentChallengeIndex ? "bg-[#2B1F4A]" : ""}`}
                      >
                        <div className="flex items-center">
                          {!isChallengeUnlocked(challenge.challengeId) && <Lock className="h-3 w-3 mr-1" />}
                          Challenge {index + 1}: {challenge.title.substring(0, 15)}...
                        </div>
                        {getChallengeStatusBadge(challenge.challengeId, index)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="px-2 py-1 text-sm flex items-center">
                  <span>
                    Challenge {currentChallengeIndex + 1} / {challengesData.length}
                  </span>
                </div>
              )}
            </div>
            <div className="bg-[#231b3d] border border-[#2B1F4A] px-2 py-1 rounded text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#E94560]" />
                <span className={`font-mono text-sm ${getTimeColorClass()}`}>{formatTime(timeLeft)}</span>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 border-[#2B1F4A] hover:bg-[#2B1F4A] bg-[#231b3d] hover:text-[#F5F5F5]"
                    onClick={() => setIsProgressPanelOpen(!isProgressPanelOpen)}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    <span className="text-xs">{opponents.length + 1}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You and {opponents.length} others are in this battle</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="destructive" size="sm" className="h-7 px-4 bg-red-600/80 hover:bg-red-700 text-sm">
              Exit
            </Button>
          </div>
        </header>
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        {!isEditorExpanded && (
          <div className="flex items-center justify-between px-3 py-2 bg-[#231b3d] border-b border-[#2B1F4A]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium">{currentChallenge.title}</h2>
              <Badge variant="outline" className="text-xs text-gray-300 bg-[#2B1F4A]/50 border-[#561e7b]">
                {currentChallenge.points} pts
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {challengesData.map((challenge, index) => (
                <Button
                  key={challenge.challengeId}
                  variant={index === currentChallengeIndex ? "default" : "outline"}
                  size="sm"
                  disabled={!isChallengeUnlocked(challenge.challengeId)}
                  onClick={() => handleSelectChallenge(index)}
                  className={`h-7 px-3 ${
                    index === currentChallengeIndex
                      ? "bg-[#B689F4] text-[#0D0A1A]"
                      : "border-[#2B1F4A] bg-[#18122B] text-[#C2C2DD]"
                  } ${!isChallengeUnlocked(challenge.challengeId) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {!isChallengeUnlocked(challenge.challengeId) && <Lock className="h-3 w-3 mr-1" />}
                  {index === 2 ? (
                    <span className="flex items-center">
                      Challenge {index + 1} <ChevronDown className="h-3 w-3 ml-1" />
                    </span>
                  ) : (
                    <span>Challenge {index + 1}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}
        {!isEditorExpanded && (
          <Collapsible
            open={isProblemPanelOpen}
            onOpenChange={setIsProblemPanelOpen}
            className="border-b border-[#2B1F4A]"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-[#18122B] hover:bg-[#231b3d] transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#B689F4]" />
                <span className="font-medium">Problem Description</span>
              </div>
              {isProblemPanelOpen ? (
                <Button variant="ghost">
                  <ChevronUp className="h-4 w-4 text-[#C2C2DD]" /> Close
                </Button>
              ) : (
                <Button variant="ghost">
                  <ChevronDown className="h-4 w-4 text-[#C2C2DD]" />
                  Open
                </Button>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-[#18122B]">
              <div className="max-h-[30vh] overflow-y-auto">
                <Tabs defaultValue="description" className="p-3">
                  <TabsList className="bg-[#0D0A1A] mb-3">
                    <TabsTrigger
                      value="description"
                      className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD] text-xs"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="examples"
                      className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD] text-xs"
                    >
                      Examples
                    </TabsTrigger>
                    <TabsTrigger
                      value="rules"
                      className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD] text-xs"
                    >
                      BattleRules
                    </TabsTrigger>
                    
                  </TabsList>
                  <TabsContent value="description" className="mt-0 bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A]">
                    <div className="space-y-4 p-2">
                      <h2 className="text-lg font-semibold">Problem Description</h2>
                      <p className="text-sm text-[#C2C2DD]">{currentChallenge.description}</p>
                      <h2 className="text-lg font-semibold">Function Name</h2>
                      <p className="text-sm text-[#C2C2DD]">{currentChallenge.functionName}</p>
                      <h2 className="text-lg font-semibold">Number of Arguments</h2>
                      <p className="text-sm text-[#C2C2DD]">{currentChallenge.numArguments}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="examples" className="mt-0 space-y-3">
                    {currentChallenge.testCases.map((testCase, index) => (
                      <div key={index} className="bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A]">
                        <h3 className="font-semibold text-[#B689F4] mb-2 text-sm">Test Case {index + 1}</h3>
                        <div className="mb-2">
                          <div className="text-xs text-[#C2C2DD] mb-1">Input:</div>
                          <pre className="bg-[#1E1B38] p-2 rounded overflow-x-auto text-xs">{testCase.input}</pre>
                        </div>
                        <div className="mb-2">
                          <div className="text-xs text-[#C2C2DD] mb-1">Expected Output:</div>
                          <pre className="bg-[#1E1B38] p-2 rounded overflow-x-auto text-xs">{testCase.expectedOutput}</pre>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="rules" className="mt-0">
                    <div className="bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A]">
                      <h3 className="font-semibold text-yellow-400 mb-2 flex items-center gap-1 text-sm">
                        <AlertCircle className="h-3 w-3" />
                        Battle Rules
                      </h3>
                      <p className="text-sm text-[#C2C2DD]">{battleDetails.battleRules}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-3 py-1 bg-[#18122B] border-b border-[#2B1F4A]">
            <div className="flex items-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#0D0A1A] text-[#F5F5F5] border border-[#2B1F4A] rounded px-2 py-1 text-xs"
                disabled={isEditorReadOnly}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-7 px-2 text-xs border-[#2B1F4A] hover:bg-[#2B1F4A] hover:text-[#F5F5F5]"
                onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
              >
                Theme
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs bg-primary text-white border-[#2B1F4A] hover:bg-[#2B1F4A] hover:text-[#F5F5F5]"
                onClick={toggleEditorExpansion}
              >
                {isEditorExpanded ? <Minimize className="h-3 w-3 mr-1" /> : <Expand className="h-3 w-3 mr-1" />}
                {isEditorExpanded ? "Exit" : "Fullscreen"}
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0">
              <Editor
                height="100%"
                language={language === "javascript" ? "javascript" : language === "python" ? "python" : "java"}
                value={code}
                onChange={handleCodeChange}
                theme={theme}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  readOnly: isEditorReadOnly,
                }}
              />
              {isSubmitted && showNextChallengeButton && (
                <div className="absolute inset-0 bg-[#0D0A1A]/70 flex flex-col items-center justify-center z-10">
                  <div className="bg-[#231b3d] border border-[#2B1F4A] rounded-lg p-6 max-w-md text-center">
                    <CheckSquare className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Challenge Completed!</h3>
                    <p className="text-[#C2C2DD] mb-4">
                      You've completed Challenge {currentChallengeIndex + 1}. Ready for the next one?
                    </p>
                    <div className="flex justify-center">
                      <Button className="bg-[#14AE5C] hover:bg-[#14AE5C]/80 text-white" onClick={handleNextChallenge}>
                        <ArrowRight className="h-4 w-4 mr-1" /> Next Challenge
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 bg-[#18122B] border-t border-b border-[#2B1F4A]">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRunCode}
                disabled={isExecuting || isEditorReadOnly}
                className="bg-[#14AE5C] hover:bg-[#14AE5C]/80 text-white transition-all duration-200 transform hover:scale-105 h-8"
                size="sm"
              >
                {isExecuting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
                Run Code
              </Button>
              {!isSubmitted ? (
                <Button
                  onClick={handleSubmitCode}
                  disabled={isExecuting || isEditorReadOnly}
                  className="bg-[#E94560] hover:bg-[#E94560]/80 text-white transition-all duration-200 transform hover:scale-105 h-8"
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Submit
                </Button>
              ) : (
                <Button disabled className="bg-[#2B1F4A] text-[#C2C2DD] h-8 cursor-not-allowed" size="sm">
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Submitted
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-[#2B1F4A]"
                onClick={() => setIsOutputPanelOpen(!isOutputPanelOpen)}
              >
                {isOutputPanelOpen ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronUp className="h-3 w-3 mr-1" />}
                {isOutputPanelOpen ? "Hide Output" : "Show Output"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-[#2B1F4A]"
                onClick={() => setIsProgressPanelOpen(!isProgressPanelOpen)}
              >
                {isProgressPanelOpen ? (
                  <ChevronDown className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronUp className="h-3 w-3 mr-1" />
                )}
                {isProgressPanelOpen ? "Hide Progress" : "Show Progress"}
              </Button>
            </div>
          </div>
        </div>
        <Collapsible open={isOutputPanelOpen} onOpenChange={setIsOutputPanelOpen} className="border-t border-[#2B1F4A]">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-[#18122B] hover:bg-[#231b3d] transition-colors md:hidden">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-[#B689F4]" />
              <span className="font-medium">Output & Test Cases</span>
            </div>
            {isOutputPanelOpen ? (
              <ChevronUp className="h-4 w-4 text-[#C2C2DD]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#C2C2DD]" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-[#18122B]">
            <div className="h-[25vh] flex flex-col">
              <Tabs
                defaultValue="output"
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex flex-col h-full"
              >
                <div className="flex items-center px-3 py-1 bg-[#18122B]">
                  <TabsList className="bg-[#0D0A1A] h-7">
                    <TabsTrigger
                      value="output"
                      className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD] text-xs h-6"
                    >
                      Output
                    </TabsTrigger>
                    <TabsTrigger
                      value="testcases"
                      className="data-[state=active]:bg-[#2B1F4A] data-[state=active]:text-[#F5F5F5] text-[#C2C2DD] text-xs h-6"
                    >
                      Test Cases
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex-1 overflow-hidden">
                  <TabsContent value="output" className="p-0 m-0 h-full">
                    <pre
                      ref={outputRef}
                      className="bg-[#1E1B38] text-[#C2C2DD] p-3 h-full overflow-auto font-mono text-xs"
                    >
                      {output || "Run your code to see output here..."}
                    </pre>
                  </TabsContent>
                  <TabsContent value="testcases" className="p-0 m-0 h-full overflow-auto">
                    <div className="bg-[#1E1B38] p-2">
                      {testResults.map((test) => (
                        <div key={test.id} className="border border-[#2B1F4A] rounded-lg overflow-hidden mb-2">
                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-[#18122B] transition-colors">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">Test #{test.id}</span>
                                {test.status === "passed" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-500/20 text-green-400 border-green-500 text-xs py-0 h-5"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" /> Passed
                                  </Badge>
                                )}
                                {test.status === "failed" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-500/20 text-red-400 border-red-500 text-xs py-0 h-5"
                                  >
                                    <XCircle className="h-3 w-3 mr-1" /> Failed
                                  </Badge>
                                )}
                                {test.status === "waiting" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-500/20 text-yellow-400 border-yellow-500 text-xs py-0 h-5"
                                  >
                                    <Clock className="h-3 w-3 mr-1" /> Waiting
                                  </Badge>
                                )}
                              </div>
                              <ChevronDown className="h-3 w-3 text-[#C2C2DD]" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="p-2 border-t border-[#2B1F4A] bg-[#18122B]">
                                <div className="mb-2">
                                  <div className="text-xs text-[#C2C2DD] mb-1">Input:</div>
                                  <pre className="bg-[#0D0A1A] p-2 rounded text-xs overflow-x-auto">{test.input}</pre>
                                </div>
                                {test.status === "failed" ? (
                                  <div className="mt-2 p-2 bg-[#E94560]/10 border border-[#E94560]/30 rounded">
                                    <div className="text-xs text-[#E94560] mb-1">Error:</div>
                                    <pre className="bg-[#0D0A1A] p-2 rounded text-xs overflow-x-auto">
                                      {(() => {
                                        if (test.actualOutput.includes('Error:') || test.actualOutput.includes('/piston/jobs/')) {
                                          const errorLines = test.actualOutput.split('\n');
                                          const fileLine = errorLines.find(line => line.includes('/piston/jobs/'));
                                          
                                          if (fileLine) {
                                            const fileLineIndex = errorLines.indexOf(fileLine);
                                            const codeLine = errorLines[fileLineIndex + 1];
                                            const pointerLine = errorLines.find(line => line.includes('^'));
                                            const errorMessageLine = errorLines.find(line => 
                                              line.includes('Error:') || 
                                              line.includes('SyntaxError:') || 
                                              line.includes('TypeError:') || 
                                              line.includes('ReferenceError:')
                                            );

                                            if (codeLine && pointerLine && errorMessageLine) {
                                              return `${fileLine}\n${codeLine}\n${pointerLine}\n\n${errorMessageLine}`;
                                            }
                                          }
                                        }
                                        return test.actualOutput.includes('Error:') 
                                          ? test.actualOutput 
                                          : `Got: ${test.actualOutput}\nExpected: ${test.expectedOutput}`;
                                      })()}
                                    </pre>
                                  </div>
                                ) : (
                                  <div className="mb-2">
                                    <div className="text-xs text-[#C2C2DD] mb-1">Expected Output:</div>
                                    <pre className="bg-[#0D0A1A] p-2 rounded text-xs overflow-x-auto">
                                      {test.expectedOutput}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible
          open={isProgressPanelOpen}
          onOpenChange={setIsProgressPanelOpen}
          className="border-t border-[#2B1F4A]"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-[#18122B] hover:bg-[#231b3d] transition-colors md:hidden">
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-[#B689F4]" />
              <span className="font-medium">Battle Progress</span>
            </div>
            {isProgressPanelOpen ? (
              <ChevronUp className="h-4 w-4 text-[#C2C2DD]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#C2C2DD]" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-[#231b3d]">
            <div className="p-3 space-y-3">
              <div className="bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A] mb-3">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  Challenge Progress
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {challengesData.map((challenge, index) => (
                    <div
                      key={challenge.challengeId}
                      className={`p-2 rounded-md text-center ${
                        index === currentChallengeIndex
                          ? "bg-[#2B1F4A] border border-[#B689F4]"
                          : completedChallenges.includes(challenge.challengeId)
                            ? "bg-[#14AE5C]/20 border border-[#14AE5C]/50"
                            : isChallengeUnlocked(challenge.challengeId)
                              ? "bg-[#18122B] border border-[#2B1F4A]"
                              : "bg-[#18122B] border border-[#2B1F4A] opacity-50"
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">Challenge {index + 1}</div>
                      {completedChallenges.includes(challenge.challengeId) && (
                        <CheckCircle className="h-3 w-3 text-green-400 mx-auto" />
                      )}
                      {index === currentChallengeIndex && !completedChallenges.includes(challenge.challengeId) && (
                        <div className="text-xs text-[#B689F4]">Current</div>
                      )}
                      {!isChallengeUnlocked(challenge.challengeId) && !completedChallenges.includes(challenge.challengeId) && (
                        <Lock className="h-3 w-3 text-[#C2C2DD] mx-auto" />
                      )}
                      {isChallengeUnlocked(challenge.challengeId) &&
                        index !== currentChallengeIndex &&
                        !completedChallenges.includes(challenge.challengeId) && (
                          <div className="text-xs text-[#C2C2DD]">Unlocked</div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-32">
                  <div className="h-6 w-6 rounded-full bg-[#8A63D2] flex items-center justify-center relative">
                    <User className="h-3 w-3" />
                    {userStatus !== "idle" && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                            userStatus === "typing" ? "bg-blue-400" : "bg-green-400"
                          } opacity-75`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${
                            userStatus === "typing" ? "bg-blue-500" : "bg-green-500"
                          }`}
                        ></span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">You</span>
                    {getStatusIcon(userStatus)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-[#0D0A1A] rounded-full h-2 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7B3FBF] to-[#B689F4] transition-all duration-300 ease-in-out"
                      style={{ width: `${userProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-[#C2C2DD]">
                      {completedChallenges.length} of {challengesData.length} Challenges Completed
                    </span>
                    <span className="text-xs font-mono font-bold">{userProgress}%</span>
                  </div>
                </div>
              </div>
              {opponents.map((opponent) => (
                <div key={opponent.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-32">
                    <div className="relative">
                      <div className="h-6 w-6 rounded-full bg-[#2B1F4A] border border-[#2B1F4A] flex items-center justify-center">
                        <User className="h-3 w-3 text-[#C2C2DD]" />
                      </div>
                      {opponent.status !== "idle" && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                            opponent.status === "typing" ? "bg-blue-400" : "bg-green-400"
                          } opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${
                            opponent.status === "typing" ? "bg-blue-500" : "bg-green-500"
                          }`}></span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium truncate">{battleDetails?.player2?.name}</span>
                      {opponent.status === "typing" ? (
                        <span className="text-blue-400 flex items-center text-xs">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Typing...
                        </span>
                      ) : opponent.status === "submitted" ? (
                        <span className="text-green-400 flex items-center text-xs">
                          <CheckCheck className="h-3 w-3 mr-1" /> Submitted
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-[#0D0A1A] rounded-full h-2 relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#545A91] to-[#8A63D2]/70 transition-all duration-300 ease-in-out"
                        style={{ width: `${opponent.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-[#C2C2DD]">
                        {Math.round(opponent.progress / 100 * challengesData.length)} of {challengesData.length} Challenges Completed
                      </span>
                      <span className="text-xs font-mono font-bold">{opponent.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
              {challengeResults.length > 0 && (
                <div className="mt-4 bg-[#0D0A1A] rounded-lg p-3 border border-[#2B1F4A]">
                  <h3 className="text-sm font-semibold mb-2">Challenge Results</h3>
                  <div className="space-y-2">
                    {challengeResults.map((result) => (
                      <div
                        key={result.challengeId}
                        className="flex justify-between items-center text-xs p-2 bg-[#18122B] rounded"
                      >
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>{result.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#C2C2DD]">
                            {result.passedTests}/{result.totalTests} tests
                          </span>
                          <span className="font-medium text-yellow-400">+{result.score} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="bg-[#18122B] border border-[#2B1F4A] text-[#F5F5F5] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              All Tests Passed! 🎉
            </DialogTitle>
            <DialogDescription className="text-[#C2C2DD]">
              Congratulations! You've passed all test cases for Challenge {currentChallengeIndex + 1}.
              Ready to submit your solution?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-[#0D0A1A] rounded-lg p-4 border border-[#2B1F4A]">
              <p className="text-sm text-[#F5F5F5]">Upon finalizing your submission:</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Your solution will be recorded with a perfect score</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Lock className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Your code will be locked and become read-only</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <ArrowRight className="h-4 w-4 text-[#B689F4] mt-0.5 flex-shrink-0" />
                  <span>You'll be able to proceed to the next challenge</span>
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsSubmitModalOpen(false)}
              className="text-neutral-900 hover:text-neutral-200 border-[#2B1F4A] hover:bg-[#2B1F4A]"
            >
              Keep Editing
            </Button>
            <Button onClick={handleFinalizeSubmission} className="bg-[#14AE5C] hover:bg-[#14AE5C]/80 text-white">
              <CheckSquare className="h-4 w-4 mr-1" /> Finalize Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="bg-[#18122B] border border-[#2B1F4A] text-[#F5F5F5] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              Test Cases Failed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-[#0D0A1A] rounded-lg p-4 border border-red-500/30">
              <p className="text-lg text-center font-bold mb-2">🔍 Some Test Cases Failed</p>
              <p className="text-center text-sm mb-2">
                Your solution didn't pass all test cases. Please review the failing tests and try again.
              </p>
              <p className="text-center text-sm text-yellow-400">
                Fix the errors in your code to proceed with submission.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsErrorModalOpen(false);
              }}
              className="bg-[#E94560] hover:bg-[#E94560]/80 text-white w-full"
            >
              Continue Editing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}