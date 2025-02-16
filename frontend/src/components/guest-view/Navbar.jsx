import { useState, useEffect } from "react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../../assets/picture/logos/Logo.png";
import whiteLogo from "../../assets/picture/logos/White Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
  const navItem = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/pricing", label: "Pricing" },
    { to: "/demo",  label: "Demo" },
    { to: "/support",label: "Support" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarBg = location.pathname === "/login" ? "bg-[#F5EBFF]" : isScrolled ? "bg-white" : "bg-transparent text-white";


  return (
<div className="fixed top-0 left-0 right-0 flex justify-center p-4 z-50 bg-transparent">
<nav className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
        isScrolled
          ? "w-[90%] md:w-[80%] bg-white rounded-full shadow-xs px-6 py-3"
          : "w-full bg-transparent text-white px-4 py-4"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="font-semibold">
        <img src={Logo} alt="Logo" />
      </Link>

      {/* Center Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navItem.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`text-md px-2 py-2 hover:bg-gray-100/15 rounded-full transition-colors ${
              isScrolled
                ? "w-[90%] md:w-[80%] bg-transparent hover:bg-primary px-4 hover:text-white rounded-full shadow-xs"
                : "w-full rounded-full px-4 py-2 hover:bg-white/20 text-white"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
      <Button
        onClick={() => navigate('/admin/register')}
          className={`${
            isScrolled
              ? "w-[90%] md:w-[80%]  rounded-full shadow-xs px-6 py-3 "
              : "w-full bg-gray-100/15 rounded-full hover:bg-white/50 hover:text-neutral-900 px-4 py-4 bg-white text-purple-900 hover:bg-gray-200"
          }`}
        >
          Subscribe Now
        </Button>
        
        <Button
        onClick={() => navigate('/login')}
          className={`${
            isScrolled
              ? "w-[90%] md:w-[80%] bg-primary rounded-full shadow-xs px-6 py-3"
              : "w-full bg-gray-100/15 rounded-full hover:bg-white/50 hover:text-neutral-900 text-white px-4 py-4"
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
