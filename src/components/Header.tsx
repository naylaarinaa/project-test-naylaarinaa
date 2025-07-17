import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import suitmediaLogo from "../assets/logo.png";

const menu = [
  { name: "Work", path: "/work" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Ideas", path: "/ideas" },
  { name: "Careers", path: "/careers" },
  { name: "Contact", path: "/contact" },
];

const Header: React.FC = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [transparent, setTransparent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const threshold = 5;

          if (currentY < 10) {
            // On top - solid background
            setShow(true);
            setTransparent(false);
          } else if (currentY > lastScrollY + threshold) {
            // Scroll down - hide header
            setShow(false);
            setTransparent(false);
          } else if (currentY < lastScrollY - threshold) {
            // Scroll up - show transparent background
            setShow(true);
            setTransparent(true);
          }

          setLastScrollY(currentY);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && !(event.target as Element).closest("header")) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300 ease-in-out
        px-4 md:px-14 py-3
        ${show ? "translate-y-0" : "-translate-y-full"}
        backdrop-blur-sm
        ${transparent && show ? "bg-orange-500/80 shadow-lg" : "bg-orange-500"}
      `}
    >
      <nav className="flex justify-between items-center max-w-full px-0 md:px-8 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 select-none flex-shrink-0 z-10"
        >
          <img
            src={suitmediaLogo}
            alt="Suitmedia Logo"
            className="h-14 w-auto"
            draggable={false}
          />
        </Link>

        {/* Hamburger button for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 flex-shrink-0 z-10"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white my-1 transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-7 items-center">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name} className="relative">
                <Link
                  to={item.path}
                  className={`
                    text-white text-base font-medium 
                    transition-colors duration-200 
                    hover:text-white/80 
                    px-1 py-2 block
                    ${isActive ? "text-white" : ""}
                  `}
                >
                  {item.name}
                </Link>
                {isActive && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-1 w-6 rounded bg-white block transition-all duration-200" />
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`
          md:hidden fixed left-0 right-0 top-[90px] 
          bg-orange-500 shadow-lg 
          transition-all duration-300 z-40 mx-4 rounded-md
          ${
            menuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <ul>
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.name}
                className="relative border-b border-orange-400 last:border-b-0"
              >
                <Link
                  to={item.path}
                  className={`
                    block px-6 py-4 text-white text-base font-medium 
                    transition-colors duration-200 hover:text-white/80
                    ${isActive ? "bg-orange-400/20" : ""}
                  `}
                >
                  {item.name}
                </Link>
                {isActive && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-2 h-1 w-6 rounded bg-white block" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default Header;
