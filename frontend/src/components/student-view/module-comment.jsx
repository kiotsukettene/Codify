"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MessageCircle, ChevronDown, ChevronUp, Rocket, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const StudentModuleComment = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState([
    {
      id: "1",
      author: {
        name: "Student One",
        avatar: "/placeholder-user.jpg",
      },
      content: "I'm not sure if I did this like you wanted.",
      timestamp: "Sep 2, 2019",
    },
    {
      id: "2",
      author: {
        name: "Kasey Bell",
        avatar: "/placeholder-user.jpg",
        isInstructor: true,
      },
      content: "Looks good, but you forgot to add the credits. Please revise and turn in.",
      timestamp: "Sep 2, 2019",
    },
  ])

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment = {
      id: `${comments.length + 1}`,
      author: {
        name: "You",
        avatar: "/placeholder-user.jpg",
      },
      content: commentText,
      timestamp: "Just now",
    }

    setComments([...comments, newComment])
    setCommentText("")
  }

  return (
    <Card className={`border-none  mt-6 bg-[#f0f4ff] overflow-hidden ${className}`}>
      <CardHeader
        className="pb-3 cursor-pointer flex flex-row items-center justify-between bg-indigo-500 text-white"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="text-base font-semibold">Comments ({comments.length})</h3>
        </div>
        {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="pt-4 relative">
          {/* Decorative space elements */}
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <div
              className="w-40 h-40 bg-contain bg-no-repeat bg-right-top"
              style={{ backgroundImage: "url('/stars-pattern.svg')" }}
            ></div>
          </div>

          <div className="space-y-4">
            {/* Comments list */}
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 pb-4 relative">
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                    <AvatarFallback
                      className={comment.author.isInstructor ? "bg-purple-100 text-purple-600" : "bg-gray-100"}
                    >
                      {comment.author.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {comment.author.isInstructor && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <Rocket className="h-3 w-3 text-purple-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`font-medium ${comment.author.isInstructor ? "text-purple-600" : "text-gray-700"}`}
                      >
                        {comment.author.name}
                        {comment.author.isInstructor && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                            Instructor
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Comment input */}
            <form onSubmit={handleAddComment} className="flex gap-3 items-center pt-3 border-t border-purple-100">
              <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder-user.jpg" alt="Your avatar" />
                <AvatarFallback className="bg-purple-100 text-purple-600">YOU</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  className="flex-1 bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-500 rounded-full"
                  placeholder="Add comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4">
                  Post
                </Button>
              </div>
            </form>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-2 left-2 text-purple-200 opacity-10">
            <Star className="h-6 w-6 fill-purple-200" />
          </div>
          <div className="absolute top-10 right-10 text-purple-200 opacity-10">
            <Star className="h-4 w-4 fill-purple-200" />
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default StudentModuleComment











