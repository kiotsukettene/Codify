import { useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function CourseFieldsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const courseFields = [
    {
      id: 1,
      name: "Introduction to Programming",
      lastModified: "2024-02-20",
      status: "Active",
    },
    {
      id: 2,
      name: "Data Structures",
      lastModified: "2024-02-19",
      status: "Active",
    },
  ];

  const filteredFields = courseFields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-xs">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-500 text-white">
          <PlusIcon className="h-4 w-4 mr-2 text-white" />
          Add New
        </Button>
      </div>

      <div className="flex-1 w-full overflow-auto p-6">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 py-2">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Last Modified
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="relative">
            {filteredFields.map((field) => (
              <tr key={field.id} className="border-b border-gray-200">
                <td className="px-4 py-10 text-sm text-gray-900">
                  {field.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(field.lastModified).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
                <td className="px-4 py-2 text-sm">
                  <Badge
                    variant="outline"
                    className={
                      field.status === "Active"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }
                  >
                    {field.status}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-sm text-right space-x-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <PencilIcon className="h-4 w-4 inline" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredFields.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-2 text-sm text-gray-500 text-center"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
