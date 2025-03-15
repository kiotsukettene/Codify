import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Crown, Search } from "lucide-react";
import lion from "@/assets/picture/Avatar/lion.png";

const StudentTab = ({ studentList = [], activities = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(
    studentList.length > 0 ? studentList[0] : null
  );

  const filteredStudents = studentList.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-[350px,1fr] gap-6">
        {/* Student List with Search */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Card>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <button
                  key={student.id}
                  className={`w-full flex items-center gap-3 p-4 transition-colors duration-200 hover:bg-gray-100 ${
                    selectedStudent && selectedStudent.id === student.id
                      ? "bg-gray-50"
                      : ""
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <Avatar>
                    <AvatarImage src={lion} />
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-left">{student.name}</span>
                  {student.crown === "gold" && (
                    <Crown className="text-yellow-500" />
                  )}
                  {student.crown === "silver" && (
                    <Crown className="text-gray-500" />
                  )}
                </button>
              ))
            ) : (
              <p className="text-center text-gray-500 p-4">No students found</p>
            )}
          </Card>
        </div>

        {/* Selected Student Details */}
        {selectedStudent ? (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-16 w-16">
                <AvatarImage src={lion} />
                <AvatarFallback>{selectedStudent.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">
                    {selectedStudent.name}
                  </h2>
                  {selectedStudent.crown === "gold" && (
                    <Crown className="text-yellow-500" />
                  )}
                  {selectedStudent.rank === 1 && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    >
                      Rank 1
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <p>Student no.: {selectedStudent.studentNo}</p>
                  <p>Email: {selectedStudent.email}</p>
                </div>
                <p className="mt-2">
                  Overall Grade: {selectedStudent.grade?.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Student Activities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Activities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-lg overflow-hidden"
                    >
                      <div className="bg-white p-6 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-gray-800">
                            Mission: {activity.id} {activity.title}
                          </h3>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              activity.grade >= 90
                                ? "bg-green-100 text-green-800"
                                : activity.grade >= 70
                                ? "bg-blue-100 text-blue-800"
                                : activity.grade >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {activity.grade}/100
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm">
                          {activity.description}
                        </p>
                        <div className="items-center mt-4">
                          <span className="text-sm text-gray-500">
                            Due: {activity.dueDate}
                          </span>
                          <button
                            className="px-2 py-2 text-sm mt-2 bg-blue-500 text-white rounded-lg transform transition-transform duration-200 hover:scale-105 hover:bg-blue-600 focus:outline-none"
                            onClick={() => handleActivityClick(activity)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No activities available</p>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <p className="text-center text-gray-500">
            Select a student to view details
          </p>
        )}
      </div>
    </div>
  );
};

const handleActivityClick = (activity) => {
  console.log("Activity clicked:", activity);
};

export default StudentTab;
