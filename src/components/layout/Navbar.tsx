"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { colorPalette, contentColorMap } from "@/data/colorPalette";

const navItems = [
  { name: "About", key: "About" },
  { name: "Companies", key: "Companies" },
  { name: "Residency", key: "Residency" },
  { name: "Grants", key: "Grants" },
  { name: "Contributors", key: "Contributors" },
  { name: "Subscribe", key: "Subscribe" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click-away handler for dropdown
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const dropdown = document.getElementById("navbar-accordion");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Function to trigger card open in AnimatedGrid
  const handleNavClick = (key: string) => {
    // Handle Subscribe navigation specially
    if (key === "Subscribe") {
      router.push("/subscribe");
      setOpen(false);
      return;
    }
    
    // For other nav items, trigger the grid card event
    window.dispatchEvent(
      new CustomEvent("open-grid-card", { detail: { key } })
    );
    setOpen(false);
  };

  return (
    <motion.header
      className={`fixed w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Accordion Dropdown fixed at top left, outside nav */}
      <div className="fixed top-0 left-0 z-[100]">
        <button
          id="navbar-menu-btn"
          className="flex flex-col items-center justify-center w-10 h-10 mt-2 ml-2 bg-black rounded focus:outline-none focus:ring transition-all duration-200 md:w-12 md:h-12 md:mt-3 md:ml-3"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="navbar-accordion"
        >
          {/* Responsive menu icon spacing and appearance */}
          <span className="block w-6 h-0.5 bg-white rounded mb-1 transition-all duration-200 md:w-7 md:h-1 md:mb-1.5" />
          <span className="block w-6 h-0.5 bg-white rounded mb-1 transition-all duration-200 md:w-7 md:h-1 md:mb-1.5" />
          <span className="block w-6 h-0.5 bg-white rounded transition-all duration-200 md:w-7 md:h-1" />
        </button>
        {open && (
          <div
            id="navbar-accordion"
            className="mt-2 w-48 rounded shadow-lg overflow-hidden"
            role="menu"
          >
            {navItems.map((item) => (
              <button
                key={item.key}
                className="block w-full text-left px-4 py-2 focus:outline-none"
                style={{
                  backgroundColor:
                    colorPalette[
                      contentColorMap[item.key as keyof typeof contentColorMap]
                    ],
                  color: "#000",
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
                onClick={() => handleNavClick(item.key)}
                role="menuitem"
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Remove nav and site title */}
    </motion.header>
  );
}
