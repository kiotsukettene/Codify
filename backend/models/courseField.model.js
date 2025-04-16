import mongoose from "mongoose";

const courseFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: [
        "ClassName",
        "Program",
        "Year",
        "Section",
        "ProgrammingLanguage",
        "Day",
        "TimeSlot",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    lastModified: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Add unique index on name and type
courseFieldSchema.index({ name: 1, type: 1 }, { unique: true });

export const CourseField = mongoose.model("CourseField", courseFieldSchema);
export default CourseField;
