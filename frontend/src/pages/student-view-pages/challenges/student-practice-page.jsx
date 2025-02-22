
import { useState } from "react"
import Editor from "@monaco-editor/react"
import { Play, Send, Sparkles, Loader2, Check, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import CodeTimer from "@/components/student-view/timer"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import TestCases from "@/components/student-view/test-cases"
import { useToast } from "@/hooks/use-toast"

function StudentPracticePage() {
  const [value, setValue] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState("idle") // idle, loading, success, error
  const { toast } = useToast()

  const handleSubmit = async () => {
    setSubmissionStatus("loading")

    try {
      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate success/failure (random for demo)
      const isSuccess = Math.random() > 0.5
      if (!isSuccess) throw new Error()

      setSubmissionStatus("success")
      toast({
        title: "✅ Submission Successful!",
        description: "Great job! Your solution has been submitted.",
      })
    } catch (error) {
      setSubmissionStatus("error")
      toast({
        title: "❌ Submission Failed",
        description: "Please check your code and try again.",
        variant: "destructive",
      })
    } finally {
      // Reset status after 2 seconds
      setTimeout(() => setSubmissionStatus("idle"), 2000)
    }
  }

  const getSubmitButton = () => {
    switch (submissionStatus) {
      case "loading":
        return (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </Button>
        )
      case "success":
        return (
          <Button className="bg-green-500 hover:bg-green-600">
            <Check className="mr-2 h-4 w-4" />
            Submitted!
          </Button>
        )
      case "error":
        return (
          <Button variant="destructive">
            <AlertCircle className="mr-2 h-4 w-4" />
            Failed
          </Button>
        )
      default:
        return (
          <Button variant="outline" onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
        )
    }
  }

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 p-4">
      <div className="w-full lg:w-2/3">
        <div className="flex items-center gap-3 mt-2">
          <div className="p-2 bg-violet-200 rounded-lg">
            <Sparkles fill="#7548C1" />
          </div>
          <div>
            <p className="text-sm text-gray-800 font-medium">Two Sum</p>
          </div>
          <Separator className="h-12 w-[1px] bg-primary" />
          <Badge>Easy</Badge>
        </div>

        <Editor
          height={700}
          language="javascript"
          theme="vs-dark"
          defaultValue={`// Write your code here\nfunction sumPositiveNumbers(arr) {\n\n}`}
          value={value}
          onChange={(value) => setValue(value)}
          className="mt-3"
        />

        <div className="flex justify-between mt-2">
          <div className="flex gap-2">
            <Button>
              <Play className="mr-2 h-4 w-4" /> Run Code
            </Button>
            {getSubmitButton()}
          </div>
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
            Given an array of integers nums and an integer target, return indices of the two numbers in nums such that
            they add up to target. You may assume that each input would have exactly one solution, and you may not use
            the same element twice.
          </CardDescription>
          <CardContent className="mt-4 bg-purple-50 p-4">
            <p className="font-semibold text-neutral-800">Example:</p>
            <p className="text-sm mt-3">
              Input: nums = [2,7,11,15] <br />
              target = 9 <br /> Output:[0,1] <br />
              Explanation:Because nums[0] + nums[1] == 9, we return [0, 1].
            </p>
          </CardContent>
        </Card>

        <div className="mt-5">
          <TestCases />
        </div>
      </div>
    </div>
  )
}

export default StudentPracticePage

