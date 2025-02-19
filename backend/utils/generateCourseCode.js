export const generateCourseCode = () => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Google Classroom style
  return Array.from(
    { length: 6 },
    () => charset[Math.floor(Math.random() * charset.length)]
  ).join(""); // Generate a 6-character random code

  console.log(generateCourseCode());
};
