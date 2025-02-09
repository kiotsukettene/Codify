import React from 'react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useToggleVisibility from '@/hooks/use-toggle-visibility'
import { Eye, EyeOff } from 'lucide-react'



function AddProfessor() {
  const [isVisible, toggleVisibility] = useToggleVisibility();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      })
    
      const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }))
      }
    
      const handleSubmit = (e) => {
        e.preventDefault()
        
      
      }
    
      const handleCancel = () => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",  
        })
    }

    
  return (
      <div className="flex flex-1 flex-col w-full h-full p-6 mt-4 bg-white rounded-lg ">

<h1 className="text-3xl font-semibold text-neutral-900">Create New Professor Account</h1>
      <h4 className='pt-3 font-normal'>Manage and view the list of professors, their assigned courses, and details.
      </h4>
  
      <div className="flex-1 flex flex-col w-full h-full p-4 overflow-auto">
        <main className="flex-1 w-full">    
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="mt-1"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="mt-1"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className='relative'>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type={isVisible ? "text" : "password"}
              required
              className="mt-1"
              value={formData.password}
              onChange={handleChange}
            />
              <button
            className="absolute inset-y-3 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
             aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
             Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="confirmPassword"
              required
              className="mt-1"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-6 py-3 bg-neutral-900 text-white hover:bg-neutral-700">
              Save Professor
            </Button>
          </div>
        </form> 
            </main>

  </div>





    </div>
       
      
  )
}

export default AddProfessor
