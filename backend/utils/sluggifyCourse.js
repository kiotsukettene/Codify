import slugify from "slugify";

async function generateCourseSlug(next) {
  if (this.isModified("className") || this.isNew) {
    const Course = this.constructor;
    const baseSlug = slugify(this.className, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Check for existing courses with the same slug
    while (await Course.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
}

export default generateCourseSlug;
