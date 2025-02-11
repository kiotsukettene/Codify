import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useToggleVisibility from '@/hooks/use-toggle-visibility'
import { Eye, EyeOff, Loader } from 'lucide-react'
import union from "../../../assets/picture/random background/union.png"
import pinkFlower from "../../../assets/picture/random background/pink-flower.png"
import blueFlower from "../../../assets/picture/random background/blue-flower.png"
import purpleFlower from "../../../assets/picture/random background/purple-flower.png"
import arrow from "../../../assets/picture/random background/arrow.png"
import mascot from "../../../assets/picture/random background/mascot.png"
import logo from "../../../assets/picture/logos/logo.png"
import { Form } from '@/components/ui/form'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStudentStore } from '@/store/studentStore'
import { useState } from 'react'
import { auth, googleProvider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import toast from "react-hot-toast";

function StudentLoginPage() {
    const [isVisible, toggleVisibility] = useToggleVisibility()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()


    const { login, isLoading, error } = useStudentStore()


    const handleLogin = async (e) => {
      console.log("Login attempt with:", email, password);

      e.preventDefault()
      await login(email, password)
      navigate('/student/dashboard');  // Redirect to the dashboard after successful login

    }

//   const handleGoogleSignIn = async () => {
//     console.log("🚀 Google Sign-In Button Clicked!"); // ✅ Debugging

//     try {
//         const result = await signInWithPopup(auth, googleProvider);
//         console.log("✅ Google Sign-In Success:", result.user.email); // ✅ Debugging

//         const token = await result.user.getIdToken(); // Get Firebase token
//         console.log("🔑 Firebase Token:", token); // ✅ Debugging

//         // Send token to backend
//         const response = await axios.post("http://localhost:3000/api/students/student-google-login", { token });
//         console.log("📨 Backend Response:", response.data); // ✅ Debugging

//         if (response.data.success) {
//             toast.success("Login successful!");

//             // ✅ Store Student Data in Global Store
//             useStudentStore.getState().setStudent(response.data.student);

//             // ✅ Redirect to Dashboard without refreshing the page
//             navigate("/student/dashboard", { replace: true });
//         } else {
//             toast.error("Login failed. Please use a registered email.");
//         }

//     } catch (error) {
//         console.error("❌ Google Sign-In Error:", error);
//         toast.error("Google login failed. Try again.");
//     }
// };

const handleGoogleSignIn = async () => {
  console.log("🚀 Google Sign-In Button Clicked!"); // ✅ Debugging

  try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Google Sign-In Success:", result.user.email); // ✅ Debugging

      const token = await result.user.getIdToken(); // Get Firebase token
      console.log("🔑 Firebase Token:", token); // ✅ Debugging

      // Send token to backend
      const response = await axios.post("http://localhost:3000/api/students/student-google-login", { token });
      console.log("📨 Backend Response:", response.data); // ✅ Debugging

      if (response.data.success) {
          toast.success("Login successful!");

          // ✅ Store Student Data in Zustand store
          useStudentStore.getState().setStudent(response.data.student);

          // ✅ Redirect to Dashboard using React Router
          navigate("/student/dashboard", { replace: true });
      } else {
          toast.error("Login failed. Please use a registered email.");
      }

  } catch (error) {
      console.error("❌ Google Sign-In Error:", error);
      toast.error("Google login failed. Try again.");
  }
};


    
    return (
        <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
    
          {/* Background Images */}
          <img 
            src={logo}
            alt="Logo" 
            className="absolute top-7 left-24 lg:left-10 lg:w-28" 
          />
          <img 
            src={pinkFlower}
            alt="Pink Flower" 
            className="absolute top-16 lg:top-32 left-[-28px] w-16 lg:w-32 opacity-90"
          />
          <img 
            src={purpleFlower}
            alt="Purple Flower" 
            className="absolute bottom-[100px] left-[-30px] w-20 lg:w-52 opacity-90"
          />
          <img 
            src={blueFlower}
            alt="Blue Flower" 
            className="absolute top-[250px] right-[-30px] w-16 lg:w-56 opacity-90"
          />
          <img 
            src={union}
            alt="Star" 
            className="absolute top-10 right-96 w-10 lg:w-52"
          />
          <img 
            src={arrow}
            alt="Arrow" 
            className="absolute top-10 left-24 w-10 lg:w-52"
          />
          <img 
            src={arrow}
            alt="Arrow" 
            className="absolute bottom-20 left-44 w-10 lg:w-52"
          />
          <img 
            src={arrow}
            alt="Arrow" 
            className="absolute bottom-20 right-0 w-20 lg:w-72 rotate-180"
          />
          <img 
            src={mascot}
            alt="Mascot" 
            className="absolute bottom-[-150px] right-[-100px] w-72 lg:w-96"
          />
    
        {/* Login Card */}
        
        <Form onSubmit={handleLogin}>
        <Card className="w-full max-w-[450px] p-8 sm:p-12 rounded-3xl shadow-sm">
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
            
         
    
            <div className="flex items-center justify-between pt-2">
    
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="rounded-[4px] border-gray-300" />
                <Label htmlFor="remember" className="text-xs sm:text-sm text-muted-foreground font-normal">
                  Remember me
                </Label>
              </div>
    
                <Button  onClick={() => navigate('/student-forgot-password')}  variant="link" className="px-0 text-[#4F46E5] hover:text-[#4338CA] font-normal text-xs sm:text-sm">
                  Forgot password?
                </Button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

    
        
           <div className="pt-4 space-y-3 w-full">
           <motion.button onClick={handleLogin} className="w-full h-10 sm:h-12 text-sm sm:text-[15px] bg-[#7C3AED] hover:bg-[#6D28D9] rounded-md text-white" 
           disabled={isLoading} type="button" >
                {isLoading ? <Loader className=" text-white text-center animate-spin" /> : "Login"}
            </motion.button>
    
              <Button
                onClick={handleGoogleSignIn} // ✅ Ensure this function is called onClick

                variant="outline"
                className="w-full h-10 sm:h-12 text-sm sm:text-[15px] bg-[#0F172A] hover:bg-[#1E293B] text-white border-0 hover:text-white">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Sign In with Google
              </Button>
            </div>
    
        
          </CardContent>
        </Card>
        </Form>
      </div>
      )
}

export default StudentLoginPage
