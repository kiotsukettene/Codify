import React, { useCallback, useRef } from "react"

import { useMousePositionRef } from "@/hooks/use-mouse-position-ref"
import { motion, useAnimationFrame } from "motion/react"

const VariableFontAndCursor = ({
  label,
  fontVariationMapping,
  className,
  containerRef,
  onClick,
  ...props
}) => {
  const mousePositionRef = useMousePositionRef(containerRef)
  const spanRef = useRef(null)  // Add ref for the span

  const interpolateFontVariationSettings = useCallback((
    xPosition,
    yPosition
  ) => {
    const container = containerRef.current
    if (!container) return "0 0" // Return default values if container is null

    const containerWidth = container.clientWidtt
    const containerHeight = container.clientHeight

    const xProgress = Math.min(Math.max(xPosition / containerWidth, 0), 1)
    const yProgress = Math.min(Math.max(yPosition / containerHeight, 0), 1)

    const xValue =
      fontVariationMapping.x.min +
      (fontVariationMapping.x.max - fontVariationMapping.x.min) * xProgress
    const yValue =
      fontVariationMapping.y.min +
      (fontVariationMapping.y.max - fontVariationMapping.y.min) * yProgress

    return `'${fontVariationMapping.x.name}' ${xValue}, '${fontVariationMapping.y.name}' ${yValue}`
  }, [])

  useAnimationFrame(() => {
    const settings = interpolateFontVariationSettings(mousePositionRef.current.x, mousePositionRef.current.y)
    if (spanRef.current) {
      spanRef.current.style.fontVariationSettings = settings
    }
  })

  return (
    (<motion.span
      ref={spanRef}
      className={`${className} inline-block`}
      onClick={onClick}
      {...props}>
      {label}
    </motion.span>)
  );
}

export default VariableFontAndCursor
