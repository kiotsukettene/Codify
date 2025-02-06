import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoaderOne from "@/components/ui/loader-one";
import { useAuthStore } from "@/store/authStore";
import useToggleVisibility from "@/hooks/use-toggle-visibility";
import { Eye, EyeOff } from "lucide-react";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { login, isLoading, error } = useAuthStore();
  const [isVisible, toggleVisibility] = useToggleVisibility()



  const handleAdminLogin = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

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
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2 relative">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                   
                    </div>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      type={isVisible ? "text" : "password"}
                      required
                      disabled={isLoading}
                    />
                   <button
            className="absolute inset-y-3 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            // aria-label={isVisible ? "Hide password" : "Show password"}
            // aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
                  </div>
                    <Link to='/admin/forgot-password' className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >  Forgot your password?
                  </Link>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full">
                    {isLoading ? <LoaderOne /> : "Login"}
                  </Button>
                  <Button className="px-4 border bg-white flex gap-2 hover:bg-neutral-800 hover:text-white border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500  dark:hover:text-slate-300 hover:shadow transition duration-150">
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
