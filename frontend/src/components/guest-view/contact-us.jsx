// "use client";

// import { useState, useRef } from "react";
// import {
//   Mail,
//   MessageSquare,
//   Users,
//   MapPin,
//   Twitter,
//   Linkedin,
//   Github,
//   Instagram,
//   Sparkles,
//   PlaneIcon as PaperPlane,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card } from "@/components/ui/card";
// import confetti from "canvas-confetti";

// // Cute abstract shapes for background
// const AbstractShapes = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
//       <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-purple-200 blur-3xl"></div>
//       <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-blue-200 blur-3xl"></div>
//       <div className="absolute top-[40%] right-[20%] w-40 h-40 rounded-full bg-pink-200 blur-3xl"></div>
//       <div className="absolute bottom-[10%] left-[30%] w-56 h-56 rounded-full bg-yellow-200 blur-3xl"></div>
//     </div>
//   );
// };

// // Cute contact option component
// const ContactOption = ({ icon: Icon, title, description, href, className }) => {
//   return (
//     <a
//       href={href}
//       className={`flex items-start space-x-3 p-4 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-105 group ${className}`}
//     >
//       <div className="mt-1 bg-white/20 p-3 rounded-full transition-all duration-300 group-hover:bg-white/30 group-hover:rotate-6">
//         <Icon className="h-5 w-5 text-white transition-all duration-300 group-hover:scale-110" />
//       </div>
//       <div>
//         <h3 className="font-medium text-white">{title}</h3>
//         <p className="text-sm text-purple-100">{description}</p>
//       </div>
//     </a>
//   );
// };

// // Social media button with filled circular design
// const SocialButton = ({ icon: Icon, href, color }) => {
//   return (
//     <a
//       href={href}
//       className={`${color} p-3 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-6 shadow-md`}
//     >
//       <Icon className="h-5 w-5 text-white" />
//     </a>
//   );
// };

// // Custom input with animation
// const AnimatedInput = ({
//   label,
//   id,
//   name,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//   required,
// }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   return (
//     <div className="mb-5">
//       <label
//         htmlFor={id}
//         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-nunito"
//       >
//         {label}
//       </label>
//       <div
//         className={`relative transition-all duration-300 ${
//           isFocused ? "scale-[1.01]" : ""
//         }`}
//       >
//         <Input
//           id={id}
//           name={name}
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           required={required}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           className={`w-full rounded-xl border-2 py-3 px-4 transition-all duration-300 font-nunito ${
//             isFocused
//               ? "border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
//               : "border-gray-200 dark:border-gray-700"
//           }`}
//         />
//       </div>
//     </div>
//   );
// };

// const ContactForm = () => {
//   // Local state for the form and submission status
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     inquiryType: "",
//     message: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showXpReward, setShowXpReward] = useState(false);
//   const [xpAmount, setXpAmount] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const confettiRef = useRef(null);
//   const [isHovered, setIsHovered] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (value) => {
//     setFormData((prev) => ({ ...prev, inquiryType: value }));
//   };

//   const triggerConfetti = () => {
//     if (confettiRef.current) {
//       const canvas = confettiRef.current;
//       const myConfetti = confetti.create(canvas, {
//         resize: true,
//         useWorker: true,
//       });

//       myConfetti({
//         particleCount: 100,
//         spread: 70,
//         origin: { y: 0.6 },
//         colors: ["#a855f7", "#8b5cf6", "#ec4899", "#f472b6", "#f59e0b"],
//         shapes: ["circle", "square"],
//         ticks: 200,
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Add your submission logic here, for example:
//     const formData = {
//       /* gather your form data */
//     };
//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/guest/send-email",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );
//       const result = await response.json();
//       if (result.success) {
//         alert("Email sent successfully!");
//         // Optionally, reset your form fields here
//       } else {
//         alert("Failed to send email. Please try again.");
//       }
//     } catch (error) {
//       alert("Error sending email. Please check your network.");
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 font-nunito">
//       <AbstractShapes />

//       {/* Canvas for confetti */}
//       <canvas
//         ref={confettiRef}
//         className="fixed inset-0 pointer-events-none z-50"
//         style={{ width: "100%", height: "100%" }}
//       ></canvas>

