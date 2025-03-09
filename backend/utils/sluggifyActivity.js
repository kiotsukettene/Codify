import slugify from "slugify";

const generateActivitySlug = function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
};

export default generateActivitySlug;
