import PropTypes from "prop-types";
import { Clock2, ChevronRight } from "lucide-react";

const ScheduleList = ({ scheduleData }) => {
  return (
    <div className=" max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Clock2 className="text-purple-800 w-5 h-5 sm:w-6 sm:h-6" />
        <h3 className="text-xs sm:text-base font-semibold">
          Today&apos;s Schedule
        </h3>
      </div>
      {/* Schedule List */}
      <div className="space-y-3 ">
        {scheduleData.map((schedule) => (
          <div
            key={schedule.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border-l-8 border-purple-800 bg-purple-100 transition-all sm:p-4"
          >
            <div className="flex-1 pr-11">
              <p className="font-medium text-sm  sm:text-base truncate">
                {schedule.subject}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {schedule.class} | {schedule.time}
              </p>
            </div>
            <ChevronRight className="text-purple-800 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
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
