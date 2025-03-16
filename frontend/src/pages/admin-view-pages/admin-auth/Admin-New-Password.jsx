import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';


// import union from "@/assets/picture/random-background/union.png"
import pinkFlower from "@/assets/picture/random-background/pink-flower.png"
import blueFlower from "@/assets/picture/random-background/blue-flower.png"
import purpleFlower from "@/assets/picture/random-background/purple-flower.png"
import arrow from "@/assets/picture/random-background/arrow.png"
import mascot from "@/assets/picture/random-background/mascot.png"



function AdminNewPasswordPage() {
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { resetPassword, error, isLoading, clearError } = useAuthStore()

  useEffect(() => {
    clearError();
  }, []);

  const { token } = useParams()

    const handleNewPassword = async(e) => {
        e.preventDefault()
      if (password !== confirmPassword) { 
        alert("Passwords do not match")
        return;
      }
      try {
        await resetPassword(token, password)

      toast.success("Password reset successful, redirecting to login page...")
      setTimeout(() => {
        navigate('/admin/login')
      }, 2000)
      } catch (error) {
        console.log(error.response?.data)
        toast.error(error.message || "An error occurred upon resetting password")
      }
      
    }
  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">

     {/* Background Images */}
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
   {/* <img 
     src={union}
     alt="Star" 
     className="absolute top-10 right-96 w-10 lg:w-52"
   /> */}
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



    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email and a new password to reset your account password.
          </CardDescription>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNewPassword} className="space-y-4">
          
            <div className="space-y-2">
              <Label htmlFor="password">Set New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                placeholder="Confirm new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button   type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Set New Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

export default AdminNewPasswordPage;
