import slugify from "slugify";

async function generateLessonSlug(next) {
  if (this.isModified("title") || this.isNew) {
    const Lesson = this.constructor;
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Check for existing lessons with the same slug
    while (await Lesson.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
}

export default generateLessonSlug;
