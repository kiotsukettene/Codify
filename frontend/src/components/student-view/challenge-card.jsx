import { Card, CardContent, CardFooter } from "../ui/card";
import wave from "@/assets/picture/random-background/wave.png";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const StudentChallengeCard = ({ id, title, description, tags = [], status = 'pending' }) => {
  
  const navigate = useNavigate();

  const badgeColors = {
    easy: "bg-green-200 text-green-800",
    medium: "bg-orange-200 text-orange-800",
    hard: "bg-red-200 text-red-800",
  };

  const buttonStatus = {
    completed: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    pending: "bg-violet-100 text-violet-700 hover:bg-violet-200",
  }

  const handleStartChallenge = () => {
    navigate(`/student/challenges/${id}`)
  }

  return (
    <Card className="w-full h-auto mx-auto bg-white rounded-xl shadow-sm border-none overflow-hidden transition-all duration-300 dark:bg-gray-950 p-5">
    {/* Image Section */}
    <div className="relative bg-[#EEF7FE] rounded-lg">
      <img
        src={wave}
        alt={title}
        className="w-full h-44 object-cover rounded-lg"
      />
      <div className="absolute top-3 right-3">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={`text-xs font-medium px-3 py-1 rounded-full ${badgeColors[tag.toLowerCase()]}`}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>


      {/* Course Details */}
      <CardContent className="mt-6 space-y-2 p-0 flex-grow">
        <h3 className="text-lg font-medium text-[#415EB6]">{title}</h3>
        <h4 className="text-sm text-neutral-900 dark:text-neutral-200">{description}</h4>
      </CardContent>

      <CardFooter className="p-0 mt-3 justify-end">
        <Button variant="secondary" className={`${buttonStatus[status]} transition-colors`} onClick={handleStartChallenge}>
          {status === "completed" ? "Completed" : "Start Practice"}
        </Button>
      </CardFooter>

      {/* Category Badge */}
    </Card>
  );
};

export default StudentChallengeCard;
