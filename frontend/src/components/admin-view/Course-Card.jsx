import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Book, Ellipsis } from "lucide-react";

export default function CourseCard({
  lessonCount,
  languages,
  title,
  courseCode,
  section,
  program,
  onEdit, // Prop for edit action
  onDelete, // Prop for delete action
}) {
  return (
    <Card className="overflow-hidden transition-all w-80 hover:shadow-md">
      <CardHeader className="bg-slate-50 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg line-clamp-2  text-purple-700">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {program} • Section {section}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-slate-50 pb-2 hover:bg-purple-50" size="sm">
                <Ellipsis className="h-4 w-4 text-zinc-950" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-4 bg-slate-50 ">
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <Book className="h-4 w-4" />
          <span className="text-sm">{lessonCount} Lessons</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((language) => (
            <Badge key={language} variant="secondary" className="text-xs">
              {language}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t text-xs text-muted-foreground pt-5">
        <p>Course Code: {courseCode}</p>
      </CardFooter>
    </Card>
  );
}
