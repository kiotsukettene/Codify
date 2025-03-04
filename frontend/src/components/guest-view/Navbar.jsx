import { useState, useEffect } from "react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../../assets/picture/logos/Logo.png";
import WhiteLogo from "@/assets/picture/logos/White-Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navItem = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/pricing", label: "Pricing" },
    { to: "/demo", label: "Demo" },
    { to: "/support", label: "Support" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoginPage =
    location.pathname.includes("/admin/login") ||
    location.pathname.includes("/student/login") ||
    location.pathname.includes("/professor/login");

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center p-4 z-50 bg-transparent">
      <nav
        className={`flex items-center justify-between transition-all duration-300 ease-in-out  ${
          isScrolled
            ? "w-[90%] md:w-[80%] bg-white rounded-full shadow-xs px-6 py-3 text-gray-900"
            : isLoginPage
            ? "w-full  text-gray-900 px-4 py-4 " // Ensures dark text on light background
            : "w-full bg-transparent text-white px-4 py-4"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={isScrolled || isLoginPage ? Logo : WhiteLogo}
            alt="Logo"
            className="h-12 transition-all duration-300"
          />
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItem.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-md px-2 py-2 rounded-full transition-colors ${
                isScrolled
                  ? "w-[90%] md:w-[80%] bg-transparent hover:bg-primary hover:text-white px-4 rounded-full shadow-xs"
                  : isLoginPage
                  ? "w-full rounded-full px-4 py-2 text-gray-900 hover:bg-primary hover:text-white"
                  : "w-full rounded-full px-4 py-2 hover:bg-white hover:text-neutral-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/admin/register")}
            className={`${
              isScrolled
                ? "w-[90%] md:w-[80%]  rounded-full shadow-xs px-6 py-3 "
                : "w-full bg-gray-100/15 rounded-full hover:bg-purple-200 hover:text-purple-800 px-4 py-4 bg-white text-purple-900 "
            }`}
          >
            Subscribe Now
          </Button>

          <Button
            onClick={() => navigate("/login")}
            className={`${
              isLoginPage
                ? "w-[90%] md:w-[80%] bg-primary rounded-full shadow-xs px-6 py-3 text-white"
                : isScrolled
                ? "w-[90%] md:w-[80%] bg-transparent text-purple-600 border border-purple-600 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-purple-200 hover:text-purple-700 "
                : "w-full bg-gray-100/15 rounded-full hover:bg-white hover:text-purple-900 text-white px-4 py-4"
            }`}
          >
            Login
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
