import { Card, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const TestCases = ({ testCases }) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-none bg-white rounded-md p-6">
        <CardTitle className="text-2xl font-semibold text-neutral-800 mb-4">Test Cases</CardTitle>
        <div className="space-y-4">
          {testCases.map((test) => (
            <div
              key={test.id}
              className={`rounded-lg p-4 relative ${test.output === null ? "bg-gray-50" : test.passed ? "bg-green-50" : "bg-red-50"}`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className={`font-medium ${test.passed ? "text-green-600" : "text-neutral-600"}`}>
                    Test Case #{test.id}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-neutral-700"><span className="font-medium">Input:</span> {test.input}</p>
                    <p className="text-neutral-700"><span className="font-medium">Expected:</span> {test.expected}</p>
                    {test.explanation && <p className="text-neutral-600 text-sm mt-2">{test.explanation}</p>}
                  </div>
                </div>
                {test.output !== null && (test.passed ? <Check className="text-green-500 h-5 w-5" /> : <X className="text-red-500 h-5 w-5" />)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TestCases;