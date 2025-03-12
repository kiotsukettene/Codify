
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ProfBg2 from '@/components/Auth/Prof-Bg-2'
import { Mail } from 'lucide-react'


const ProfessorVerify= () => {

  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
       <ProfBg2 />
        
        {/* Card */}

      
          <Card className="w-full max-w-[450px] p-8 sm:p-12 rounded-3xl shadow-sm">
            <CardHeader className="space-y-4 text-center p-0 flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 bg-[#F5EBFF] rounded-full">
                 <Mail className="w-12 h-12 text-[#7C3AED]" />
                </div>
                <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight">
                    Check your email
                </h1>
                <p className="text-sm sm:text-[15px] text-muted-foreground">
                    We have sent password recovery instructions to your email.
                </p>
            </CardHeader>

            <CardContent className="space-y-4 p-0 mt-6 sm:mt-8">
              <div className="pt-2 space-y-3">
                <Button className="w-full h-10 sm:h-12 text-sm sm:text-[15px] bg-[#7C3AED] hover:bg-[#6D28D9]">
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        )
      }

export default ProfessorVerify
