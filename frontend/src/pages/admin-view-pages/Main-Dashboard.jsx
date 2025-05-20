import { Download, Users, UserPlus, GraduationCap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useStudentStore } from "@/store/studentStore";
import { useprofAuthStore } from "@/store/profAuthStore";
import { useEffect } from "react";
import { useCourseStore } from "@/store/courseStore";


const AdminDashboard = () => {
  // Placeholder data - would be fetched from your backend in a real application
  const getTotalStudents = useStudentStore((state) => state.getTotalStudents);
  const fetchStudents = useStudentStore((state) => state.fetchStudents);
  const getTotalProf = useprofAuthStore((state) => state.getTotalProf);
  const fetchProfessors = useprofAuthStore((state) => state.fetchProfessors); 
  const getTotalCourse = useCourseStore((state) => state.getTotalCourse);
  const fetchCoursesByInstitution = useCourseStore((state) => state.fetchCoursesByInstitution); 


  useEffect(() => {
    fetchStudents();
    fetchProfessors();
    fetchCoursesByInstitution()
  }, [fetchStudents, fetchProfessors, fetchCoursesByInstitution]);

const stats = {
    totalStudents: getTotalStudents(),
    totalProfessors: getTotalProf(),
    totalUsers: getTotalStudents() + getTotalProf(), 
    totalCourses: getTotalCourse(),
  };
  


  // Placeholder for registration date
  const registrationDate = new Date("2023-09-15").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="bg-gray-50 dark:bg-gray-900 overflow-auto p-6 w-full">
      <div className="py-8 h-full flex flex-col">
        <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: "easeOut" }}   
        className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
        </motion.div>

        {/* Main Stats Section */}
        <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <Card className="border transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                  <h3 className="text-4xl font-bold mt-3">{stats.totalStudents.toLocaleString()}</h3>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
                  <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-500 dark:text-gray-400">Total Professors</p>
                  <h3 className="text-4xl font-bold mt-3">{stats.totalProfessors.toLocaleString()}</h3>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-500 dark:text-gray-400">Total Users </p>
                  <h3 className="text-4xl font-bold mt-3">{stats.totalUsers.toLocaleString()}</h3>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                  <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
                  <h3 className="text-4xl font-bold mt-3">{stats.totalCourses.toLocaleString()}</h3>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900 p-4 rounded-full">
                  <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription & Billing Section */}
        <motion.Card 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 9, y: 0}}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="border-none flex-grow mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Subscription & Billing</CardTitle>
            <CardDescription className="text-sm">
              Your current subscription details and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3">Activated</h3>
                <p className="text-lg font-semibold">{registrationDate}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3">Plan Type</h3>
                <p className="text-base font-semibold">One-Time License (Institutional Use)</p>
              </div>
              {/* <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3">Invoice</h3>
                <Button variant="outline" size="lg" className="mt-2">
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF
                </Button>
              </div> */}
            </div>
          </CardContent>
        </motion.Card>
      </div>
    </div>
  )
}

export default AdminDashboard