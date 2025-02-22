import React, {useState} from 'react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/Components/ui/separator';
import AppSidebar from '@/components/professor-view/Sidebar'
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom"; 
import ActivityOverview from '@/components/professor-view/Activity-Overview';
import ActivityOutput from '@/components/professor-view/Activity-Output';


const ActivityPage = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const navigate = useNavigate();

    const sampleActivity = {
        title: "Activity 1: Semantics",
        dueDate: "October 3, 2024 | 11:59 PM",
        points: 100,
        instructions: [
          "Create a Class: Create a class named BankAccount with balance and accountNumber attributes.",
          "Create Methods: Implement checkBalance(), deposit(amount), and withdraw(amount).",
          "Main Program: Prompt user for input and allow deposit, withdraw, and balance check.",
          "Requirements: Handle invalid inputs like withdrawing more than balance.",
        ],
        exampleOutput: `Enter account number: 123456789
      Welcome to your banking account!
      1. Check Balance
      2. Deposit Money
      3. Withdraw Money
      4. Exit
      Enter your choice: 1
      Your account balance is: $500.00`,
      };
    
      const students = [
        { id: "1", name: "All students", score: 0 },
        { id: "2", name: "Dela Cruz, Momo W.", score: 0 },
        {
          id: "3",
          name: "Antang, JunMar H.",
          score: 100,
          submitted: "11:58 PM",
          avatar:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-y4ovkVGe39fEOtC8ZBKyd642efEBEx.png",
          comment: "Ma'am sorry, namail ng pasa po kanina",
        },
        { id: "4", name: "Dela Cruz, Momo W.", score: 0 },
        { id: "5", name: "Caps, Elle B.", score: 0 },
      ];
    
      
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

        <div className='w-full px-10'>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/professor/course/lesson-overview")}>
      <ArrowLeft className="h-5 w-5" />
    </Button>
            <h1 className="text-xl font-semibold">{sampleActivity.title}</h1>
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
              dueDate={sampleActivity.dueDate}
              points={sampleActivity.points}
              instructions={sampleActivity.instructions}
              exampleOutput={sampleActivity.exampleOutput}
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

export default ActivityPage
