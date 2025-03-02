export const formatDate = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
