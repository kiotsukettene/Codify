// import React from "react";
// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MoreVertical, Calendar, Upload, FileText, X } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import GamifiedToast from "@/components/student-view/gamified-success-toast";
// import { ToastProvider, ToastViewport } from "@/components/ui/toast";

// function StudentActivityPage() {

//   const [open, setOpen] = useState(false); // Gamified Toast
//   const [files, setFiles] = useState([
//     {
//       name: "File Title.pdf",
//       size: "313 KB",
//       date: "24 Oct, 2024",
//       progress: 45,
//     },
//   ]);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setFiles([
//         ...files,
//         {
//           name: file.name,
//           size: `${Math.round(file.size / 1024)} KB`,
//           date: new Date().toLocaleDateString(),
//           progress: 100,
//         },
//       ]);
//     }
//   };

//   const removeFile = (index) => {
//     const newFiles = [...files];
//     newFiles.splice(index, 1);
//     setFiles(newFiles);
//   };

//   return (
//     <div>
//       <div className="container mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Instructions and Upload */}
//           <div className="lg:col-span-2 space-y-8">

//          {/*======================= Instruction Section================================*/}

//             <div className="space-y-6">
//               <h2 className="text-xl font-semibold">Instructions</h2>
//               <p className="text-gray-600">
//                 In this final project, you will develop a full-stack web
//                 application that demonstrates your understanding of modern web
//                 development principles and practices.
//               </p>

//               <div className="space-y-2">
//                 <h3 className="font-medium">Learning Objectives:</h3>
//                 <ul className="list-disc list-inside space-y-1 text-gray-600">
//                   <li>
//                     Implement secure user authentication and authorization
//                   </li>
//                   <li>Design and develop RESTful APIs</li>
//                   <li>Create responsive and accessible user interfaces</li>
//                   <li>Deploy and manage web applications in the cloud</li>
//                 </ul>
//               </div>

//               <div className="space-y-2">
//                 <h3 className="font-medium">Submission Requirements</h3>
//                 <ul className="list-disc list-inside space-y-1 text-gray-600">
//                   <li>Source code repository (GitHub link)</li>
//                   <li>Technical documentation (PDF, max 10MB)</li>
//                   <li>Deployment URL</li>
//                   <li>Presentation slides (PPT/PPTX, max 20MB)</li>
//                 </ul>
//               </div>
//             </div>

//             {/*======================= UPLOAD FILE SECTION================================*/}

//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold">Upload Files</h2>

//               <div
//                 className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
//                 onClick={() => document.getElementById("fileInput").click()}
//               >
//                 <input
//                   type="file"
//                   id="fileInput"
//                   className="hidden"
//                   onChange={handleFileUpload}
//                 />
//                 <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                 <p className="mt-2 text-sm text-gray-500">
//                   Click to upload or drag and drop
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   PDF, PPTX, ZIP (max. 20MB)
//                 </p>
//               </div>

//              {/*======================= FILES LIST================================*/}

//               <div className="space-y-3">
//                 {files.map((file, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <FileText className="h-5 w-5 text-gray-400" />
//                       <div>
//                         <p className="text-sm font-medium">{file.name}</p>
//                         <p className="text-xs text-gray-500">
//                           {file.size} - {file.date}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       {file.progress < 100 && (
//                         <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-purple-600 rounded-full"
//                             style={{ width: `${file.progress}%` }}
//                           />
//                         </div>
//                       )}
//                       <button onClick={() => removeFile(index)}>
//                         <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="space-y-6 bg-white p-4">

//           {/*======================= DUE DATE SECTION================================*/}

//             <Card className="p-6 bg-purple-50 shadow-none border-none rounded-lg">
//               <h2 className="text-lg font-semibold mb-4">Important Dates</h2>
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-3">
//                   <Calendar className="h-5 w-5 text-gray-400" />
//                   <div>
//                     <p className="text-sm text-gray-500">Release Date</p>
//                     <p className="text-sm font-medium">April 1, 2024</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <Calendar className="h-5 w-5 text-gray-400" />
//                   <div>
//                     <p className="text-sm text-gray-500">Due Date</p>
//                     <p className="text-sm font-medium">April 9, 2024 6:30 PM</p>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//            {/*======================= RESOURCES FILES================================*/}

//             <div className="grid grid-cols-2 gap-4">
//               {["Activity Guidelines", "Documentation"].map((title, index) => (
//                 <Card
//                   key={index}
//                   className={`p-4 ${
//                     index === 0
//                       ? "bg-red-50 shadow-none"
//                       : "bg-yellow-50 shadow-none"
//                   } border-none shadow-none`}
//                 >
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <FileText
//                         className={`h-8 w-8 ${
//                           index === 0 ? "text-red-400" : "text-yellow-400"
//                         }`}
//                       />
//                       <h3 className="text-sm font-medium mt-2">{title}</h3>
//                       <p className="text-xs text-gray-500">December 1, 2024</p>
//                     </div>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger>
//                         <MoreVertical className="h-5 w-5 text-gray-400" />
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent>
//                         <DropdownMenuItem>Download</DropdownMenuItem>
//                         <DropdownMenuItem>Share</DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </Card>
//               ))}
//             </div>

//             {/*======================= Submit Button with Gamified Toast ================================*/}
//             <ToastProvider>
//               <Button
//                 onClick={() => setOpen(true)}
//                 className=" text-white w-full "
//               >
//                 Submit
//               </Button>

//               <GamifiedToast
//                 open={open}
//                 onOpenChange={setOpen}
//                 title="Success!"
//                 description="Your activity has been submitted."
//               />

