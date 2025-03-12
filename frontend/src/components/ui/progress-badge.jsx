import { Star } from "lucide-react"

const ProgressBadge = () => {
  return (
    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium space-x-2 border border-white/20">
      <Star className="w-4 h-4 text-yellow-300" />
      <span>Level 1 Coder</span>
      <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="w-1/4 h-full bg-yellow-300 rounded-full" />
      </div>
    </div>
  )
}

export default ProgressBadge

