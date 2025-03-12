import { Trophy } from "lucide-react";
import goldFrame from "../../assets/picture/frames/goldborder.png";
import violetFrame from "../../assets/picture/frames/violetborder.png";
import silverFrame from "../../assets/picture/frames/silverborder.png";
import bronzeFrame from "../../assets/picture/frames/bronzeborder.png";

const RankingList = ({ rankingData }) => {
  const getRankFrame = (rank) => {
    switch (rank) {
      case 1:
        return goldFrame;
      case 2:
        return violetFrame;
      case 3:
        return silverFrame;
      default:
        return bronzeFrame;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300";
      case 2:
        return "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="relative bg-white rounded-xl p-6 border border-black/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="text-purple-800" size={24} />
          <h3 className="text-lg font-semibold pl-1">Student Rankings</h3>
        </div>

        <div className="space-y-3 mb-4">
          {rankingData.map((student) => (
            <div
              key={student.id}
              className={`flex items-center pl-6 gap-3 rounded-full ${getRankColor(
                student.rank
              )} border p-4 sm:p-5 transition-all hover:scale-[1.02] hover:shadow-md flex-nowrap`}
            >
              <span className="text-sm font-semibold text-gray-500 w-8 text-center">
                #{student.rank}
              </span>

              <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center">
                {getRankFrame(student.rank) && (
                  <img
                    src={getRankFrame(student.rank)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain z-50 translate-y-[-5px]"
                  />
                )}
                <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white border z-10">
                  <span className="text-lg">{student.avatar}</span>
                </div>
              </div>

              {/* Name truncation fix */}
              <div className="flex-grow min-w-0 pr-2">
                <p className="font-medium leading-tight truncate max-w-[120px] sm:max-w-none">
                  {student.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {student.section}
                </p>
              </div>

              {/* XP badge stays aligned */}
              <div
                className={`text-sm font-medium px-4 py-1.5 rounded-full bg-white/50 ${getRankColor(
                  student.rank
                )} border ml-auto max-w-full sm:max-w-none truncate`}
              >
                {student.score.toLocaleString()} XP
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
    </div>
  );
};

export default RankingList;
