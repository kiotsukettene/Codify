import { Button } from "../ui/button";
import SearchBar from "./searchBar";
import books from "../../assets/picture/random background/bookprofheader.png";
//import { useCourseStore } from "@/store/courseStore";
import { useprofAuthStore } from "@/store/profAuthStore";

const Header = () => {
  const { professor } = useprofAuthStore();

  const professorName = professor ? professor.firstName : "professor";
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      {/* Left Section */}
      <div className="flex items-center text-left gap-4 w-full md:w-auto">
        {/* <div className="p-2 bg-white rounded-lg flex-shrink-0">
          <img
            src={books}
            alt="Professor"
            className="w-20 h-20 object-cover rounded-lg md:w-32 md:h-32"
          />
        </div> */}
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Welcome back, Prof. Irheil!
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Manage your courses and engage with students
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <SearchBar className="w-full sm:w-64" />
        <Button className="px-4 py-2 bg-purple-600 text-white rounded-lg whitespace-nowrap w-full sm:w-auto">
          Create New Course
        </Button>
      </div>
    </div>
  );
};

export default Header;
