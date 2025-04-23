import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Download } from "lucide-react";
import { useActivityStore } from "@/store/activityStore";
import toast from "react-hot-toast";

const ActivityOutput = ({ students = [], refetchSubmissions }) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [comments, setComments] = useState({});
  const [submittingComment, setSubmittingComment] = useState(null);
  const [tempScores, setTempScores] = useState({});
  const [isGrading, setIsGrading] = useState(null);
  const { updateSubmission } = useActivityStore();

  console.log("ActivityOutput students:", students);

  const selectedStudents = students.filter((student) =>
    selectedStudentIds.includes(student.id)
  );

  const handleStudentSelection = (studentId) => {
    console.log("Selecting student ID:", studentId);
    setSelectedStudentIds((prev) => {
      if (studentId === "all") {
        return prev.length === students.length ? [] : students.map((s) => s.id);
      }
      return prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId];
    });
  };

  const handleCommentChange = (studentId, comment) => {
    console.log(
      "Comment changed for student ID:",
      studentId,
      "Comment:",
      comment
    );
    setComments((prev) => ({
      ...prev,
      [studentId]: comment,
    }));
  };

  const handleSubmitComment = async (studentId) => {
    if (!comments[studentId]?.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    console.log("Submitting comment for student ID:", studentId);
    setSubmittingComment(studentId);
    try {
      const student = students.find((s) => s.id === studentId);
      const submission = student?.submission;
      if (submission?._id) {
        await updateSubmission(submission._id, {
          comment: comments[studentId],
        });
        console.log(
          "Comment submitted successfully for student ID:",
          studentId
        );
        setComments((prev) => ({ ...prev, [studentId]: "" }));
        await refetchSubmissions();
        console.log("Submissions refetched after comment update");
        toast.success("Comment added successfully!");
      } else {
        throw new Error("No submission found for student");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error(error.message || "Failed to add comment");
    } finally {
      setSubmittingComment(null);
    }
  };

  const handleTempScoreChange = (studentId, value) => {
    const score = Math.min(Math.max(0, Number(value) || 0), 100);
    console.log("Score changed for student ID:", studentId, "Score:", score);
    setTempScores((prev) => ({
      ...prev,
      [studentId]: score,
    }));
  };

  const handleGrade = async (studentId) => {
    console.log("Grading student ID:", studentId);
    setIsGrading(studentId);
    try {
      const student = students.find((s) => s.id === studentId);
      const submission = student?.submission;
      if (!submission?._id) {
        throw new Error("No submission found for student");
      }

      const newScore =
        tempScores[studentId] !== undefined
          ? tempScores[studentId]
          : student.score;
      if (newScore === student.score) {
        console.log("No score change detected for student ID:", studentId);
        return;
      }

      console.log(
        "Updating score for submission ID:",
        submission._id,
        "New score:",
        newScore
      );
      await updateSubmission(submission._id, { score: newScore });
      console.log("Score updated successfully for student ID:", studentId);

      // Clear the temporary score
      setTempScores((prev) => {
        const updated = { ...prev };
        delete updated[studentId];
        return updated;
      });

      // Refetch submissions to update the UI
      await refetchSubmissions();
      console.log("Submissions refetched after score update");

      toast.success("Score updated successfully!");
    } catch (error) {
      console.error("Error updating score:", error);
      toast.error(error.message || "Failed to update score");
    } finally {
      setIsGrading(null);
    }
  };

  if (!Array.isArray(students) || !students.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4 text-center text-muted-foreground"
      >
        No students enrolled or submissions found.
      </motion.div>
    );
  }

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
              <motion.div
                className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors duration-200"
                onClick={() => handleStudentSelection("all")}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Checkbox
                  checked={selectedStudentIds.length === students.length}
                  onCheckedChange={() => handleStudentSelection("all")}
                />
                <span className="flex-1 font-medium">All Students</span>
              </motion.div>

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
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="border-l pl-6 col-span-2">
            <AnimatePresence mode="wait">
              {selectedStudentIds.length === 0 ? (
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
                                {student.file ? (
                                  <a
                                    href={student.file}
                                    download
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <Download className="h-4 w-4" />
                                    Download Submission
                                  </a>
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    No file submitted
                                  </p>
                                )}
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
                                {selectedStudentIds.length ===
                                students.length ? (
                                  <span className="text-sm font-medium">
                                    {student.score}/100
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={
                                        tempScores[student.id] !== undefined
                                          ? tempScores[student.id]
                                          : student.score
                                      }
                                      onChange={(e) =>
                                        handleTempScoreChange(
                                          student.id,
                                          e.target.value
                                        )
                                      }
                                      className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      placeholder="Score"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleGrade(student.id)}
                                      disabled={isGrading === student.id}
                                    >
                                      {isGrading === student.id
                                        ? "Grading..."
                                        : "Grade"}
                                    </Button>
                                  </div>
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
                                    handleSubmitComment(student.id);
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
