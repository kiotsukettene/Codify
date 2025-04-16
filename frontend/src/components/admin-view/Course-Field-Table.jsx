import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourseFieldStore } from "@/store/courseFieldStore.js";

const formatTypeForDisplay = (type) => {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Utility function to convert human-readable back to camelCase
const formatTypeForBackend = (type) => {
  return type
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
};

export default function CourseFieldsTable({ type }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: type || "", // Initialize with passed type
    status: "Active",
  });

  const {
    courseFields,
    isLoading,
    error,
    fetchCourseFieldsByType,
    createCourseField,
    updateCourseField,
    deleteCourseField,
  } = useCourseFieldStore();

  // Validate and fetch course fields for the given type
  useEffect(() => {
    if (!type) {
      console.error("No type provided to CourseFieldsTable");
      return;
    }
    console.log(`Fetching course fields for type: ${type}`);
    fetchCourseFieldsByType(type)
      .then(() => {
        console.log("Fetch completed. Current store state:", {
          courseFields,
          isLoading,
          error,
          type,
        });
      })
      .catch((err) => {
        console.error(`Fetch error for type ${type}:`, err);
      });
  }, [type, fetchCourseFieldsByType]);

  // Log state changes for debugging
  useEffect(() => {
    console.log("CourseFieldsTable state updated:", {
      type,
      courseFields,
      isLoading,
      error,
      filteredFieldsLength: courseFields.filter((field) =>
        field.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).length,
    });
  }, [type, courseFields, isLoading, error, searchQuery]);

  // Filter course fields based on search query
  const filteredFields = courseFields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle opening the modal for creating a new field
  const handleAddNew = () => {
    console.log("Opening modal for new course field with type:", type);
    setCurrentField(null);
    setFormData({ name: "", type: type || "", status: "Active" });
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing field
  const handleEdit = (field) => {
    console.log("Opening modal for editing field:", field);
    setCurrentField(field);
    setFormData({
      name: field.name,
      type: field.type,
      status: field.status,
    });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Form input changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes for type and status
  const handleSelectChange = (name, value) => {
    console.log(`Select changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for creating or updating a field
  const handleSubmit = async () => {
    console.log("Submitting form with data:", formData);
    if (!formData.name || !formData.type || !formData.status) {
      console.warn("Form validation failed: Missing required fields");
      alert("All fields are required");
      return;
    }

    try {
      if (currentField) {
        console.log("Updating course field:", currentField._id);
        await updateCourseField(currentField._id, formData);
      } else {
        console.log("Creating new course field");
        await createCourseField(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error during form submission:", err);
    }
  };

  // Handle deleting a field
  const handleDelete = async (id) => {
    console.log("Attempting to delete course field:", id);
    if (window.confirm("Are you sure you want to delete this course field?")) {
      try {
        await deleteCourseField(id);
      } catch (err) {
        console.error("Error deleting course field:", err);
      }
    }
  };

  // Valid types for the dropdown
  const validTypes = [
    "ClassName",
    "Program",
    "Year",
    "Section",
    "ProgrammingLanguage",
    "Day",
    "TimeSlot",
  ];

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
        <Button
          className="bg-purple-600 hover:bg-purple-500 text-white"
          onClick={handleAddNew}
        >
          <PlusIcon className="h-4 w-4 mr-2 text-white" />
          Add New
        </Button>
      </div>

      {isLoading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}
      {!isLoading && !error && (
        <div className="flex-1 w-full overflow-auto p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 py-2">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Type
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
                <tr key={field._id} className="border-b border-gray-200">
                  <td className="px-4 py-10 text-sm text-gray-900">
                    {field.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {formatTypeForDisplay(field.type)}
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
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => handleEdit(field)}
                    >
                      <PencilIcon className="h-4 w-4 inline" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(field._id)}
                    >
                      <TrashIcon className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredFields.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-2 text-sm text-gray-500 text-center"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for creating/editing course fields */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentField ? "Edit Course Field" : "Add New Course Field"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
                disabled={!!type} // Disable type selection if type is passed
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {validTypes.map((typeOption) => (
                    <SelectItem key={typeOption} value={typeOption}>
                      {formatTypeForDisplay(typeOption)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {currentField ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
