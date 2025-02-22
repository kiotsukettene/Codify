import React, { useState } from 'react'
import { Bold, Code2, Copy, FileText, MessageSquare, Plus, Trophy, Star, Target, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/Components/ui/separator';
import AppSidebar from '@/components/professor-view/Sidebar'
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"


const CreateLesson = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [sections, setSections] = useState([
      { id: "1", type: "description", content: "", formatting: [] },
    ]);
    const [progress, setProgress] = useState(0);
    const [achievements, setAchievements] = useState({
      hasTitle: false,
      hasSubtitle: false,
      hasDescription: false,
      hasCode: false,
      hasNote: false
    });
  
    const addSection = (type) => {
      setSections((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9), // Generates a random ID
          type,
          content: "",
          formatting: [],
        },
      ]);
    };
  
    const updateSection = (id, updates) => {
      setSections((prev) =>
        prev.map((section) => (section.id === id ? { ...section, ...updates } : section))
      );
    };
  
    const toggleFormatting = (sectionId, format) => {
      setSections((prev) =>
        prev.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              formatting: section.formatting.includes(format)
                ? section.formatting.filter((f) => f !== format)
                : [...section.formatting, format],
            };
          }
          return section;
        })
      );
    };

    // Update progress whenever content changes
    const updateProgress = () => {
      let completedSteps = 0;
      if (title) completedSteps++;
      if (subtitle) completedSteps++;
      if (sections.some(s => s.type === "description" && s.content)) completedSteps++;
      if (sections.some(s => s.type === "code" && s.content)) completedSteps++;
      if (sections.some(s => s.type === "note" && s.content)) completedSteps++;
      
      setProgress((completedSteps / 5) * 100);
      
      // Update achievements
      setAchievements({
        hasTitle: !!title,
        hasSubtitle: !!subtitle,
        hasDescription: sections.some(s => s.type === "description" && s.content),
        hasCode: sections.some(s => s.type === "code" && s.content),
        hasNote: sections.some(s => s.type === "note" && s.content)
      });
    };

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

    <div className="container w-full p-4">
      <Card className="border-0 shadow-none">
        <CardContent className="space-y-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className={`h-5 w-5 ${progress === 100 ? 'text-yellow-500' : 'text-gray-400'}`} />
                <Progress value={progress} className="w-[200px]" />
              </div>
              <div className="flex gap-2">
                {Object.entries(achievements).map(([key, achieved]) => (
                  <Tooltip key={key}>
                    <TooltipTrigger>
                      <Badge variant={achieved ? "default" : "outline"} className="cursor-help">
                        {key === 'hasTitle' && <Star className={`h-4 w-4 ${achieved ? 'text-yellow-500' : ''}`} />}
                        {key === 'hasSubtitle' && <Target className={`h-4 w-4 ${achieved ? 'text-blue-500' : ''}`} />}
                        {key === 'hasDescription' && <FileText className={`h-4 w-4 ${achieved ? 'text-green-500' : ''}`} />}
                        {key === 'hasCode' && <Code2 className={`h-4 w-4 ${achieved ? 'text-purple-500' : ''}`} />}
                        {key === 'hasNote' && <MessageSquare className={`h-4 w-4 ${achieved ? 'text-pink-500' : ''}`} />}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {key.replace('has', '')} {achieved ? 'Completed! 🎉' : 'Incomplete'}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start">
          <Button variant="ghost" size="icon" onClick={() => navigate("/professor/course/lesson-overview")}>
            <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-4 flex-1">
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  updateProgress();
                }}
                placeholder="Title"
                className="text-4xl font-semibold border-purple-100 px-4 focus-visible:ring-0"
              />
              <Input
                value={subtitle}
                onChange={(e) => {
                  setSubtitle(e.target.value);
                  updateProgress();
                }}
                placeholder="Type sub-title"
                className="text-xl border-purple-100 px-4 focus-visible:ring-0"
              />
            </div>
            <Button variant="secondary" className="ml-4">
              Save
            </Button>
          </div>

          {sections.map((section) => (
            <div key={section.id} className="space-y-2 relative group">
              {section.type === "description" && (
                <>
                  <ToggleGroup
                    type="multiple"
                    className="justify-start"
                    value={section.formatting}
                    onValueChange={(value) => updateSection(section.id, { formatting: value })}
                  >
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                      <Bold className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                      <span className="italic">I</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="underline" aria-label="Toggle underline">
                      <span className="underline">U</span>
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <Textarea
                    placeholder="Description"
                    value={section.content}
                    onChange={(e) => {
                      updateSection(section.id, { content: e.target.value });
                      updateProgress();
                    }}
                    className="min-h-[200px] border-purple-100 resize-none focus-visible:ring-0"
                    style={{
                      fontWeight: section.formatting?.includes("bold") ? "bold" : "normal",
                      fontStyle: section.formatting?.includes("italic") ? "italic" : "normal",
                      textDecoration: section.formatting?.includes("underline") ? "underline" : "none",
                    }}
                  />
                </>
              )}

              {section.type === "code" && (
                <div className="relative">
                  <Textarea
                    placeholder="Type code..."
                    value={section.content}
                    onChange={(e) => {
                      updateSection(section.id, { content: e.target.value });
                      updateProgress();
                    }}
                    className="min-h-[100px] bg-purple-50 font-mono text-sm pl-8"
                  />
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-purple-500" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      navigator.clipboard.writeText(section.content)
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {section.type === "note" && (
                <Textarea
                  placeholder="Type a note here"
                  value={section.content}
                  onChange={(e) => {
                    updateSection(section.id, { content: e.target.value });
                    updateProgress();
                  }}
                  className="min-h-[100px] border-purple-100 resize-none focus-visible:ring-0"
                />
              )}

              <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" className="rounded-full bg-purple-600 text-white hover:bg-purple-700">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => addSection("code")}>
                      <Code2 className="mr-2 h-4 w-4" />
                      Code snippets
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addSection("description")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Description
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addSection("note")}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Note
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {progress === 100 && (
            <div className="fixed top-4 right-4 animate-bounce">
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
     </SidebarInset>
                    </div>
                  </SidebarProvider>
  )
}

export default CreateLesson
