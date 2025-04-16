import PropTypes from "prop-types";
import { motion } from "framer-motion"; 

const StatsCard = ({ title, value, icon }) => {
  return (
    <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7 }}
    className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-[#E2D5F0] shadow-black/5 w-full">
      <div className="flex items-center justify-between mb-2 flex-wrap">
        <h3 className="text-gray-500 text-xs sm:text-sm md:text-base">
          {title}
        </h3>
        <span className="text-purple-800 text-lg md:text-xl">{icon}</span>
      </div>
      <p className="text-xl sm:text-2xl md:text-3xl font-semibold">{value}</p>
      </motion.div>
    );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
};

export default StatsCard;
