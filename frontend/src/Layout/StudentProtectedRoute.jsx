// import { Navigate, Outlet } from "react-router-dom";
// import { useStudentStore } from "@/store/studentStore";
// import StudentLayout from "@/Layout/StudentLayout";

// const StudentProtectedRoute = () => {
//   const { isAuthenticated, isCheckingAuth } = useStudentStore();

//   if (isCheckingAuth) {
//     return <div>Loading...</div>; // ✅ Show loading state
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/student-login" replace />;
//   }

//   return (
//     <StudentLayout>
//       <Outlet />
//     </StudentLayout>
//   );
// };

// export default StudentProtectedRoute;