//       {/* XP Reward Animation */}
//       {showXpReward && (
//         <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
//           <div className="bg-purple-600 text-white px-8 py-5 rounded-2xl shadow-lg animate-bounce-slow flex items-center">
//             <Sparkles className="h-6 w-6 mr-3 text-yellow-300" />
//             <span className="text-xl font-bold">+{xpAmount} XP</span>
//           </div>
//         </div>
//       )}

//       <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
//         {/* Left Side - Contact Info */}
//         <Card className="md:w-2/5 overflow-hidden rounded-3xl shadow-xl bg-primary text-white transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
//           <div className="p-8 md:p-10">
//             <h1 className="text-3xl font-bold mb-2 font-nunito relative inline-block group">
//               Get in Touch
//               <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
//             </h1>
//             <p className="text-purple-100 mb-8">
//               We'd love to hear from you! Reach out with questions, feedback, or
//               just to say hello.
//             </p>

//             <div className="space-y-4">
//               <ContactOption
//                 icon={Mail}
//                 title="Email Support"
//                 description="support@codify.com"
//                 href="mailto:support@codify.com"
//               />
//               <ContactOption
//                 icon={MessageSquare}
//                 title="Live Chat"
//                 description="Instant support (if available)"
//                 href="#"
//               />
//               <ContactOption
//                 icon={Users}
//                 title="Join Our Community"
//                 description="Connect with other developers"
//                 href="#"
//               />
//               <ContactOption
//                 icon={MapPin}
//                 title="Location"
//                 description="123 Tech Avenue, San Francisco"
//                 href="#"
//               />
//               <div className="pt-6 border-t border-white/20">
//                 <h3 className="font-medium mb-4">Follow Us</h3>
//                 <div className="flex space-x-4">
//                   <SocialButton icon={Twitter} href="#" color="bg-[#1DA1F2]" />
//                   <SocialButton icon={Linkedin} href="#" color="bg-[#0A66C2]" />
//                   <SocialButton icon={Github} href="#" color="bg-[#333333]" />
//                   <SocialButton
//                     icon={Instagram}
//                     href="#"
//                     color="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Right Side - Contact Form */}
//         <Card className="md:w-3/5 overflow-hidden rounded-3xl shadow-xl bg-white dark:bg-gray-800 transform transition-all duration-300 hover:shadow-2xl">
//           <div className="p-8 md:p-10">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white font-nunito">
//               Send us a message
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <AnimatedInput
//                 label="Your Name"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="John Doe"
//                 required
//               />

//               <AnimatedInput
//                 label="Email Address"
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="john@example.com"
//                 required
//               />

//               <div className="mb-5">
//                 <label
//                   htmlFor="inquiryType"
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-nunito"
//                 >
//                   Inquiry Type
//                 </label>
//                 <Select
//                   value={formData.inquiryType}
//                   onValueChange={handleSelectChange}
//                 >
//                   <SelectTrigger className="w-full rounded-xl border-2 py-6 px-4 transition-all duration-300 font-nunito">
//                     <SelectValue placeholder="Select inquiry type" />
//                   </SelectTrigger>
//                   <SelectContent className="rounded-xl font-nunito">
//                     <SelectItem value="support">Support</SelectItem>
//                     <SelectItem value="feature">Feature Request</SelectItem>
//                     <SelectItem value="general">General Inquiry</SelectItem>
//                     <SelectItem value="collaboration">Collaboration</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="mb-5">
//                 <label
//                   htmlFor="message"
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-nunito"
//                 >
//                   Message
//                 </label>
//                 <Textarea
//                   id="message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   placeholder="How can we help you?"
//                   required
//                   className="w-full min-h-[120px] rounded-xl border-2 py-3 px-4 transition-all duration-300 font-nunito focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
//                 />
//               </div>

//               {/* Progress bar */}
//               {isSubmitting && (
//                 <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
//                   <div
//                     className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>
//               )}

//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-primary hover:bg-purple-600 text-white py-4 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg font-medium text-lg font-nunito relative overflow-hidden group"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//                 onClick={() => console.log("Submit button onClick triggered")}
//               >
//                 <span className="relative z-10 flex items-center justify-center">
//                   {isSubmitting ? "Sending..." : "Send Message"}
//                   <PaperPlane
//                     className={`ml-2 h-5 w-5 transition-all duration-300 ${
//                       isHovered ? "translate-x-1 -translate-y-1" : ""
//                     }`}
//                   />
//                 </span>
//               </Button>
//             </form>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ContactForm;
