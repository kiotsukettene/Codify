import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ScoreInput from "@/components/ui/ScoreInput";

import { useActivityStore } from "@/store/activityStore";

const ActivityOutput = ({ students }) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [comments, setComments] = useState({});
  const [submittingComment, setSubmittingComment] = useState(null);
  const [scores, setScores] = useState({});
  const { updateSubmission } = useActivityStore(); // Add this

  const selectedStudents = students.filter((student) =>
    selectedStudentIds.includes(student.id)
  );

  const handleStudentSelection = (studentId) => {
    setSelectedStudentIds((prev) => {
      if (studentId === "1") {
        return prev.length === students.length - 1
          ? []
          : students.slice(1).map((s) => s.id);
      }
      return prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId];
    });
  };

  const handleCommentChange = (studentId, comment) => {
    setComments((prev) => ({
      ...prev,
      [studentId]: comment,
    }));
  };

  const handleSubmitComment = async (studentId) => {
    if (!comments[studentId]?.trim()) return;

    setSubmittingComment(studentId);
    try {
      const student = students.find((s) => s.id === studentId);
      const submission = student.submission; // Assume submission object is passed in students
      if (submission) {
        await updateSubmission(submission._id, {
          comment: comments[studentId],
        });
        setComments((prev) => ({ ...prev, [studentId]: "" }));
      }
    } finally {
      setSubmittingComment(null);
    }
  };

  const handleScoreChange = async (studentId, value) => {
    const score = Math.min(Math.max(0, Number(value) || 0), 100);
    setScores((prev) => ({
      ...prev,
      [studentId]: score,
    }));

    // Save to backend
    try {
      const student = students.find((s) => s.id === studentId);
      const submission = student.submission;
      if (submission) {
        await updateSubmission(submission._id, { score });
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <Card>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="space-y-4"
          >
            <h2 className="font-semibold text-lg pt-8">Students</h2>
            <div className="space-y-2">
              {students.map((student) => (
                <motion.div
                  key={student.id}
                  className={`flex items-center space-x-4 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors duration-200 ${
                    selectedStudentIds.includes(student.id) ? "bg-accent" : ""
                  }`}
                  onClick={() => handleStudentSelection(student.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Checkbox
                    checked={selectedStudentIds.includes(student.id)}
                    onCheckedChange={() => handleStudentSelection(student.id)}
                  />
                  <span className="flex-1">{student.name}</span>
                  <ScoreInput
                    studentId={student.id}
                    value={scores[student.id] ?? student.score}
                    onChange={handleScoreChange}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="border-l pl-6 col-span-2">
            <AnimatePresence mode="wait">
              {selectedStudents.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-[400px] items-center justify-center text-muted-foreground"
                >
                  Select student to view
                </motion.div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {selectedStudents.map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {index > 0 && <Separator className="my-8" />}
                        <div className="space-y-6 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={student.avatar} />
                                <AvatarFallback>
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">
                                  {student.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {student.submitted
                                    ? `submitted ${student.submitted}`
                                    : "Not submitted"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {student.score > 0 && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700"
                                >
                                  Graded
                                </Badge>
                              )}
                              <div className="flex flex-col items-end gap-1">
                                <motion.div
                                  initial={{ scale: 0.95 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                  }}
                                >
                                  <ScoreInput
                                    studentId={student.id}
                                    value={scores[student.id] ?? student.score}
                                    onChange={handleScoreChange}
                                  />
                                </motion.div>
                                {scores[student.id] >= 90 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-green-600 font-medium"
                                  >
                                    Excellent! 🌟
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">
                              Private comment:
                            </h4>
                            {student.comment && (
                              <div className="rounded-lg bg-muted p-3">
                                <p className="text-sm">{student.comment}</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add private comment..."
                                value={comments[student.id] || ""}
                                onChange={(e) =>
                                  handleCommentChange(
                                    student.id,
                                    e.target.value
                                  )
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handlelogeSubmitComment(student.id);
                                  }
                                }}
                              />
                              <Button
                                size="icon"
                                variant="secondary"
                                onClick={() => handleSubmitComment(student.id)}
                                disabled={submittingComment === student.id}
                              >
                                <Send
                                  className={`h-4 w-4 ${
                                    submittingComment === student.id
                                      ? "animate-pulse"
                                      : ""
                                  }`}
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </ScrollArea>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivityOutput;
