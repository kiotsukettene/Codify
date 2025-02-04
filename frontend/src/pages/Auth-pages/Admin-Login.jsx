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

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoading = false;
  const handleAdminLogin = (e) => {
    e.preventDefault();
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
              <form>
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
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>

                      <Link
                        to="/admin-forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        {" "}
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      type="password"
                      required
                      disabled={isLoading}
                    />
                  </div>
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
              </form>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
