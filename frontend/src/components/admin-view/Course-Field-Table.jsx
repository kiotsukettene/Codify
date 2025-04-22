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
import DeleteDialog from "../Dialog/DeleteDialog";
import { motion } from "framer-motion";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fieldIdToDelete, setFieldIdToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: type || "",
    status: "Active",
  });
  const [errors, setErrors] = useState({
    name: "",
    type: "",
    status: "",
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
      console.error("[CourseFieldsTable] No type provided");
      return;
    }
    console.log(`[CourseFieldsTable] Fetching course fields for type: ${type}`);
    fetchCourseFieldsByType(type)
      .then(() => {
        console.log(
          "[CourseFieldsTable] Fetch completed. Current store state:",
          {
            courseFields,
            isLoading,
            error,
            type,
          }
        );
      })
      .catch((err) => {
        console.error(`[CourseFieldsTable] Fetch error for type ${type}:`, err);
      });
  }, [type, fetchCourseFieldsByType]);

  // Log state changes for debugging
  useEffect(() => {
    const typeFields = courseFields.filter((field) => field.type === type);
    console.log("[CourseFieldsTable] State updated:", {
      type,
      courseFields,
      typeFields,
      isLoading,
      error,
      filteredFieldsLength: typeFields.filter((field) =>
        field.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).length,
    });
  }, [type, courseFields, isLoading, error, searchQuery]);

  // Filter course fields by type and search query
  const filteredFields = courseFields
    .filter((field) => field.type === type && field.status === "Active")
    .filter((field) =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Validate a single field
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    const nameRegex = /^[a-zA-Z0-9\s-]+$/;

    if (fieldName === "name") {
      if (!value.trim()) {
        newErrors.name = "Name is required.";
      } else if (!nameRegex.test(value)) {
        newErrors.name = "Name can only contain letters, spaces, or hyphens.";
      } else {
        newErrors.name = "";
      }
    } else if (fieldName === "status") {
      newErrors.status = value ? "" : "Status is required.";
    }

    setErrors(newErrors);
  };

  // Handle opening the modal for creating a new field
  const handleAddNew = () => {
    console.log(
      "[CourseFieldsTable] Opening modal for new course field with type:",
      type
    );
    setCurrentField(null);
    setFormData({ name: "", type: type || "", status: "Active" });
    setErrors({ name: "", type: "", status: "" });
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing field
  const handleEdit = (field) => {
    console.log("[CourseFieldsTable] Opening modal for editing field:", field);
    setCurrentField(field);
    setFormData({
      name: field.name,
      type: field.type,
      status: field.status,
    });
    setErrors({ name: "", type: "", status: "" });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`[CourseFieldsTable] Form input changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Handle select changes for type and status
  const handleSelectChange = (name, value) => {
    console.log(`[CourseFieldsTable] Select changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Handle form submission for creating or updating a field
  const handleSubmit = async () => {
    console.log("[CourseFieldsTable] Submitting form with data:", formData);
    // Validate all fields before submission
    validateField("name", formData.name);
    validateField("type", formData.type);
    validateField("status", formData.status);

    if (Object.values(errors).some((error) => error !== "")) {
      console.warn(
        "[CourseFieldsTable] Form validation failed: Errors exist",
        errors
      );
      return;
    }

    try {
      if (currentField) {
        console.log(
          "[CourseFieldsTable] Updating course field:",
          currentField._id
        );
        await updateCourseField(currentField._id, formData);
      } else {
        console.log("[CourseFieldsTable] Creating new course field");
        await createCourseField(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("[CourseFieldsTable] Error during form submission:", err);
    }
  };

  // Handle deleting a field
  const handleDelete = (id) => {
    console.log("[CourseFieldsTable] Opening delete dialog for field:", id);
    setFieldIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = async () => {
    console.log("[CourseFieldsTable] Confirmed deletion for field:", fieldIdToDelete);
    try {
      await deleteCourseField(fieldIdToDelete);
      setIsDeleteDialogOpen(false);
      setFieldIdToDelete(null);
    } catch (err) {
      console.error("[CourseFieldsTable] Error deleting course field:", err);
    }
  };

  // Handle cancel deletion
  const handleCancelDelete = () => {
    console.log("[CourseFieldsTable] Cancelled deletion");
    setIsDeleteDialogOpen(false);
    setFieldIdToDelete(null);
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

  // Validate form data
  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.type !== "" &&
      formData.status !== "" &&
      Object.values(errors).every((error) => error === "")
    );
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const row = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


  return (
    <div className="flex flex-col w-full p-4 overflow-y-auto">
      <motion.div 
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex justify-between items-center mb-4">
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
      </motion.div>

      {isLoading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}
      {!isLoading && !error && (
        <div className="flex-1 w-full overflow-y-auto p-6 max-h-[calc(100vh-200px)]">
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
            <motion.tbody className="relative" animate="visible" variants={container}   initial="hidden"
            >
              {filteredFields.map((field) => (
                <motion.tr key={field._id} variants={row} className="border-b border-gray-200">
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
                </motion.tr>
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
            </motion.tbody>
          </table>
        </div>
      )}

      {/* Modal for creating/editing course fields */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
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
              <div className="col-span-3">
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "border-red-500" : ""}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  disabled={!!type}
                >
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
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
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className={
                isLoading || !isFormValid()
                  ? "opacity-50 cursor-not-allowed bg-gray-400"
                  : "bg-purple-600 hover:bg-purple-500"
              }
              onClick={handleSubmit}
            >
              {isLoading ? "Saving..." : currentField ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Confirmation"
        description="Are you sure you want to delete this? This action cannot be undone."
      />
    </div>
  );
}