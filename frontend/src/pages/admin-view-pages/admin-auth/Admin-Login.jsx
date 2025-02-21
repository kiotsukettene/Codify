import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoaderOne from "@/components/ui/loader-one";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import useToggleVisibility from "@/hooks/use-toggle-visibility";
import { Eye, EyeOff } from "lucide-react";

import union from "../../../assets/picture/random background/union.png"
import pinkFlower from "../../../assets/picture/random background/pink-flower.png"
import blueFlower from "../../../assets/picture/random background/blue-flower.png"
import purpleFlower from "../../../assets/picture/random background/purple-flower.png"
import arrow from "../../../assets/picture/random background/arrow.png"
import mascot from "../../../assets/picture/random background/mascot.png"
import logo from '../../../assets/picture/logos/Logo.png'

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, toggleVisibility] = useToggleVisibility();
  const navigate = useNavigate(); // ✅ Use React Router navigation  const [isVisible, toggleVisibility] = useToggleVisibility()



  const { login, isLoading, error, loginWithGoogle, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault(); // ✅ Prevent page reload

    try {
      await login(email, password); // ✅ Call Zustand store login function
      toast.success("Login successful!");

      // ✅ Navigate to admin dashboard
      navigate("/admin/dashboard", { replace: true });

    } catch (error) {
      console.log(error?.message || "Failed to login. Try again.");
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();

    navigate("/admin/dashboard", { replace: true });

  }

  return (
    <div className="relative h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
       {/* Background Images */}
                <Link to="/">
                  <img 
                   src={logo}
                   alt="Logo" 
                   className="absolute top-7 left-24 lg:left-10 lg:w-28" 
                   />
                </Link>
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

    
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <form onSubmit={handleAdminLogin}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <p className="text-center text-4xl items-center flex justify-center pb-4">
                  {" "}
                  🌟
                </p>

                {/* Title */}
                <h2 className="mb-2 text-center text-xl font-semibold text-violet-500">
                  Welcome to Codify Galaxy
                </h2>
                <p className="mb-8 text-center font-normal text-sm text-neutral-700">
                  Sign in to explore the universe of learning
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="grid gap-2">
                  
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2  relative">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                   
                    </div>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      type={isVisible ? "text" : "password"}
                      disabled={isLoading}
                  />
                   <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
                  <Link to='/admin/forgot-password' className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >  Forgot your password?
                  </Link>
                  
                  </div>
                <Button type="submit" disabled={ isLoading } className="w-full">
                    {isLoading && !error ? <LoaderOne /> : "Login"}
                </Button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>
                  <Button className="px-4 border bg-white flex gap-2 hover:bg-neutral-100 hover:text-black border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500  dark:hover:text-slate-300 hover:shadow transition duration-150" 
                   onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    handleGoogleLogin();
                  }}
                  disabled={isLoading}
  >
                    <img
                      className="w-6 h-6"
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      loading="lazy"
                      alt="google logo"
                    />
                    <span>Login with Google</span>
                  </Button>
                </div>
            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <Link to="/admin/register" className="text-violet-500 underline">
                Click here to Register
              </Link>
            </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>


  </div>
  );
}

export default AdminLoginPage;
