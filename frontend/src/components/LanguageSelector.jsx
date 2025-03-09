import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { LANGUAGE_VERSIONS } from "@/constants"

const languages = Object.entries(LANGUAGE_VERSIONS)

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <div className = "ml-2">
    <Select value={language} onValueChange={onSelect }>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent islazy className='bg-neutral-200'>
        <SelectGroup>
            {languages.map(([lang]) => (
                <SelectItem 
                key={lang} 
                value={lang}
                color={
                    lang === language ? "primary" : "default"
                }
                >
                {lang}
              
                </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
  )
}

export default LanguageSelector
