import { useState } from "react"
import { motion, useAnimate } from "motion/react";
import { debounce } from "lodash"

const RandomLetterSwapPingPong = ({
  label,
  reverse = true,

  transition = {
    type: "spring",
    duration: 0.8,
  },

  staggerDuration = 0.02,
  className,
  onClick,
  ...props
}) => {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)

  const mergeTransition = (transition, i) => ({
    ...transition,
    delay: i * staggerDuration,
  })

  const shuffledIndices = Array.from({ length: label.length }, (_, i) => i).sort(() => Math.random() - 0.5)

  const hoverStart = debounce(() => {
    if (blocked) return
    setBlocked(true)

    for (let i = 0; i < label.length; i++) {
      const randomIndex = shuffledIndices[i]
      animate(".letter-" + randomIndex, {
        y: reverse ? "100%" : "-100%",
      }, mergeTransition(transition, i))

      animate(".letter-secondary-" + randomIndex, {
        top: "0%",
      }, mergeTransition(transition, i))
    }
  }, 100, { leading: true, trailing: true })

  const hoverEnd = debounce(() => {
    setBlocked(false)

    for (let i = 0; i < label.length; i++) {
      const randomIndex = shuffledIndices[i]
      animate(".letter-" + randomIndex, {
        y: 0,
      }, mergeTransition(transition, i))

      animate(".letter-secondary-" + randomIndex, {
        top: reverse ? "-100%" : "100%",
      }, mergeTransition(transition, i))
    }
  }, 100, { leading: true, trailing: true })

  return (
    (<motion.span
      className={`flex justify-center items-center relative overflow-hidden  ${className} `}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}>
      <span className="sr-only">{label}</span>
      {label.split("").map((letter, i) => {
        return (
          (<span className="whitespace-pre relative flex" key={i}>
            <motion.span className={`relative pb-2 letter-${i}`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className={`absolute letter-secondary-${i}`}
              aria-hidden={true}
              style={{ top: reverse ? "-100%" : "100%" }}>
              {letter}
            </motion.span>
          </span>)
        );
      })}
    </motion.span>)
  );
}

export default RandomLetterSwapPingPong
