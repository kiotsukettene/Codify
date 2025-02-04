import React, { useState } from 'react'

function useToggleVisibility() {
    const [isVisible, setIsVisible] = useState(false)
    
    const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  return [isVisible, toggleVisibility]

 
}

export default useToggleVisibility
