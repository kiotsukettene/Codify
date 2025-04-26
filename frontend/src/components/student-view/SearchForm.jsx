import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

function SearchForm({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={handleSearch}
        className="pl-9 w-full"
      />
    </div>
  )
}

export default SearchForm