//               <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full md:max-w-[420px]" />
//             </ToastProvider>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StudentActivityPage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityStore } from "../../../store/activityStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Calendar, Upload, FileText, X, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GamifiedToast from "@/components/student-view/gamified-success-toast";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import Lion from "@/assets/picture/Avatar/Lion.png"


const initialComments = [
  { id: 4, author: "Catherine Bae", message: "I have a question about the else if statement.", avatar: Lion },
];


function StudentActivityPage() {

  const { activitySlug } = useParams();
  const {
    activity,
    submission,
    fetchActivityBySlug,
    fetchSubmission,
    submitActivity,
    unsubmitActivity,
    isLoading,
    error,
  } = useActivityStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false); // Gamified Toast
  const [files, setFiles] = useState([]); // Files to upload
  const [errorMessage, setErrorMessage] = useState(""); // Error message for file validation
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");


  const handleAddComment = (e) => {
      e.preventDefault();
      if (!newComment.trim()) return;
    
      const newCommentObj = {
        id: comments.length + 1,
        author: "Professor Name", // You should get this from your auth context
        message: newComment,
        avatar: Lion, // You might want to use professor's avatar
        isProfessor: true,
      };
    
      setComments([...comments, newCommentObj]);
      setNewComment("");
    };




  useEffect(() => {
    if (activitySlug) {
      fetchActivityBySlug(activitySlug).then(() => {
        if (activity?._id) {
          fetchSubmission(activity._id); // Fetch submission after activity loads
        }
      });
    }
  }, [activitySlug, fetchActivityBySlug, fetchSubmission, activity?._id]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setErrorMessage(""); // Clear previous error message

    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    // Check file size (20MB = 20 * 1024 * 1024 bytes)
    const maxSizeInBytes = 20 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrorMessage(
        `File size exceeds 20MB limit. Selected file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB.`
      );
      event.target.value = ""; // Clear the file input
      return;
    }

    // If file passes validation, add it to the files list
    setFiles([
      ...files,
      {
        file, // Store the actual File object
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        date: new Date().toLocaleDateString(),
        progress: 100,
      },
    ]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    setErrorMessage(""); // Clear error message when removing a file
  };

  const handleSubmit = async () => {
    if (!files.length) {
      setErrorMessage("Please upload at least one file before submitting.");
      return;
    }

    const fileToSubmit = files[0].file;
    const submitted = await submitActivity(activity._id, fileToSubmit);

    if (submitted) {
      setOpen(true); // Toast appears for submit
      setFiles([]);
      setErrorMessage("");
      await fetchSubmission(activity._id); // Re-fetch submission to update UI
    }
  };

  const handleUnsubmit = async () => {
    const unsubmitted = await unsubmitActivity(activity._id);
    if (unsubmitted) {
      await fetchSubmission(activity._id); // Re-fetch submission to update UI
      // Explicitly ensure toast does not appear
      setOpen(false); // Reset toast state
    }
  };

  const isSubmitted = submission && submission.status === "submitted";

  if (isLoading) return <div>Loading activity details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!activity) return <div>No activity found</div>;

  return (
    <div className="min-h-screen w-full py-10">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Instructions and Upload */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">{activity.title}</h2>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Files</h2>
              {isSubmitted && submission.file ? (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          {submission.file.split("/").pop()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted on{" "}
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(submission.file, "_blank")}
                    >
                      View PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.pptx,.zip"
                    />
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, PPTX, ZIP (max. 20MB)
                    </p>
                  </div>

                  {errorMessage && (
                    <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">
                      ⚠️ {errorMessage}
                    </p>
                  )}

                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.size} - {file.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {file.progress < 100 && (
                            <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          )}
                          <button onClick={() => removeFile(index)}>
                            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6 bg-white p-4">
            <Card className="p-6 bg-purple-50 shadow-none border-none rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Important Dates</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Release Date</p>
                    <p className="text-sm font-medium">
                      {activity.createdAt
                        ? new Date(activity.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="text-sm font-medium">
                      {activity.dueDate
                        ? new Date(activity.dueDate).toLocaleString()
                        : "No Due Date"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {activity.file ? (
                <Card className="p-4 bg-red-50 shadow-none border-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <FileText className="h-8 w-8 text-red-400" />
                      <h3 className="text-sm font-medium mt-2">
                        Activity File
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => window.open(activity.file, "_blank")}
                        >
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ) : (
                <p>No resources available</p>
              )}
            </div>


            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 max-h-80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-600">
                  <MessageSquare className="h-5 w-5" />
                  <h3 className="font-semibold">Private Comment</h3>
                </div>
              </div>
              <div className="space-y-4">
                {comments.slice(-2).map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback>{comment.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{comment.author}</div>
                      <p className="text-xs text-gray-600">{comment.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-4">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                  placeholder="Type your reply..."
                />
                <Button type="submit" size="sm">
                  Send
                </Button>
              </form>
            </div>
            </CardContent>
          </Card>

            <ToastProvider>
              <Button
                onClick={isSubmitted ? handleUnsubmit : handleSubmit}
                className="text-white w-full"
                disabled={isLoading || (!isSubmitted && !files.length)}
              >
                {isSubmitted ? "Unsubmit" : "Submit"}
              </Button>
              <GamifiedToast
                open={open}
                onOpenChange={setOpen}
                title="Success!"
                description="Your activity has been submitted."
              />
              <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full md:max-w-[420px]" />
            </ToastProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentActivityPage;
