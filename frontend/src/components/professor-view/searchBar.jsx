import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-xl">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <Search className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <Input
        type="search"
        placeholder="Search"
        className="pl-10 bg-background border-none shadow-sm ring-1 ring-muted/20 placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
