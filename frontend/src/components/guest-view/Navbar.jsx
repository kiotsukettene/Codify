import { useState, useEffect } from "react";
import { Menu, Moon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/picture/logos/Logo.png";
import WhiteLogo from "@/assets/picture/logos/White-Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const navItem = [
    { to: "/#home", label: "Home" },
    { to: "/#features", label: "Features" },
    { to: "/#pricing", label: "Pricing" },
    { to: "/about-us", label: "About" },
    { to: "/contact", label: "Contact" },
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
    location.pathname.includes("/professor/login") ||
    location.pathname.includes("/student/forgot-password") ||
    location.pathname.includes("/professor/forgot-password") || 
    location.pathname.includes("/professor/reset-password") ;

    return (
      <div className="fixed top-0 left-0 right-0 flex justify-center p-4 z-50 bg-transparent">
        <nav
          className={`flex items-center justify-between transition-all duration-300 ease-in-out  ${
            isScrolled
              ? "w-[90%] md:w-[80%] bg-white rounded-full shadow-xs px-6 py-3 text-gray-900"
              : isLoginPage
              ? "w-full  text-gray-900 px-4 py-4 "
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
  
          {/* Hamburger Icon - Only on mobile */}
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
  
          {/* Center Navigation - Large screens only */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItem.map(({ to, label }) =>
              to.startsWith("/#") ? (
                <a
                  key={to}
                  href={to}
                  className={`text-md px-2 py-2 rounded-full transition-colors ${
                    isScrolled
                      ? "w-[90%] md:w-[80%] bg-transparent hover:bg-primary hover:text-white px-4 rounded-full shadow-xs"
                      : isLoginPage
                      ? "w-full rounded-full px-4 py-2 text-gray-900 hover:bg-primary hover:text-white"
                      : "w-full rounded-full px-4 py-2 hover:bg-white hover:text-neutral-900"
                  }`}
                >
                  {label}
                </a>
              ) : (
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
              )
            )}
          </div>
  
          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
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
  
        {/* Mobile Nav Dropdown */}
        {menuOpen && (
  <div className="fixed inset-0 z-40">
    {/* Dark overlay */}
    <div
      className="absolute inset-0 bg-violet/50 backdrop-brightness-75"
      onClick={() => setMenuOpen(false)}
    />

    {/* Mobile Menu Panel */}
    <div className="absolute top-16 left-0 w-full px-4 z-50">
      <div className="relative bg-white/95 backdrop-blur-xl shadow-lg rounded-2xl p-5 border border-purple-100 space-y-5">
        {/* X button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-3 right-3 text-purple-500 hover:text-purple-800 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Items */}
        <div className="flex flex-col space-y-4 mt-4">
          {navItem.map(({ to, label }) =>
            to.startsWith("/#") ? (
              <a
                key={to}
                href={to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-full text-purple-800 bg-purple-100 hover:bg-primary hover:text-white text-center transition-all duration-200"
              >
                {label}
              </a>
            ) : (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-full text-purple-800 bg-purple-100 hover:bg-primary hover:text-white text-center transition-all duration-200"
              >
                {label}
              </Link>
            )
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
          <Button
            onClick={() => {
              navigate("/admin/register");
              setMenuOpen(false);
            }}
            className="w-full bg-purple-600 text-white rounded-full py-2 hover:bg-purple-700"
          >
            Subscribe Now
          </Button>
          <Button
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }}
            className="w-full border border-purple-600 text-white  rounded-full py-2 hover:bg-purple-100"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    );
  
};

export default NavBar;
