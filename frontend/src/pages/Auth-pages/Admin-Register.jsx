import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-context-menu";
import React, { useState } from "react";
import Logo from "../../assets/picture/logos/Logo.png";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, Circle, Loader, LockKeyhole, Rocket, Trophy, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion'
import { PasswordStrengthIndicator } from "@/components/ui/Password-Strength-indicator";
import { useAuthStore } from "@/store/authStore";



function AdminRegister() {
  const [isSelected, setIsSelected] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [address, setAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const { signup, error, isLoading } = useAuthStore()

  const handleAdminRegister = async(e) => {
    e.preventDefault();

    try {
      await signup(email, password, name, institutionName, address, phoneNumber, 'Annualy', 'Premium', "credit_card", 70000)
      navigate('/email-verify')
    } catch (error) {
      console.error('Error details:', error.response?.data);
    }
  }

  return (
   <motion.div
   initial={{opacity:0, y:20}}
   animate={{opacity:1, y:0}}
   transition={{duration:0.5}}
   >
       
     <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 px-11">
      <div className="w-full max-w-sm md:max-w-5xl">
        <div className="flex flex-col gap-6 bg-white">
          
          
              <form onSubmit={handleAdminRegister} className="p-6  m-0 md:p-8 grid md:grid-cols-2 gap-4">
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
                  <div
                    className="text-sm space-y-3"
                    style={{ color: "#383838" }}
                  >
                    <div className="grid gap-2 ">
                      <Label className="font-medium" htmlFor="billedTo">
                        Billed to
                      </Label>
                      <Input
                      className='bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm'
                        id="name"
                        type="text"
                        value={name}
                        placeholder="John Smith"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-medium" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        className='bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm'
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label className="font-medium" htmlFor="institutionName">
                        Institution Name
                      </Label>
                      <Input
                       className='bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm'
                        id="institutionName"
                        type="text"
                        value={institutionName}
                        placeholder="University of Caloocan City"
                        required
                        onChange={(e) => setInstitutionName(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2 ">
                      <Label className="font-medium" htmlFor="address">
                        Address
                      </Label>
                      <Input
                       className='bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm '
                        id="address"
                        type="text"
                        placeholder="23J+R9M, Congressional Rd Ext, Caloocan, Metro Manila"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="font-medium" htmlFor="phoneNumber">
                        Phone Number
                      </Label>
                      <Input
                       className='bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm '
                        id="phoneNumber"
                        type="number"
                        placeholder="Phone Number"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>

                    {/* <div className="grid gap-2">
                      <Label className="font-medium" htmlFor="password">
                        Password
                      </Label>
                      <Input
                        className='bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm'
                        id="password"
                        type="password"
                        placeholder=""
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    
                    </div> */}
                       <PasswordStrengthIndicator password={password} setPassword={setPassword}/>
             

                  </div>
                
           

             
              
                </div>

                 {/*======================== Right Side======================== */}

                <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: "#F8F4FF" }}>
                <Separator className="mt-8" />
                <div className="flex mt-5 text-black font-semibold text-xl w-full justify-between">
                  <Label>Total</Label>
                  <Label>₱ 70,000</Label>
                </div>

                <div className="flex text-xs text-muted-foreground w-full justify-between mt-5 text-justify gap-2">
                  <LockKeyhole />
                  <p>
                    Guaranteed to be safe & secure, ensuring that all
                    transactions are protected with the highest level of
                    security.
                  </p>
                </div>

                <div>
                  <Label className="text-xl font-semibold pt-11 mt-">
                    Starter Plan
                  </Label>

                 <div className="mt-3">
                 <button
                    onClick={() => setIsSelected(!isSelected)}
                    className="w-full max-w-md transition-all hover:scale-[1.02]  active:scale-[0.98]"
                  >
                    <div
                      className={`flex items-center justify-between rounded-2xl border-2 border-[#834CFF] p-6 transition-all duration-300 ${
                        isSelected ? "bg-[#F6F2FF]" : "bg-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                            isSelected ? "border-[#7C3AED]" : "border-gray-500"
                          }`}
                        >
                          {isSelected && (
                            <Circle className="h-3 w-3 fill-[#7C3AED] text-[#7C3AED]" />
                          )}
                        </div>
                        <div className="flex flex-col items-start ">
                          <h3 className=" font-semibold text-gray-900">
                          Standard Codify Subscription
                          </h3>
                          <p className="text-gray-500">₱ 70,000</p>
                        </div>
                      </div>

                    
                    </div>
                  </button>
                 </div>
                </div>

                <div className="flex gap-4 mt-6 ">
                    <Button className='font-normal text-sm text-neutral-900 px-7 bg-neutral-200 hover:bg-neutral-300'>Cancel</Button>
                  <Button
                    // onClick={() => navigate('/email-verify')}
                    type='submit'
                    isDisabled = {isLoading}
                    className='w-full font-normal text-sm '>
                    <BadgeCheck /> {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Register"}
                  </Button>          
                </div>
                <div className="text-balance mt-5 text-justify text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By Continuing you agree to our {" "}
            <a className="text-blue-400 " href="#">Terms and conditions.</a> 
          </div>
              
                </div>




          {/*======================== PASSWORD STRENGTH METER======================== */}
           

              
              </form>


            
        </div>

       

      </div>
    </div>
   </motion.div>

  );
}

export default AdminRegister;
