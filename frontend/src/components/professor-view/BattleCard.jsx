import { Button } from "@/components/ui/button";
import BattleCardBg from "@/assets/picture/random-background/BattleCardBg.png";
import { motion } from "framer-motion";



const BattleCard = ( index ) => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.3 }}
    whileHover={{ scale: 1.02 }}    
    className="transition-all duration-300 bg-purple-100 rounded-lg p-6 md:p-8 text-left relative overflow-hidden flex flex-col md:flex-row items-start md:items-center">
      <div className="flex-1">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Battle of the Coders: Time to Guide the Challengers!
        </h2>
        <p className="text-sm sm:text-base mb-4">
          Empower your students to tackle exciting challenges to elevate their
          coding powers!
        </p>

        {/* Button positioned below text on mobile, inline on larger screens */}
        <div className="flex justify-start">
          <Button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
            Create Battle
          </Button>
        </div>
      </div>

      {/* Image Positioned to the Right */}
      <div className="Absolute w-full md:w-auto md:flex-shrink-0">
        <img
          src={BattleCardBg}
          alt="Astronaut"
          className="absolute right-0 bottom-0 w-28 sm:w-40 md:w-48 lg:w-72 object-cover hidden md:block"
        />
      </div>
    </motion.div>
  );
};

export default BattleCard;
