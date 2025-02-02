import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

function EmailVerification() {
  const [value, setValue] = useState("");

  return (
   
      <Card className='text-center'>
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>Enter the code sent to your email</CardDescription>
         
        </CardHeader>
        <CardContent>
        <div className="space-y-2 text-center flex flex-col items-center">
            <InputOTP
            className='text-center'
              maxLength={6}
              value={value}
              onChange={(value) => setValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className="text-center text-sm justify-center flex">
              {value === "" ? (
                <>Enter your one-time password.</>
              ) : (
                <>You entered: {value}</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
 
  );
}

export default EmailVerification;
