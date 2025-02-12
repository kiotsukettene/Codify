import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PasswordResetConfirmation from "@/components/Auth/Password-reset-confirmation";
import { useAuthStore } from "@/store/authStore";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

function AdminForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const { isLoading, forgotPassword, message } = useAuthStore();

  const handleSendResetLink = async(e) => {
    e.preventDefault();
    await forgotPassword(email);
    setEmailSent(true);
    toast.success("Password reset link sent to your email");
  };
  return (
    <div className="flex min-h-screen bg-white w-full items-center justify-center p-6 md:p-10">
     {emailSent ? (
        //success message perd
        <div className="text-center">
              <PasswordResetConfirmation/>
        </div>
     ): 
     <Card className="mx-auto max-w-sm ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSendResetLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {message && <p className="text-red-500 text-sm">{message}</p>}
                <p className="text-sm py-2 text-gray-500">
                  A password reset link will be sent to the provided email
                  address.
                </p>
              </div>
              <Button type="submit" className="w-full">
                {isLoading && !message ? <Loader className='size-6 animate-spin mx-auto'/> : "Send Reset Link"}
              </Button>
        </form>
          <div className="mt-4 text-center text-sm">
            Remembered your password?{" "}
            <Link to="/admin/login" className="underline" prefetch={false}>
              Go back to login
            </Link>
          </div>
        </CardContent>
      </Card>
     }
     
      
    </div>
  );
}

export default AdminForgotPasswordPage;
