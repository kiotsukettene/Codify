import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

function AdminEmailVerificationPage() {
    const [code, setCode] = useState([" "," "," "," "," "," "])
    const inputRefs = useRef([])
    const navigate = useNavigate()
    // const [value, setValue] = useState("");

    const handleChange = (index,value) => {}
    const handleKeyDown = (index,e) => {}


  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
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
            <form className="space-y-6">
              <p className="text-center text-sm text-gray-600">
                We've sent a verification code to your email. Enter the 6-digit code below to confirm and start your
                Codify journey!
              </p>
              <div className="flex justify-center space-x-2">
                {code.map((data, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="h-12 w-12 text-center text-lg"
                    value={data}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    required
                  />
                ))}
              </div>
              <Button
                onClick={() => navigate('/payment-summary')}
                type="submit"
                className="w-full bg-primary  transition-all hover:shadow-lg hover:shadow-violet-200"
              >
                Confirm Code
              </Button>
              <p className="text-center text-sm text-gray-600">
                Didn't receive a code?{" "}
                <button type="button" className="text-violet-500 hover:underline">
                  Resend Verification
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminEmailVerificationPage
