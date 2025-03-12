import Typewriter from '@/components/fancy/typewriter';
import { useAuthStore } from '@/store/authStore';

import { useState } from "react"
import {
  BarChart,
  Bell,
  Calendar,
  CreditCard,
  Download,
  Home,
  Layers,
  Menu,
  MessageSquare,
  PieChart,
  Plus,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

function AdminDashboard() {

  const { institution } = useAuthStore();
  return (
  //  <div>
  //    <div className="lg:text-2xl sm:text-3xl text-2xl flex flex-row items-start justify-start text-foreground dark:text-muted font-normal overflow-hidden p-6">
  //     <p className="whitespace-pre-wrap">
  //       <span>{`Welcome to Codify, ${institution.institutionName}🌞 `}</span>
  //       <br />
  //       <Typewriter
  //         text={[
  //           "Welcome to Codify Admin",
  //           "Manage your platform easily!",
  //           "Let's keep things organized!",
  //           "Keep shining 🌟",
  //           "Stay on top of everything!",
  //         ]}
  //         speed={70}
  //         className="text-primary font-semibold"
  //         waitTime={1500}
  //         deleteSpeed={40}
  //         cursorChar={"_"}
  //       />
  //     </p>
  //   </div>
  //   <div className="flex flex-1 flex-col gap-4 p-4">
  //         <div className="grid auto-rows-min gap-4 md:grid-cols-3">
  //           <div className="aspect-video rounded-xl bg-muted/100" />
  //           <div className="aspect-video rounded-xl bg-muted/100" />
  //           <div className="aspect-video rounded-xl bg-muted/100" />
  //         </div>
  //         <div className="min-h-[100vh] flex-1 rounded-xl bg-red-50 md:min-h-min" />
  //       </div>
  //  </div>

  <div className="flex-1 flex flex-col overflow-hidden">
       

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col gap-6">
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, here's an overview of your institution.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Mar 1 - Mar 31, 2025</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>New Report</span>
                </Button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,853</div>
                  <div className="flex items-center text-xs text-green-500 mt-1">
                    <span className="font-medium">+12.5%</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Professors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">145</div>
                  <div className="flex items-center text-xs text-green-500 mt-1">
                    <span className="font-medium">+4.3%</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.2%</div>
                  <div className="flex items-center text-xs text-red-500 mt-1">
                    <span className="font-medium">-2.1%</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₱ 1.2M</div>
                  <div className="flex items-center text-xs text-green-500 mt-1">
                    <span className="font-medium">+18.2%</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Student Enrollment</CardTitle>
                  <CardDescription>Monthly student enrollment for the current year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end gap-2">
                    {[40, 65, 75, 50, 80, 95, 85, 70, 75, 90, 100, 85].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-primary/90 hover:bg-primary rounded-t transition-all"
                          style={{ height: `${height * 2.5}px` }}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pie chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Distribution</CardTitle>
                  <CardDescription>Students by department</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <PieChart className="w-full h-full text-muted-foreground" />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold">2,853</span>
                      <span className="text-xs text-muted-foreground">Total Students</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm">Computer Science</span>
                    <span className="text-sm text-muted-foreground ml-auto">42%</span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Engineering</span>
                    <span className="text-sm text-muted-foreground ml-auto">28%</span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Business</span>
                    <span className="text-sm text-muted-foreground ml-auto">18%</span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Others</span>
                    <span className="text-sm text-muted-foreground ml-auto">12%</span>
                  </div>
                </CardFooter>
              </Card>
            </div>

         
          </div>
        </main>
      </div>
  );
}

export default AdminDashboard;
