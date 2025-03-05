import NavBar from "@/components/guest-view/Navbar";
import { Button } from "@/components/ui/button";
import { AuthorCard } from "@/components/ui/content-card";
import { Particles } from "@/components/ui/particles";
import { Presentation } from "lucide-react";
import React, { useState } from "react";
import bg from "../../assets/picture/random background/loginCard.png";
import { Building2, GraduationCap, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const roles = [
  {
    title: "Institution",
    icon: Building2,
    description:
      "Manage your institution, courses, and faculty members all in one place",
    bgColor: "bg-[#F8FAFC]",
    textColor: "text-[#4C1D95]",
    hoverBg: "hover:bg-[#EEF2FF]",
    iconBg: "bg-[#4C1D95]",
    to: "/admin/login",
  },
  {
    title: "Professor",
    icon: GraduationCap,
    description:
      "Create courses, manage assignments, and track student progress",
    bgColor: "bg-[#F3F4F6]",
    textColor: "text-[#6B21A8]",
    hoverBg: "hover:bg-[#F5F3FF]",
    iconBg: "bg-[#6B21A8]",
    to: "/professor/login",
  },
  {
    title: "Student",
    icon: Users,
    description:
      "Access courses, submit assignments, and collaborate with peers",
    bgColor: "bg-[#FAF5FF]",
    textColor: "text-[#A855F7]",
    hoverBg: "hover:bg-[#F3E8FF]",
    iconBg: "bg-[#A855F7]",
    to: "/student/login",
  },
];

const RoleCard = ({ role }) => {
  const Icon = role.icon;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`w-full rounded-xl ${role.bgColor} ${role.hoverBg} transition-colors duration-300 p-8 backdrop-blur-sm bg-opacity-95`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`${role.iconBg} text-white p-4 rounded-full mb-6`}>
          <Icon size={32} />
        </div>
        <h3 className={`text-2xl font-semibold mb-4 ${role.textColor}`}>
          {role.title}
        </h3>
        <p className="text-gray-600 mb-8 text-lg">{role.description}</p>
        <Link to={role.to} className="w-full">
          <Button
            className={`w-full py-6 text-white ${role.iconBg} hover:opacity-90 transition-all duration-200`}
          >
            Login as {role.title}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

function MainLogin() {
  const [color, setColor] = useState("#000000");

  return (
    <main className="relative bg-gradient-to-b from-[#4C1D95] via-[#6B21A8] to-[#A855F7] w-full min-h-screen flex flex-col items-center py-12">
      <div className="absolute inset-0 z-0">
        <Particles
          className="w-full h-full"
          quantity={300}
          ease={60}
          color="#8A2BE2"
          refresh
        />
      </div>

      <div className="relative z-10 text-center mt-32 mb-7">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Choose your portal
        </h1>
        <p className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto">
          Select your role to access the platform
        </p>
      </div>

      <div className="relative pt-9 z-10 flex flex-wrap justify-center gap-8 mt-8 w-full max-w-6xl px-4">
      {roles.map((role, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full sm:w-[calc(33.333%-2rem)] min-w-[320px]"
            >
            <RoleCard role={role} />
          </motion.div>
        ))}
      </div>
    </main>
  );
}

export default MainLogin;
