import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";

import imageHeader from "@/assets/picture/random-background/Code-battle-header-img.png";


import React from "react";
import { Cover } from "@/components/ui/cover";
import StudentStatCards from "@/components/student-view/StudentStatsCard";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AchievementBadges from "@/components/student-view/achievement-badges";
import { useNavigate } from "react-router-dom";



const StudentCodeBattleOverview = () => {
  const navigate = useNavigate()
  return (
    <div className="w-full py-4 mx-6">
<Card className="h-auto w-full bg-[#E9DCFF] shadow-none border-none relative overflow-hidden rounded-xl grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
  {/* Left Image Column (Smaller) */}
  <div className="flex items-end justify-center ">
    <img
      src={imageHeader}
      alt="Coding Battle"
      className="w-full h-auto object-contain hidden lg:block md:block"
    />
  </div>

  {/* Middle Text Column (Wider) */}
  <div className="flex flex-col items-center justify-center text-center p-4 md:p-8">
    <CardHeader className="text-header font-chango font-semibold">
      <p className=" md:text-4xl lg:text-6xl font-semibold text-4xl text-header mx-auto space-y-2 relative z-20 py-4 md:py-6 bg-clip-text bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Get ready for your <Cover>Coding Battle</Cover>
      </p>
    </CardHeader>

    <CardFooter>
      {/* <Button onClick={() => setJoinCourse(true)}>Join Course 🚀</Button> */}
      <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-0"
          >
        

            <Button onClick={() => navigate('/arena-dashboard')} className=' px-8 py-6 text-lg font-medium bg-primary rounded-full'>
            Enter Arena
            </Button>
          

           
          </motion.div>

    </CardFooter>
  </div>

  {/* Right Image Column (Smaller) */}
 
</Card>





      <div>
        <StudentStatCards/>
      </div>

      <div>
        <AchievementBadges/>
      </div>
    </div>
  );
};

export default StudentCodeBattleOverview;
