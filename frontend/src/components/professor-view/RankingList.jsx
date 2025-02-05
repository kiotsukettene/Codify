import PropTypes from "prop-types";
import { Trophy } from "lucide-react";

const RankingList = ({ rankingData }) => {
  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-200 border-yellow-400"; // Yellow for #1
      case 2:
        return "bg-purple-100 border-purple-300"; // Purple for #2
      default:
        return "bg-gray-100 border-gray-300"; // Gray for others
    }
  };

  return (
    <div className=" bg-white rounded-xl p-6 border border-black/5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-purple-800" size={24} />
        <h3 className="text-lg font-semibold pl-1">Student Rankings</h3>
      </div>

      <div className="space-y-3 mb-4">
        {rankingData.map((student) => (
          <div
            key={student.id}
            className={`flex items-center pl-6 gap-3 rounded-full ${getRankColor(
              student.rank
            )} border p-3 transition-transform hover:scale-[1.02]`}
          >
            <span className="text-sm font-semibold text-gray-500 w-8">
              #{student.rank}
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border">
              <span className="text-lg">{student.avatar}</span>
            </div>

            <div className="flex-grow">
              <p className="font-medium leading-tight">{student.name}</p>
              <p className="text-sm text-gray-500">{student.section}</p>
            </div>

            <div
              key={student.id}
              className={`text-sm font-medium px-3 py-1 rounded-full bg-white/50 ${getRankColor(
                student.rank
              )} border `}
            >
              {student.score} XP
            </div>
          </div>
        ))}
      </div>

      <button className="w-full text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center gap-2">
        View Leaderboards
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

RankingList.propTypes = {
  rankingData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      rank: PropTypes.number.isRequired,
      section: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RankingList;
