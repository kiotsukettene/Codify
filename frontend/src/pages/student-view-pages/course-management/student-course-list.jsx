import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import header from "@/assets/picture/courses/course-header.png";
import { Separator } from "@/components/ui/separator";
import { BookOpenCheck, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/student-view/SearchForm";
import { Input } from "@/components/ui/input";

function StudentCourseListPage() {

  const courses = [
    {
      id: 1,
      title: "Networks and Communication",
      professor: "Prof. Dave Benjamin Cruz",
      lessons: 18,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QEcFyafQUxR28nGJ9GvBdRdoMYgThs.png",
      tags: ["Networking"],
    },
    {
      id: 2,
      title: "Creating Awesome Mobile Apps",
      professor: "Prof. Joemen D. Barrios",
      lessons: 2,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QEcFyafQUxR28nGJ9GvBdRdoMYgThs.png",
      tags: ["Profitable", "AI"],
    },
    // Duplicate the second course 6 more times to fill the grid
    ...Array(6).fill({
      id: Math.random(),
      title: "Creating Awesome Mobile Apps",
      professor: "Prof. Joemen D. Barrios",
      lessons: 2,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QEcFyafQUxR28nGJ9GvBdRdoMYgThs.png",
      tags: ["Profitable", "AI"],
    }),
  ]

  return (
    <div className="mx-6 w-full">
      <Card className="h-[272px] w-full bg-[#ededff]  shadow-none border-none flex justify-between relative overflow-hidden rounded-xl">
        {/* Left Content */}
        <div className="z-10 p-8">
          <CardHeader className="text-header text-3xl font-semibold">
            Hi, Momo Ready to Learn?
            <span className="text-base font-normal mt-1">
              Continue your learning journey. Let’s go!
            </span>
          </CardHeader>

          <CardContent className="flex gap-4 mt-4 text-header font-medium">
            <BookOpenCheck />
            <h4>20 Lessons</h4>
            <Separator orientation="vertical" />
            <Users />
            <h4>Prof. Dave Benjamin Cruz</h4>
          </CardContent>
          <CardFooter>
            <Button>Start Learning 🚀</Button>
          </CardFooter>
        </div>

        {/* Right Content - Image Wrapper */}
        <div className="relative w-[50%] h-full ml-auto">
          <img
            src={header}
            alt=""
            className="absolute top-0 right-0 w-auto h-full object-cover"
          />
        </div>
      </Card>


      <div className="flex px-8 text-center justify-between items-center">
        <h1 className="text-header font-semibold text-2xl">My Courses</h1>
        <SearchForm/>
      </div>
    </div>

  );
}

export default StudentCourseListPage;
