import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function AdminNewPasswordPage() {
    const navigate = useNavigate()

    const handleNewPassword = (e) => {
        e.preventDefault()
        navigate('/admin-success-reset')
    }
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email and a new password to reset your account password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
          
            <div className="space-y-2">
              <Label htmlFor="password">Set New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a new password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button onClick={handleNewPassword} type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminNewPasswordPage;
