import slugify from "slugify";

async function generateActivitySlug(next) {
  if (this.isModified("title") || this.isNew) {
    const Activity = this.constructor;
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Check for existing activities with the same slug
    while (await Activity.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
}

export default generateActivitySlug;
