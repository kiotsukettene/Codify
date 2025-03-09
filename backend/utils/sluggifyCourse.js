import slugify from "slugify";

const generateCourseSlug = function (next) {
  if (this.isModified("className") || this.isNew) {
    this.slug = slugify(this.className, { lower: true, strict: true });
  }
  next();
};

export default generateCourseSlug;
