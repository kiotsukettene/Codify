"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

const CodeTimer = () => {
    const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
    const [isRunning, setIsRunning] = useState(false)
    const [customMinutes, setCustomMinutes] = useState(15)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [showTimeUp, setShowTimeUp] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const [isMuted, setIsMuted] = useState(false)
    const audioRef = useRef(null)

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    audioRef.current = new Audio("https://vgmsite.com/soundtracks/nana-707-soundtracks/yhhusbzb/20%20-%20yachin%20ga%20hanbun.mp3")
    audioRef.current.volume = volume
  }, [volume])

  // Update audio volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])


  // Timer logic
  useEffect(() => {
    let interval

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0 && !showTimeUp) {
      setIsRunning(false)
      setShowTimeUp(true)
      if (!isMuted && audioRef.current) {
        audioRef.current.play()
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isMuted, showTimeUp])

  // Handle custom time setting
  const handleSetCustomTime = useCallback(() => {
    const newTime = Math.max(0, Math.min(customMinutes, 999)) * 60
    setTimeLeft(newTime)
    setIsSettingsOpen(false)
    setIsRunning(false)
    setShowTimeUp(false)
  }, [customMinutes])

  // Reset timer
  const handleReset = useCallback(() => {
    setTimeLeft(15 * 60)
    setIsRunning(false)
    setShowTimeUp(false)
  }, [])

  // Toggle timer
  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev)
  }, [])

  // Handle time up acknowledgment
  const handleTimeUpClose = () => {
    setShowTimeUp(false)
    handleReset()
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="flex flex-row items-center justify-center gap-3  w-[300px]">
      {/* Timer Display */}
      <div className="text-3xl font-bold text-primary">{formatTime(timeLeft)}</div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={toggleTimer} >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
        </Button>

        <Button variant="outline" size="icon" onClick={handleReset}>
          <RotateCcw className="h-6 w-6" />
        </Button>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" >
              <Settings className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Timer Settings</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Number.parseInt(e.target.value) || 0)}
                  min="1"
                  max="999"
                  className="w-full"
                  placeholder="Enter minutes"
                />
              </div>
         

              <Button onClick={handleSetCustomTime}>Set Timer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <AlertDialog open={showTimeUp} onOpenChange={setShowTimeUp}>
        <AlertDialogContent className="animate-in fade-in-0 zoom-in-95">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-primary">Time's Up!</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              Your time has ended. Please submit your answer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleTimeUpClose}>Got it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>c
      </AlertDialog>

     
    </div>
  )
}

export default CodeTimer