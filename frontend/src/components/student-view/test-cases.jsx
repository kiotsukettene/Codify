import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const TestCases = () => {
  const testCases = [
    {
      id: 1,
      input: {
        nums: [2, 7, 11, 15],
        target: 9,
      },
      expected: [0, 1],
      output: [0, 1],
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      id: 2,
      input: {
        nums: [3, 3],
        target: 6,
      },
      expected: [0, 1],
      output: [0, 1],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Example Card */}
     

      {/* Test Cases List */}
      <Card className="shadow-none bg-white rounded-md p-6">
        <CardTitle className="text-2xl font-semibold text-neutral-800 mb-4">Test Cases</CardTitle>
        <div className="space-y-4">
          {testCases.map((test) => (
            <div key={test.id} className="bg-green-50 rounded-lg p-4 relative">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-green-600 font-medium">Test Case #{test.id}</h3>
                  <div className="space-y-1">
                    <p className="text-neutral-700">
                      <span className="font-medium">Input:</span> nums = [{test.input.nums.join(",")}], target ={" "}
                      {test.input.target}
                    </p>
                    <p className="text-neutral-700">
                      <span className="font-medium">Expected:</span> [{test.expected.join(",")}]
                    </p>
                    <p className="text-neutral-700">
                      <span className="font-medium">Output:</span> [{test.output.join(",")}]
                    </p>
                    {test.explanation && <p className="text-neutral-600 text-sm mt-2">{test.explanation}</p>}
                  </div>
                </div>
                <Check className="text-green-500 h-5 w-5" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default TestCases

