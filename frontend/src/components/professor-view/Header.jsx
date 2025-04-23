import { ssrImportKey } from "vite/module-runner";
import { Button } from "../ui/button";
import SearchBar from "./searchBar";
import ProfHeader from "@/assets/picture/random-background/ProfHeader.png";
import { motion } from "framer-motion";

const Header = ({ ProfName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
    >
      {/* Left Section */}
      <div className="flex items-center text-left gap-4 w-full md:w-auto">
        <div>
          <img
            src={ProfHeader}
            alt="Professor"
            className="w-12 h-12 md:w-16 md:h-16"
          />
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Welcome back, Prof. {ProfName}!
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Manage your courses and engage with students
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
