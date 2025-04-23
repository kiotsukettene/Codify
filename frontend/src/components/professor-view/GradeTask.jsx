import PropTypes from "prop-types";
import { BookOpen, Star } from "lucide-react"; // Added Star icon
import { motion } from "framer-motion"; 


const GradeTask = ({ activityData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-black/5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-purple-800" />
        <h3 className="text-lg font-semibold pl-1">To-Grade Tasks</h3>
      </div>
      <div className="space-y-3 mb-4">
        {activityData.map((task, index) => (
          <motion.div 
          initial={{ opacity: 0, x: -10 }} // Animation on load
          animate={{ opacity: 1, x: 0 }} // Final position and opacity
          transition={{ delay: 0.2 + index * 0.1 }} // Stagger the animations
          whileHover={{ backgroundColor: "#f9f5ff" }} // Hover effectkey={task.id} className="flex items-center justify-between py-2">

          key={task.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />{" "}
              {/* Added star icon */}
              <div>
                <h4 className="font-medium text-sm">{task.assignment}</h4>
                <p className="text-xs text-gray-500">
                  Due : {task.dueDate} | {task.studentName}
                </p>
              </div>
            </div>
            <button className="px-4 py-1 text-sm text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50">
              View
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GradeTask;

GradeTask.propTypes = {
  activityData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      assignment: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      studentName: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
    })
  ).isRequired,
};
