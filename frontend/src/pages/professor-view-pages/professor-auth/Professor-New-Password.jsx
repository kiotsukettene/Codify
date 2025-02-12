import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ProfBg2 from '@/components/Auth/Prof-Bg-2'

const ProfNewPassword = () => {

  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">

     {/* Background Images */}
         <ProfBg2 />

        {/* Card */}

      <Card className="w-full max-w-[450px] p-8 sm:p-12 rounded-3xl shadow-sm">
        <CardHeader className="space-y-2 text-center p-0">
          <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight">
            Set new password
          </h1>
        </CardHeader>
        <CardContent className="space-y-4 p-0 mt-6 sm:mt-8">
          <div className="relative">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              New Password
            </label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your new password"
              className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base" 
              />
          </div>

          <div className='relative'>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Confirm Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Re-enter your new password"
              className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base"
              required
            />
          </div>

          <div className="pt-2 space-y-3">
            <Button className="w-full h-10 sm:h-12 text-sm sm:text-[15px] bg-[#7C3AED] hover:bg-[#6D28D9]">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfNewPassword
