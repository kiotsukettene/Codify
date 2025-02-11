import React, { useState } from 'react'
import { Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8 // Start from 8 AM
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour > 12 ? hour - 12 : hour
    return {
      value: `${hour.toString().padStart(2, "0")}:00`,
      label: `${hour12}:00 ${ampm}`,
    }
  })


const CourseModal = () => {
    const [formValues, setFormValues] = useState({
        className: "",
        program: "",
        section: "",
        programmingLanguage: "",
        day: "",
        time: ""
    }); 
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const isFormComplete = Object.values(formValues).every(value => value.trim() !== "");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formValues);
    };

    
  return (
      <DialogContent className="sm:max-w-[500px] max-w-[300px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5 text-purple-500" />
            Create Course
          </DialogTitle>
        </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-4">

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-700">
              Class name
              <span className="text-red-500">*</span>
            </label>
            <Input 
            name="className" 
            placeholder="class name" 
            value={formValues.className}
            onChange={handleChange}
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-700">
                Program
            </label>
            <Input 
            name="program" 
            placeholder="Program" 
            value={formValues.program}
            onChange={handleChange}
            />
            <p className="text-xs text-gray-500">e.g. Bachelor of Science in Information Technology (BSIT)</p>
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-700">
                Section
            </label>
            <Input 
            name="section" 
            placeholder="section" 
            value={formValues.section}
            onChange={handleChange}
            />
          </div>

          <div className='space-y-2'>
            <label className="block text-sm font-medium text-gray-700">
              Programming Language
            </label>
            <Select 
            name="programmingLanguage" 
            onValueChange={(value) => setFormValues(prev => ({ ...prev, programmingLanguage: value }))}
            >     
              <SelectTrigger>
                <SelectValue placeholder="select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Day
              </label>
              <Select 
                name="day" 
                onValueChange={(value) => setFormValues(prev => ({ ...prev, day: value }))}
                >                
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day.toLowerCase()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Time
                </label>
                <Select 
                     name="time" 
                     onValueChange={(value) => setFormValues(prev => ({ ...prev, time: value }))}
                        >                
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                  <Clock className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <DialogTrigger asChild>
              <Button 
              type="button" 
              variant="outline" 
              className="bg-purple-50">
                    Cancel
              </Button>
            </DialogTrigger>

            <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400  disabled:pointer-events-none" 
                disabled={!isFormComplete}>
                Save
            </Button>
          </div>

        </form>
      </DialogContent>
  )
}

export default CourseModal
