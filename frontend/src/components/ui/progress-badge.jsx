import { Rocket, Star } from "lucide-react"

const ProgressBadge = ({title}) => {
  return (
    <div className="inline-flex items-center px-4 py-2 bg-primary backdrop-blur-sm rounded-full text-white text-sm font-medium space-x-2 border border-white/20">
      <Rocket className="w-4 h-4"/>
      <span>{title}</span>
      <div className="w-20 h-1 bg-white shadow-[0_0_10px_white] rounded-full overflow-hidden"></div>
    </div>
  )
}

export default ProgressBadge

