import { Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"
function SearchForm() {
    return (
        <form className='w-full max-w-lg my-4 pt-5' >
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Search
                </Label>
              <SidebarInput
                id="search"
                placeholder="Search..."
                className="pl-12 w-full h-9"
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      )
}

export default SearchForm
