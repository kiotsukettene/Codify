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

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorDisplayed, setErrorDisplayed] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const errorMessage = searchParams.get("error");
  
  const { login, logout, isLoading, error } = useAuthStore();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  }

  useEffect(() => {
        if (errorMessage) {
            logout(); 
        }
  }, [logout]);
  

  return (
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
                  {errorMessage && (
                <p className="text-red-500 text-sm">
                    {decodeURIComponent(errorMessage)}
                </p>
            )}
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
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                   
                    </div>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      type="password"
                      disabled={isLoading}
                  />
                  <Link to='/admin/forgot-password' className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >  Forgot your password?
                  </Link>
                  
                  </div>
                  <Button type="submit" className="w-full">
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
                  <Button className="px-4 border bg-white flex gap-2 hover:bg-neutral-100 hover:text-black border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500  dark:hover:text-slate-300 hover:shadow transition duration-150" onClick={handleGoogleLogin}>
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
  );
}

export default AdminLoginPage;
