import mongoose from "mongoose";

const courseFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["ClassName", "Program", "Year", "Section"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Institution",
    },
    lastModified: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Add unique index on name, type, and institutionId
courseFieldSchema.index(
  { name: 1, type: 1, institutionId: 1 },
  { unique: true }
);

export const CourseField = mongoose.model("CourseField", courseFieldSchema);
export default CourseField;
