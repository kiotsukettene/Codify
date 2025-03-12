export const generateCourseCode = () => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 6 },
    () => charset[Math.floor(Math.random() * charset.length)]
  ).join("");

  console.log(generateCourseCode());
};
