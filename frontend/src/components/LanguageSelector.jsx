import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { LANGUAGE_VERSIONS } from "@/constants"
import { Check } from "lucide-react"
import React from "react"
const languages = Object.entries(LANGUAGE_VERSIONS)

const JavaScriptLogo = () => (
  <div className="flex items-center justify-center w-5 h-5 rounded-sm bg-yellow-300">
    <span className="text-black font-bold text-xs">JS</span>
  </div>
)

const JavaLogo = () => (
  <div className="flex items-center justify-center w-5 h-5 rounded-sm bg-red-600">
    <span className="text-white font-bold text-xs">J</span>
  </div>
)

const CSharpLogo = () => (
  <div className="flex items-center justify-center w-5 h-5 rounded-sm bg-purple-600">
    <span className="text-white font-bold text-xs">C#</span>
  </div>
)

const PythonLogo = () => (
  <div className="flex items-center justify-center w-5 h-5 rounded-sm">
    <div className="flex">
      <div className="w-2.5 h-2.5 bg-blue-500"></div>
      <div className="w-2.5 h-2.5 bg-yellow-500"></div>
    </div>
   
  </div>
)

const CLogo = () => (
  <div className="flex items-center justify-center w-5 h-5 rounded-sm bg-blue-600">
    <span className="text-white font-bold text-xs">C</span>
  </div>
)

const CppLogo = () => (
  <div className="flex items-center justify-center w-5 h-5 rounded-sm bg-blue-700">
    <span className="text-white font-bold text-xs">C++</span>
  </div>
)
const languageLogos = {
  javascript: JavaScriptLogo,
  java: JavaLogo,
  csharp: CSharpLogo,
  python: PythonLogo,
  c: CLogo,
  cpp: CppLogo,
}

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <div className = "ml-2">
    <Select value={language} onValueChange={onSelect }>
    <SelectTrigger className="w-[180px] bg-neutral-100 border-none hover:bg-neutral-200 transition-colors">
          <div className="flex items-center gap-2">
            {language && languageLogos[language] }
            <SelectValue placeholder="Select language" />
          </div>
        </SelectTrigger>
      <SelectContent islazy className='bg-neutral-200'>
      <SelectGroup>
            {languages.map(([lang]) => {
              const LogoComponent = languageLogos[lang]
              return (
                <SelectItem key={lang} value={lang} className="relative pl-10 hover:bg-neutral-200 cursor-pointer">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">
                    {language === lang && <Check className="h-4 w-4" />}
                  </span>
                  <div className="flex items-center gap-2">
                    {LogoComponent && <LogoComponent />}
                    <span>{lang.toLowerCase()}</span>
                  </div>
                </SelectItem>
              )
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
  )
}

export default LanguageSelector
