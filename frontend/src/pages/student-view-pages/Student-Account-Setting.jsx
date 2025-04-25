"use client";

import { useState, useEffect } from "react";
import {
  User,
  School,
  BookOpen,
  Award,
  Shield,
  Save,
  Edit,
  Upload,
  Check,
  Key,
} from "lucide-react";
import { useStudentStore } from "../../store/studentStore";

const StudentAccountSettings = () => {
  const { student, isAuthenticated, checkStudentAuth, updateStudent } =
    useStudentStore();

  // Sample preset avatars
  const presetAvatars = [
    "/src/assets/picture/Avatar/cat1.png",
    "/src/assets/picture/Avatar/cat2.png",
    "/src/assets/picture/Avatar/shitzu.png",
    "/src/assets/picture/Avatar/Lion.png",
    "/src/assets/picture/Avatar/Dog.png",
    "/src/assets/picture/Avatar/Bear.png",
  ];

  useEffect(() => {
    checkStudentAuth();
  }, []);

  // State for basic information
  const [profileImage, setProfileImage] = useState(student?.avatar || presetAvatars[0]);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [phone, setPhone] = useState(student?.phone || "");
  const [profileError, setProfileError] = useState("");

  // State for password management
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Academic information (read-only)
  const fullName =
    (student?.firstName || "Loading...") + " " + (student?.lastName || "");
  const email = student?.email || "Loading...";
  const academicInfo = {
    studentId: student?.studentId,
    institution: student?.institution?.institutionName,
    course: student?.course,
    yearLevel: student?.year,
  };

  // Update profile image and phone when student data changes
  useEffect(() => {
    if (student?.avatar) {
      setProfileImage(student.avatar);
    }
    if (student?.phone) {
      setPhone(student.phone);
    }
  }, [student]);

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit to 2MB
        setProfileError("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setShowAvatarSelector(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    try {
      await updateStudent({
        _id: student._id,
        currentPassword,
        password: newPassword,
      });

      setPasswordError("Security upgrade successful!");
      setTimeout(() => {
        setPasswordError("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    }
  };

  // Handle profile save
  const handleProfileSave = async () => {
    setProfileError("");
    if (!student?._id) {
      setProfileError("Student data not loaded");
      return;
    }

    try {
      await updateStudent({
        _id: student._id,
        avatar: profileImage,
        phone,
      });

      // Show success notification
      const notification = document.getElementById("notification");
      notification.classList.remove("opacity-0");
      notification.classList.add("opacity-100");

      setTimeout(() => {
        notification.classList.remove("opacity-100");
        notification.classList.add("opacity-0");
      }, 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update profile";
      console.error("Profile update error:", err.response?.data || err);
      setProfileError(errorMessage);
    }
  };

  return (
    <div className="w-full bg-purple-50 text-gray-700 p-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold items-start mb-8 mt-4">
          <span className="text-header"> MY ACCOUNT</span>
        </h1>

        {/* Success Notification */}
        <div
          id="notification"
          className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg transition-opacity duration-300 opacity-0 flex items-center"
        >
          <Check className="mr-2" size={18} />
          Mission Complete: Profile Updated!
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information Section */}
          <div className="md:col-span-2 bg-white rounded-xl p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center text-purple-700">
                <User className="mr-2" /> Basic Information
              </h2>
              <button
                onClick={handleProfileSave}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center transition-all transform hover:scale-105"
              >
                <Save className="mr-2" size={18} />
                Save Avatar
              </button>
            </div>

            {profileError && (
              <div className="text-sm text-red-500 mb-4">{profileError}</div>
            )}

            <div className="flex flex-col md:flex-row items-center mb-6">
              {/* Profile Picture */}
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-purple-200 relative">
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 transition-all transform hover:scale-110"
                >
                  <Edit size={16} />
                </button>

                {/* Avatar Selector */}
                {showAvatarSelector && (
                  <div className="absolute top-full mt-2 left-0 bg-white p-3 rounded-lg z-10 w-64 border border-purple-100">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {presetAvatars.map((avatar, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setProfileImage(avatar);
                            setShowAvatarSelector(false);
                          }}
                          className={`cursor-pointer rounded-full overflow-hidden border-2 ${
                            profileImage === avatar
                              ? "border-purple-400"
                              : "border-purple-100"
                          }`}
                        >
                          <img
                            src={avatar || "/placeholder.svg"}
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                    
                  </div>
                )}
              </div>

              {/* Basic Info Fields */}
              <div className="flex-1 w-full">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-purple-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    className="w-full bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-purple-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    className="w-full bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    disabled
                  />
                </div>
                
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="bg-white rounded-xl p-6 border border-purple-100">
            <h2 className="text-xl font-bold mb-4 flex items-center text-primary">
              <BookOpen className="mr-2" /> Academic Status
            </h2>

            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <div className="text-xs text-primary mb-1">
                  PLAYER STUDENT ID
                </div>
                <div className="flex items-center">
                  <Shield className="mr-2 text-primary" size={18} />
                  <span className="font-mono text-gray-700">
                    {academicInfo.studentId}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <div className="text-xs text-primary mb-1">INSTITUTION</div>
                <div className="flex items-center">
                  <School className="mr-2 text-primary" size={18} />
                  <span className="text-gray-700">
                    {academicInfo.institution}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <div className="text-xs text-primary mb-1">GAME CLASS</div>
                <div className="flex items-center">
                  <BookOpen className="mr-2 text-primary" size={18} />
                  <span className="text-gray-700">{academicInfo.course}</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <div className="text-xs text-primary mb-1">RANK/DIVISION</div>
                <div className="flex items-center">
                  <Award className="mr-2 text-primary" size={18} />
                  <span className="text-gray-700">
                    {academicInfo.yearLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Password Management Section */}
          <div className="md:col-span-3 bg-white rounded-xl p-6 border border-purple-100">
            <h2 className="text-xl font-bold mb-4 flex items-center text-primary">
              <Key className="mr-2" /> Update Password
            </h2>

            <form
              onSubmit={handlePasswordUpdate}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1 text-primary">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-primary">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-primary">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="md:col-span-3 flex items-center justify-between">
                {passwordError && (
                  <div
                    className={`text-sm ${
                      passwordError.includes("successful")
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {passwordError}
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg flex items-center ml-auto transition-all transform hover:scale-105"
                >
                  <Shield className="mr-2" size={18} />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAccountSettings;