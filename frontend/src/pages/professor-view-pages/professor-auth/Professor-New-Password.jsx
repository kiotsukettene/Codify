import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ProfBg2 from '@/components/Auth/Prof-Bg-2'

const ProfNewPassword = () => {
  const [isVisible, toggleVisibility] = useToggleVisibility(); //toggle for password visibility
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [ConfirmNewPassword, setConfirmNewPassword] = useState("");
  const { resetPassword, error, isLoading } = useprofAuthStore();

  const { token } = useParams();

  const handleNewPassword = async (e) => {
    e.preventDefault();
    if (password !== ConfirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, password);

      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/professor/success-reset");
      }, 2000);
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.message || "An error occurred upon resetting password");
    }
  };
  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
      {/* Background Images */}
      <ProfBg2 />
      {/* Card */}

      <Card className="w-full max-w-[450px] p-8 sm:p-12 rounded-3xl shadow-sm">
        <CardHeader className="space-y-2 text-center p-0">
          <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight">
            Set new password
          </h1>
        </CardHeader>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <CardContent className="space-y-4 p-0 mt-6 sm:mt-8">
          <form onSubmit={handleNewPassword} className="space-y-4">
            <div className="relative">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New Password
              </label>
              <Input
                id="password"
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your new password"
                className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base"
              />
              <button
                className="  absolute inset-y-3  end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleVisibility}
                aria-controls="password"
              >
                {isVisible ? (
                  <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Eye size={16} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="relative">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <Input
                  id="ConfirmNewPassword"
                  type={isVisible ? "text" : "password"}
                  value={ConfirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base"
                  required
                />
                {/* <button
                  className="  absolute inset-y-3  end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleVisibility}
                  aria-controls="password"
                >
                  {isVisible ? (
                    <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button> */}
              </div>
              <div>
                <PasswordStrengthIndicator
                  password={password}
                  useExternalInput={true}
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Set New Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfNewPassword;
