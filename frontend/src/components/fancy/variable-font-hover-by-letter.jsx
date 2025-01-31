import { useState } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { debounce } from "lodash";

const VariableFontHoverByLetter = ({
  label,
  fromFontVariationSettings = { wght: 400, slnt: 0 }, // Default as an object
  toFontVariationSettings = { wght: 900, slnt: -10 }, // Default as an object
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}) => {
  const [scope, animate] = useAnimate();
  const [isHovered, setIsHovered] = useState(false);

  const mergeTransition = (baseTransition) => ({
    ...baseTransition,
    delay: stagger(staggerDuration, {
      from: staggerFrom,
    }),
  });

  const hoverStart = debounce(() => {
    if (isHovered) return;
    setIsHovered(true);

    animate(
      ".letter",
      {
        style: {
          fontVariationSettings: `"'wght' ${toFontVariationSettings.wght}, 'slnt' ${toFontVariationSettings.slnt}"`
        },
      },
      mergeTransition(transition)
    );
  }, 100, { leading: true, trailing: true });

  const hoverEnd = debounce(() => {
    setIsHovered(false);

    animate(
      ".letter",
      {
        style: {
          fontVariationSettings: `"'wght' ${fromFontVariationSettings.wght}, 'slnt' ${fromFontVariationSettings.slnt}"`
        },
      },
      mergeTransition(transition)
    );
  }, 100, { leading: true, trailing: true });

  return (
    <motion.span
      className={`${className}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {label.split("").map((letter, i) => {
        return (
          <motion.span key={i} className="inline-block whitespace-pre letter" aria-hidden="true">
            {letter}
          </motion.span>
        );
      })}
    </motion.span>
  );
};

export default VariableFontHoverByLetter;
