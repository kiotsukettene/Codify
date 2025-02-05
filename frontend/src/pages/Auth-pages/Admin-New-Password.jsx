import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import toast from 'react-hot-toast';
function AdminNewPasswordPage() {
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { resetPassword, error, isLoading, message } = useAuthStore()

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
        navigate('/admin/success-reset')
      }, 2000)
      } catch (error) {
        console.log(error.response?.data)
        toast.error(error.message || "An error occurred upon resetting password")
      }
      
    }
  return (
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
  );
}

export default AdminNewPasswordPage;
