import { useMemo } from "react"
import { motion } from "motion/react";

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const VariableFontHoverByRandomLetter = ({
  label,
  fromFontVariationSettings = "'wght' 400, 'slnt' 0",
  toFontVariationSettings = "'wght' 900, 'slnt' -10",

  transition = {
    type: "spring",
    duration: 0.7,
  },

  staggerDuration = 0.03,
  className,
  onClick,
  ...props
}) => {
  const shuffledIndices = useMemo(() => {
    const indices = Array.from({ length: label.length }, (_, i) => i)
    shuffleArray(indices)
    return indices
  }, [label])

  const letterVariants = {
    hover: (index) => ({
      fontVariationSettings: toFontVariationSettings,
      transition: {
        ...transition,
        delay: staggerDuration * index,
      },
    }),
    initial: (index) => ({
      fontVariationSettings: fromFontVariationSettings,
      transition: {
        ...transition,
        delay: staggerDuration * index,
      },
    }),
  }

  return (
    (<motion.span
      className={`${className}`}
      onClick={onClick}
      whileHover="hover"
      initial="initial"
      {...props}>
      <span className="sr-only">{label}</span>
      {label.split("").map((letter, i) => {
        const index = shuffledIndices[i]
        return (
          (<motion.span
            key={i}
            className="inline-block whitespace-pre"
            aria-hidden="true"
            variants={letterVariants}
            custom={index}>
            {letter}
          </motion.span>)
        );
      })}
    </motion.span>)
  );
}

export default VariableFontHoverByRandomLetter
