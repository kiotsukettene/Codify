"use client"

import { useState } from "react"
import { Check, Copy, ChevronDown, ChevronUp, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

const CodeSnippetModule = ({
  code = '# Example code\ndef greet(name):\n    return f"Hello, {name}!"',
  className,
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

 

  // Add line numbers
  const codeWithLineNumbers = () => {
    const lines = code.split("\n")
    return lines.map((line, i) => (
      <div key={i} className="code-line">
        <span className="line-number">{i + 1}</span>
        <span className="line-content" dangerouslySetInnerHTML={{ __html: (line) }}></span>
      </div>
    ))
  }

  return (
    <div className={`cosmic-code-container my-4 ${className}`}>
      <div className="rounded-lg overflow-hidden shadow-sm bg-[#0f172a] w-full">
        {/* Header */}
        <div className="bg-[#2f1d44] px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="w-3 h-3 text-white" />
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/10"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              <span className="sr-only">{isExpanded ? "Collapse" : "Expand"}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/10 relative"
              onClick={handleCopy}
            >
              {isCopied ? <Check className="w-3 h-3 text-[#86efac]" /> : <Copy className="w-3 h-3" />}
              <span className="sr-only">Copy code</span>

              {isCopied && (
                <span className="absolute right-0 top-full mt-1 px-2 py-0.5 bg-[#1e3a8a] text-white text-xs rounded shadow-sm whitespace-nowrap">
                  Copied!
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Code content */}
        {isExpanded && <div className="p-3 font-mono text-xs cosmic-code-content">{codeWithLineNumbers()}</div>}
      </div>

      <style jsx>{`
        .cosmic-code-content {
          color: #e2e8f0;
          font-family: 'Menlo', 'Monaco', monospace;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .code-line {
          display: flex;
          padding: 1px 0;
        }
        
        .line-number {
          color: #334155;
          text-align: right;
          padding-right: 0.75rem;
          user-select: none;
          min-width: 1.5rem;
          border-right: 1px solid #334155;
          margin-right: 0.75rem;
        }
        
        .keyword {
          color: #7dd3fc;
        }
        
        .string {
          color: #86efac;
        }
        
        .comment {
          color: #64748b;
        }
        
        .number {
          color: #f59e0b;
        }
        
        .function {
          color: #c084fc;
        }
      `}</style>
    </div>
  )
}

export default CodeSnippetModule


