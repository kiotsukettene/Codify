import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import ActivityOverview from "@/components/professor-view/Activity-Overview";
import ActivityOutput from "@/components/professor-view/Activity-Output";
import { useActivityStore } from "@/store/activityStore";
import { useCourseStore } from "@/store/courseStore";

const ActivityPage = () => {
  const { courseSlug, lessonSlug, activitySlug } = useParams();
  const {
    activity,
    fetchActivityBySlug,
    submissions,
    fetchSubmissionsByActivity,
    isLoading: isActivityLoading,
    error: activityError,
  } = useActivityStore();
  const {
    course,
    fetchCourseBySlug,
    isLoading: isCourseLoading,
    error: courseError,
  } = useCourseStore();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Fetch activity
  useEffect(() => {
    if (activitySlug) {
      fetchActivityBySlug(activitySlug);
    }
  }, [activitySlug, fetchActivityBySlug]);

  //fetch course
  useEffect(() => {
    if (courseSlug) {
      fetchCourseBySlug(courseSlug);
    }
  }, [courseSlug, fetchCourseBySlug]);

  if (isActivityLoading || isCourseLoading) return <p>Loading...</p>;
  if (activityError)
    return <p className="text-red-500">Activity Error: {activityError}</p>;
  if (courseError)
    return <p className="text-red-500">Course Error: {courseError}</p>;
  if (!activity) return <p>No activity found</p>;
  if (!course) return <p>No course found</p>;

  // Merge studentsEnrolled with submissions
  const students =
    course.studentsEnrolled.map((student) => {
      const submission = submissions.find(
        (sub) => sub.studentId._id.toString() === student._id.toString()
      );
      return {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        avatar: student.avatar || "",
        submitted: submission
          ? new Date(submission.createdAt).toLocaleString()
          : "",
        score: submission ? submission.score : 0,
        comment: submission ? submission.comment : "",
        file: submission && submission.file ? submission.file : null,
        submission: submission || null,
      };
    }) || [];

  return (
    <div className="w-full px-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate(`/professor/course/${courseSlug}/lesson/${lessonSlug}`)
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{activity.title}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-8">
          {["overview", "Student Output"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-2 relative transition-colors",
                activeTab === tab
                  ? "text-purple-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <ActivityOverview
          fileName={activity.file}
          activityId={activity._id}
          dueDate={
            activity.dueDate
              ? new Date(activity.dueDate).toLocaleString()
              : "No due date"
          }
          points={activity.points || 0}
          instructions={
            Array.isArray(activity.instructions)
              ? activity.instructions
              : [activity.instructions || "No instructions available"]
          }
        />
      ) : (
        <div>
          <h2>Student Activity Output</h2>
          <ActivityOutput students={students} activityId={activity._id} />
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
