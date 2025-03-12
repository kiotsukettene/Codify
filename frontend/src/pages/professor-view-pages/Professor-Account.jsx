import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react"; // Import Eye Icons
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/professor-view/Sidebar';
import toast from "react-hot-toast";
import pic from "../../assets/picture/random background/dashboard-img.png"
import { motion } from "framer-motion";

const Account = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profile = {
    email: 'Dashboard',
    institution: 'University of Caloocan City',
    firstname: 'Catherine',
    lastname: 'Bae',
  };

  const validatePassword = () => {
    if (newPassword.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(newPassword)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(newPassword)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(newPassword)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) return "Password must contain at least one special character.";
    if (newPassword === currentPassword) return "New password cannot be the same as the current password.";
    if (newPassword !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationMessage = validatePassword();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert("Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 w-full">
              <motion.div initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}>
                <h1 className="text-3xl font-bold text-purple-600">Account Settings</h1>
                <p className="text-gray-500 mt-1">Keep your account details up to date and secure.</p>
              </motion.div>

              <Separator />

              <motion.div className="grid gap-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile.email} disabled className="bg-purple-100 mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Institution</Label>
                  <Input id="email" value={profile.institution} disabled className="bg-purple-100 mt-1" />
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={profile.firstname} disabled className="bg-purple-100 mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={profile.lastname} disabled className="bg-purple-100 mt-1" />
                  </div>
                </div>
              </motion.div>

              <Separator className="my-8" />

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                  <p className="text-gray-500 mt-2 text-sm">
                    Protect your account with a strong unique password. We recommend changing your password.
                  </p>
                  <div className="flex justify-center">
                    <img src={pic} alt="Profile" className="w-64 h-60 transform scale-x-[-1]" />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="mt-1 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-3 top-8 flex items-center text-gray-500"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <Label htmlFor="newPassword">Create a new password</Label>
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="mt-1 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-3 top-8 flex items-center text-gray-500"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="mt-1 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 top-8 flex items-center text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                  <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
                      {isSubmitting ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
  );
};

export default Account;