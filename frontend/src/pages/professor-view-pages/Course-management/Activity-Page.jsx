import React, { useState, useEffect } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/Components/ui/separator";
import AppSidebar from "@/components/professor-view/Sidebar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import ActivityOverview from "@/components/professor-view/Activity-Overview";
import ActivityOutput from "@/components/professor-view/Activity-Output";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Bear from "@/assets/picture/Avatar/bear.png";
import { useActivityStore } from "@/store/activityStore";

const ActivityPage = () => {
  const { activityId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { activity, fetchActivityById } = useActivityStore();

  useEffect(() => {
    console.log("activityId from useParams:", activityId);
    if (activityId) {
      fetchActivityById(activityId);
    } else {
      console.error("activityId is undefined or null");
    }
  }, [activityId, fetchActivityById]);

  const students = [
    { id: "1", name: "All students", score: 0 },
    { id: "2", name: "Dela Cruz, Momo W.", score: 0, avatar: Bear },
    {
      id: "3",
      name: "Antang, JunMar H.",
      score: 100,
      submitted: "11:58 PM",
      avatar: Bear,
      comment: "Ma'am sorry, namail ng pasa po kanina",
    },
    { id: "4", name: "Dela Cruz, Momo W.", score: 0, avatar: Bear },
    { id: "5", name: "Caps, Elle B.", score: 0, avatar: Bear },
  ];
  if (!activity) {
    return <p>Loading activity...</p>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1">
        <SidebarInset className="flex-1 !p-0">
          <header className="flex h-16 items-center px-4">
            <SidebarTrigger
              className="-ml-1"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <Separator orientation="vertical" className="mx-2 h-4" />
          </header>

          <div className="w-full px-10">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <h1 className="text-xl font-semibold">{activity?.title}</h1>
              </div>
              {/* Right Section: Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuContent align="end" className="py-1 text-red-600">
                  <DropdownMenuItem className="hover:bg-gray-100 transition-colors duration-200">
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100 transition-colors duration-200">
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

            {/* Render the correct tab content */}
            {activeTab === "overview" ? (
              <ActivityOverview
                activityId={activity._id}
                dueDate={
                  activity?.dueDate
                    ? new Date(activity.dueDate).toLocaleString()
                    : "No due date"
                }
                points={activity?.points || 0}
                instructions={
                  Array.isArray(activity?.instructions)
                    ? activity.instructions
                    : [activity?.instructions || "No instructions available"]
                }
              />
            ) : (
              <div>
                <h2>Student Activity Output</h2>
                {/* ✅ Pass students as a prop */}
                <ActivityOutput students={students} />
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ActivityPage;
