import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-context-menu";
import React, { useState, useEffect } from "react";
import Logo from "@/assets/picture/logos/Logo.png";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, Circle, Loader, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PasswordStrengthIndicator } from "@/components/ui/Password-Strength-indicator";
import { useAuthStore } from "@/store/authStore";
import { Particles } from "@/components/ui/particles";

function AdminRegisterPage() {
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    institutionName: "",
    address: "",
    phoneNumber: "",
    password: "",
  });
  const { signup, error, isLoading, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Name validation
    // Name regex: Only letters, spaces, and hyphens are allowed
    const nameRegex = /^[a-zA-Z\s-]+$/;
    if (!name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Invalid name format.";
      valid = false;
    } else {
      newErrors.name = "";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    } else {
      newErrors.email = "";
    }

    // Institution Name validation
    if (!institutionName.trim()) {
      newErrors.institutionName = "Institution Name is required.";
      valid = false;
    } else {
      newErrors.institutionName = "";
    }

    // Address validation
    if (!address.trim()) {
      newErrors.address = "Address is required.";
      valid = false;
    } else {
      newErrors.address = "";
    }

    // Phone Number validation
    const phoneRegex = /^\d{10,}$/; // Assuming a minimum of 10 digits
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required.";
      valid = false;
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number.";
      valid = false;
    } else {
      newErrors.phoneNumber = "";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      valid = false;
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signup(
        email,
        password,
        name,
        institutionName,
        address,
        phoneNumber,
        "Annually",
        "Premium",
        "credit_card",
        70000
      );
      navigate("/admin/email-verify");
    } catch (error) {
      console.error("Error details:", error.response?.data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main className="relative bg-gradient-to-b from-[#4C1D95] via-[#6B21A8] to-[#A855F7] w-full h-screen overflow-hidden flex flex-col items-center py-12">
        <div className="absolute inset-0 z-0">
          <Particles
            className="w-full h-full"
            quantity={300}
            ease={60}
            color="#8A2BE2"
            refresh
          />
        </div>

        <div className="flex min-h-svh absolute flex-col items-center justify-center p-6 md:p-10 px-11">
          <div className="w-full max-w-sm md:max-w-7xl">
            <div className="flex flex-col gap-6 bg-white">
              <form
                onSubmit={handleAdminRegister}
                className="p-6 m-0 md:p-8 grid md:grid-cols-2 gap-4"
              >
                <div className="flex flex-col gap-6">
                  <img src={Logo} className="w-24 h-auto" alt="" />
                  <div className="flex flex-col space-y-1">
                    <h1 className="text-xl font-semibold">
                      Institution Registration
                    </h1>
                    <p className="text-xs text-muted-foreground text-justify">
                      Register your institution and complete payment to get
                      started.
                    </p>
                  </div>

                  {/* Two-column layout */}
                  <div
                    className="grid grid-cols-2 gap-4 text-sm"
                    style={{ color: "#383838" }}
                  >
                    <div className="grid gap-2">
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      <Label className="font-medium" htmlFor="name">
                        Billed to
                      </Label>
                      <Input
                        className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        id="name"
                        type="text"
                        value={name}
                        placeholder="John Smith"
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs">{errors.name}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label className="font-medium" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label className="font-medium" htmlFor="institutionName">
                        Institution Name
                      </Label>
                      <Input
                        className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${
                          errors.institutionName ? "border-red-500" : ""
                        }`}
                        id="institutionName"
                        type="text"
                        value={institutionName}
                        placeholder="University of Caloocan City"
                        onChange={(e) => setInstitutionName(e.target.value)}
                      />
                      {errors.institutionName && (
                        <p className="text-red-500 text-xs">
                          {errors.institutionName}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2 ">
                      <Label className="font-medium" htmlFor="phoneNumber">
                        Phone Number
                      </Label>
                      <Input
                        className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${
                          errors.phoneNumber ? "border-red-500" : ""
                        }`}
                        id="phoneNumber"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-xs">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2 col-span-2">
                      <Label className="font-medium" htmlFor="address">
                        Address
                      </Label>
                      <Input
                        className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${
                          errors.address ? "border-red-500" : ""
                        }`}
                        id="address"
                        type="text"
                        placeholder="23J+R9M, Congressional Rd Ext, Caloocan, Metro Manila"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs">{errors.address}</p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <PasswordStrengthIndicator
                        password={password}
                        setPassword={setPassword}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div
                  className="flex flex-col gap-6 p-6"
                  style={{ backgroundColor: "#F8F4FF" }}
                >
                  <Separator className="mt-8" />
                  <div className="flex mt-5 text-black font-semibold text-xl w-full justify-between bg-purple-100 p-2 rounded-md">
                    <Label>Total</Label>
                    <Label>₱ 70,000</Label>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground w-full mt-1 gap-2">
                    <LockKeyhole className="w-5 h-5 flex-shrink-0" />
                    <p className="text-left">
                      Guaranteed to be safe & secure, ensuring that all
                      transactions are protected.
                    </p>
                  </div>

                  <div>
                    <Label className="text-xl font-semibold ">
                    Standard Codify Plan
                    </Label>
                    <div className="mt-3 w-full ">
                      <button
                        type="button"
                        onClick={() => setIsSelected(!isSelected)} // Now it only updates state
                        className="w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div
                          className={`flex items-center justify-between rounded-2xl border-2 border-[#834CFF] p-6 transition-all duration-300 ${
                            isSelected ? "bg-[#F6F2FF]" : "bg-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                                isSelected
                                  ? "border-[#7C3AED]"
                                  : "border-gray-500"
                              }`}
                            >
                              {isSelected && (
                                <Circle className="h-3 w-3 fill-[#7C3AED] text-[#7C3AED]" />
                              )}
                            </div>
                            <div className="flex flex-col items-start">
                              <h3 className="font-semibold text-gray-900">
                              Full Institution Access
                              </h3>
                              <p className="text-gray-500">₱ 70,000</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-normal text-sm"
                  >
                    <BadgeCheck />{" "}
                    {isLoading && !error ? (
                      <Loader className="animate-spin mx-auto" size={24} />
                    ) : (
                      "Register"
                    )}
                  </Button>
                  <div className="flex items-center justify-center mx-auto w-full">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <a
                        href="/admin/login"
                        className="text-primary font-medium hover:underline"
                      >
                        Login
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

export default AdminRegisterPage;
