import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Particles } from "@/components/ui/particles";


function AdminEmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [resendCode, setResendCode] = useState(false);
  const [resendCodeTimer, setResendCodeTimer] = useState(60);

  const { error, verifyEmail, isLoading, resendVerificationCode, institution } = useAuthStore();

  const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = [...code];

      if (newCode[index]) {
        // Clear current field if it's not empty
        newCode[index] = "";
      } else if (index > 0) {
        // Move to previous field if already empty
        newCode[index - 1] = "";
        inputRefs.current[index - 1].focus();
      }

      setCode(newCode);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const verificationCode = code.join("");
  try {
    await verifyEmail(verificationCode);
    navigate('/admin/payment-summary');
    toast.success('Email verified successfully');
  } catch (error) {
    console.error('Error details:', error.response?.data);
  }
  };
  
    // auto submit when all fields are required
  useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

useEffect(() => {
  let timer;
  if (resendCode) {
    timer = setInterval(() => {
      setResendCodeTimer((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setResendCode(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(timer);
}, [resendCode]);

  const handleResendCode = async () => {
  if (!institution?.email) {
    toast.error("Error: Email not found. Please log in again.");
    return;
  }

  try {
    // ✅ Clear any previous error message before sending a new request
    setCode(["", "", "", "", "", ""]); // Clear input fields
    setResendCode(true);
    setResendCodeTimer(60); // Reset timer to 15 minutes
    useAuthStore.setState({ error: null }); // ✅ Clear error from global state

    const response = await resendVerificationCode(institution.email);

    toast.success("A new verification code has been sent to your email!");

  } catch (error) {
    console.error("🚨 Error resending code:", error);
    toast.error(error.response?.data?.message || "Error resending verification code");
  }
};


  

  return (
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
        <div className="flex h-screen overflow-hidden absolute w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="w-full max-w-md border-purple-100 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-violet-500">
              <Sparkles className="mx-auto mb-2 h-8 w-8" />
              Prepare for Liftoff!
            </CardTitle>
            <CardDescription className="text-center text-base text-neutral-700">
              One Step Away from Entering the Learning Galaxy!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-center text-sm text-gray-600">
                We've sent a verification code to your email. Enter the 6-digit
                code below to confirm and start your Codify journey!
              </p>
              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength="6"
                    className="h-12 w-12 text-center text-lg"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button
                onClick={() => navigate('/admin/payment-summary')}
                type="submit"
                className="w-full bg-primary transition-all hover:shadow-lg hover:shadow-violet-200"
                disabled={isLoading || code.some((digit) => !digit)}
              >
                {isLoading  ? "Verifying..." : "Verify Email"}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Didn't receive a code?{" "}
                <Button
                  onClick={handleResendCode}
                  disabled={resendCode}
                  variant="link"
                  className={`text-violet-500 hover:underline ${
                    resendCode ? "bg-gray-200 cursor-not-allowed text-neutral-700" : ""
                  }`}
                >
                  {resendCode
                    ? `Resend code in ${Math.floor(resendCodeTimer / 60)}:${
                        resendCodeTimer % 60 < 10 ? "0" : ""
                      }${resendCodeTimer % 60}`
                    : "Resend Verification Code"}
                </Button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  
    </main>

  )
}

export default AdminEmailVerificationPage;
