import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useToggleVisibility from '@/hooks/use-toggle-visibility'
import {  Eye, EyeOff, Loader } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStudentStore } from '@/store/studentStore'
import { useState, useEffect } from 'react'
import axios from "axios";
import toast from "react-hot-toast";
import ProfBg1 from '@/components/Auth/Prof-Bg-1'

function StudentLoginPage() {
    const [isVisible, toggleVisibility] = useToggleVisibility()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { login, isLoading, error, loginWithGoogle, clearError } = useStudentStore()

    
      useEffect(() => {
        clearError();
      }, []);

    const handleLogin = async (e) => {
      e.preventDefault()
      await login(email, password)
      navigate('/student/dashboard');  // Redirect to the dashboard after successful login
      toast.success("Login successfully")
    }
    
const handleGoogleSignIn = async () => {
  await loginWithGoogle();
  navigate("/student/dashboard", { replace: true });
};


    return (
        <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center pt-12 overflow-hidden p-4"> 
          {/* Background Images */}        
          <ProfBg1 />
    
        {/* Login Card */}
        <motion.form onSubmit={handleLogin} className="w-full max-w-[450px]" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
         >
        <Card className="p-6 sm:p-10 rounded-3xl shadow-sm">
          <CardHeader className="space-y-2 text-center p-0">
            <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight">
              Sign in
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Hey, Enter your details to login
              <br />
              to your account
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-0 mt-6 sm:mt-8">
            <div className="space-y-3 sm:space-y-4 relative">
              <Input 
              type="email" 
              name= "email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address" 
              className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base" 
           
              />
            </div>
    
            <div className='relative'>
              <Input 
              type={isVisible ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password" 
              className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base" 
             
              /> 
                <button
                      className="absolute inset-y-0 right-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground transition-colors"
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
            

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
              </div>   
                <Link to="/student/forgot-password"className="px-0 text-[#4F46E5] hover:text-[#4338CA] font-normal text-xs sm:text-sm">
                  Forgot password?
                </Link>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}


           <div className="pt-2 space-y-3 w-full">
           <motion.button onClick={handleLogin} 
           className="w-full h-10  justify-center items-center text-center  sm:h-12 text-sm sm:text-[15px] bg-[#7C3AED] hover:bg-[#6D28D9] rounded-md text-white" 
           disabled={isLoading} 
           type="submit" >
            {isLoading ? <Loader className=" text-white justify-center items-center text-center align-center animate-spin" /> : "Login"}
            </motion.button>
    
              <Button
                onClick={handleGoogleSignIn} 
                variant="outline"
                className="w-full h-10 sm:h-12 text-sm sm:text-[15px] bg-[#0F172A] hover:bg-[#1E293B] text-white border-0 hover:text-white">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Sign In with Google
              </Button>
            </div>

          </CardContent>
        </Card>
        </motion.form>
      </div>
      )
}

export default StudentLoginPage
