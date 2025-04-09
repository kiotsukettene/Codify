import PropTypes from "prop-types";
import { Clock2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const ScheduleList = ({ scheduleData, onClick }) => {
  return (
    <div className="w-full mx-auto bg-white border border-gray-300 p-4 pt-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Clock2 className="text-purple-800 w-4 h-4 sm:w-5 sm:h-5" />
        <h3 className="text-xs sm:text-base font-semibold">
          Today's Schedule
        </h3>
      </div>
      <div className="space-y-3">
        {scheduleData.map((schedule, index) => (
          <motion.button
            key={schedule.id}
            className="w-full flex items-start justify-between text-left p-3 hover:bg-gray-50 rounded-lg border-l-8 border-purple-800 bg-purple-100 transition-all sm:p-4"
            onClick={() => onClick(schedule.id)}
            initial={{ opacity: 0, x: -10 }} // Animation on load
            animate={{ opacity: 1, x: 0 }} // Final position and opacity
            transition={{ delay: 0.2 + index * 0.1 }} // Stagger the animations
            whileHover={{ backgroundColor: "#f9f5ff" }} // Hover effect
          >
            <div className="flex-1 pr-4">
              <p className="font-medium text-xs sm:text-sm truncate">
                {schedule.subject}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {schedule.class} | {schedule.time}
              </p>
            </div>
            <ChevronRight className="text-purple-800 w-3 h-3 sm:w-4 sm:h-4 self-center" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ScheduleList;

ScheduleList.propTypes = {
  scheduleData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      subject: PropTypes.string.isRequired,
      class: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
};
