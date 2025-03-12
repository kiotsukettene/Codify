import { Code, Braces, Terminal, Star, Hash } from "lucide-react"

const FloatingElements = () => {
  const elements = [
    { icon: Code, delay: 0 },
    { icon: Braces, delay: 1 },
    { icon: Terminal, delay: 2 },
    { icon: Star, delay: 3 },
    { icon: Hash, delay: 4 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((Element, index) => (
        <div
          key={index}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Element.delay}s`,
            opacity: 0.2,
          }}
        >
          <Element.icon className="w-8 h-8 text-white" />
        </div>
      ))}
    </div>
  )
}

export default FloatingElements

