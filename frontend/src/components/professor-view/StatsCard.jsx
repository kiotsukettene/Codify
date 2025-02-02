import PropTypes from "prop-types";

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-[#E2D5F0] shadow-black/5 w-full">
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <h3 className="text-gray-500 text-xs sm:text-sm md:text-base">
          {title}
        </h3>
        <span className="text-purple-800 text-lg md:text-xl">{icon}</span>
      </div>
      <p className="text-xl sm:text-2xl md:text-3xl font-semibold">{value}</p>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
};

export default StatsCard;
