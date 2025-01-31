import SearchForm from "./SearchForm";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import badge from '../../assets/picture/achievements/sampleBadge.png'
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import StudentNotifications from "./Notifications";
function StudentHeader() {

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex item">
        <SearchForm />
      </div>

      <div className="flex gap-3 items-center md:flex md:items-center z-[-1] md:z-auto md:static 
      absolute top-0 right-0 p-4  md:space-x-4 lg:space-x-0">
      <div className="">
          <Button variant="outline" size="icon" className="h-8 w-8 relative">
                              <BellRing className="h-4 w-4" />
                              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                                 1
                              </span>
                              {/* <StudentNotifications/> */}
                              </Button>
        </div>
        <div>
            <img className="w-8 h-8 " src={badge} alt="" />
          {/* <Award color="#FF62A4" /> */}
        </div>
        <div>
          {" "}
          <Avatar>
            <AvatarImage className='w-8 h-8 rounded-full' src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default StudentHeader;
