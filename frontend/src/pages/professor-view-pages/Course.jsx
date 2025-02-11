import React, { useState } from 'react';
import Card from '../../components/professor-view/CardCourse';
// import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/Components/ui/sidebar';
import { Plus } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/Components/ui/pagination';
// import AppSidebar from '@/components/professor-view/Sidebar';
import { Separator } from '@/Components/ui/separator';

const Courses = () => {
  const courses = [
    { lessonCount: 6, languages: ['Javascript'], title: "Software Engineering", courseCode: "CS003", section: "BSCS 3A" },
    { lessonCount: 8, languages: ['Python'], title: "Data Structures", courseCode: "CS004", section: "BSCS 3B" },
    { lessonCount: 8, languages: ['Python'], title: "Data Structures", courseCode: "CS004", section: "BSCS 3B" },
    { lessonCount: 8, languages: ['Python'], title: "Data Structures", courseCode: "CS004", section: "BSCS 3B" },
    { lessonCount: 8, languages: ['Python'], title: "Data Structures", courseCode: "CS004", section: "BSCS 3B" },
    { lessonCount: 8, languages: ['Python'], title: "Data Structures", courseCode: "CS004", section: "BSCS 3B" },
    { lessonCount: 8, languages: ['Python'], title: "Data Structures", courseCode: "CS004", section: "BSCS 3B" },
    { lessonCount: 8, languages: ['Python'], title: "Data Structures", courseCode: "CS004", section: "BSCS 3B" },
    { lessonCount: 8, languages: ['Python'], title: "Data Structures", courseCode: "CS004", section: "BSCS 3B" }
    
  ];

  // Pagination state
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const [selectedLanguage, setSelectedLanguage] = useState([]); 

  // Add this state to track sidebar status
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleLanguage = (language) => {
    setSelectedLanguage((prevSelectedLanguages) => {
      if (prevSelectedLanguages.includes(language)) {
        return prevSelectedLanguages.filter((item) => item !== language);
      } else {
        return [...prevSelectedLanguages, language];
      }
    });
  };

  const filteredCourses = selectedLanguage.length > 0
  ? courses.filter(course => course.languages.some(lang => selectedLanguage.includes(lang)))
  : courses;

  const currentCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const languageColors = {
    "Javascript": { bg: 'bg-yellow-100', text: 'text-yellow-700'},
    "Python": { bg: 'bg-blue-100', text: 'text-blue-700' },
    "C#": { bg: 'bg-green-100', text: 'text-green-700' },  
    "AI": { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    "CSS": { bg: 'bg-pink-100', text: 'text-pink-700' },
    "HTML": { bg: 'bg-red-100', text: 'text-red-700' },
    "C++": { bg: 'bg-purple-100', text: 'text-purple-700' },
};


  return (
    // <SidebarProvider>
    //   <AppSidebar />
    //   <div className="flex mx-2 sm:mx-4 md:mx-7 transition-all duration-300">
    //     <SidebarInset className="flex-1">
    //       <header className="flex h-20 shrink-0 items-center gap-2 px-4">
    //         <SidebarTrigger 
    //           className="-ml-1"   
    //           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    //         />
    //         <Separator orientation="vertical" className="mr-2 h-4" />
    //       </header>



        
          <div className="flex bg-white min-h-screen ml-7">
            <div className="w-full p-4 sm:p-6">
              
              {/* Fixed header section */}
              <div className="bg-white pb-4 ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex justify-between items-center w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-purple-700">Course</h1>
                    <Button className="bg-purple-700 hover:bg-purple-800 sm:hidden">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Filter Tags */}
                <div className="flex items-center justify-between w-full flex-wrap gap-2">
                  <div className='flex flex-wrap gap-2'>
                  {["C#", "AI", "CSS", "Javascript", "Python", "HTML", "C++"].map((tag, index) => (
                    <Button
                      key={index}
                      className={`${
                        selectedLanguage.includes(tag) 
                          ? `${languageColors[tag]?.bg} ${languageColors[tag]?.text} border border-purple-700`
                          : `${languageColors[tag]?.bg} ${languageColors[tag]?.text} hover:text-white` 
                      } px-2 sm:px-3 py-1 text-xs whitespace-nowrap rounded-full`}
                      onClick={() => toggleLanguage(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                  </div>

                  <div className='ml-auto'>
                  <Button className="bg-purple-700 hover:bg-purple-800">
                    <Plus className="w-4 h-4 mr-2" /> Create Course
                  </Button>
                  </div>
                    </div>
                    </div>

              {/* Courses Grid */}
              <div className={`grid place-items-center sm:place-items-start gap-11 sm:gap-20 mt-6 transition-all duration-300 
  ${isSidebarOpen ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"}`}>
  {currentCourses.map((course, index) => (
    <Card 
      key={index}
      lessonCount={course.lessonCount}
      languages={course.languages}
      title={course.title}
      courseCode={course.courseCode}
      section={course.section}
    />
  ))}
</div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                    </PaginationItem>

                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink href="#" onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  {/* Ellipsis if there are more than 3 pages */}
          {totalPages > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

                    <PaginationItem>
                      <PaginationNext href="#" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
    //     </SidebarInset>
    //   </div>
    // </SidebarProvider>
  );
};

export default Courses;
