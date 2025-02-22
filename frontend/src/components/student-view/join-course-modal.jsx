
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import pinkCloud from '@/assets/picture/random background/pinkCloud.png'
import { Badge } from "../ui/badge"



const JoinCourseModal = ({ isOpen, onClose }) => {
  const [courseCode, setCourseCode] = useState("")
  const [status, setStatus] = useState("idle") 

  useEffect(() => {
    if (!isOpen) {
      setCourseCode("")
      setStatus("idle")
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus("loading")


    //=================API call=========================
    //============Example Course Code only =============
    setTimeout(() => {
      if (courseCode === "12345") {
        setStatus("success")
      } else {
        setStatus("error")
        setCourseCode("")
      }
    }, 1000)
  }

  useEffect(() => {
    if (status === "success") {
      setTimeout(() => {
        onClose(); 
      }, 2000);
    }
  }, [status]);
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="flex items-center justify-center">
      <DialogContent className="sm:max-w-[425px] bg-white border-none shadow-none text-neutral-900 overflow-hidden">
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-semibold">Enter Course Code</DialogTitle>
          <DialogDescription className="text-gray-800">
            Use the code provided by your professor to join this course.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="relative">
            <Input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Enter code here"
              className={`bg-opacity-10 text-neutral-900 placeholder-gray-400 bg-[#e5a0ce] border-[#654ff0] focus:ring-[#9c88ff] ${
                status === "error" ? "animate-shake border-red-500" : ""
              } ${status === "success" ? "border-green-500" : ""}`}
              autoFocus
            />
            {status === "success" && (
              <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
            )}
          </div>

          {status === "success" && (
            <p className="text-green-600 text-center font-medium">You've successfully joined the course!</p>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onClose} className="text-neutral-800 bg-neutral-200">
              Cancel
            </Button>
            <Button type="submit" disabled={status === "loading"} className="bg-primary">
              {status === "loading" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Join Now"}
            </Button>
          </div>
        </form>

        {/* Background Image */}
        <div className="absolute bottom-[30%] left-0 w-full">
          <img
            src={pinkCloud}
            alt="Decorative Background"
            className="w-full object-cover opacity-85"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JoinCourseModal

  