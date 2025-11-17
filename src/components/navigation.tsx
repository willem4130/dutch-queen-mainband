"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Facebook,
  Instagram,
  Mail,
  Phone,
  Youtube,
} from "lucide-react";
import { useBandContent } from "@/hooks/useConfig";
import { throttle } from "@/lib/performance-utils";

const navigation = [
  { name: "Shows", href: "#shows" },
  { name: "Gallery", href: "#gallery" },
  { name: "About", href: "#about" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const content = useBandContent();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full bg-black/20 backdrop-blur-sm transition-all duration-300"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-12" : "h-16"}`}
        >
          {/* Website Toggle - Far Left */}
          <div className="flex items-center gap-2 pl-2">
            <a
              href="https://www.thedutchqueen.com"
              className={`font-semibold uppercase tracking-wide text-white/60 transition-all duration-300 hover:scale-110 hover:text-white/80 ${isScrolled ? "text-base md:text-lg" : "text-lg md:text-xl"}`}
            >
              full band
            </a>
            <span className="text-white/40">|</span>
            <a
              href="#home"
              onClick={(e) => handleClick(e, "#home")}
              className={`font-semibold uppercase tracking-wide text-white/90 transition-all duration-300 hover:scale-110 ${isScrolled ? "text-base md:text-lg" : "text-lg md:text-xl"}`}
            >
              unplugged
            </a>
          </div>

          {/* Centered Navigation - Desktop */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 transform lg:block">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`rounded-lg px-3 py-1 uppercase tracking-wider text-white/80 transition-all duration-300 hover:scale-110 hover:text-white ${isScrolled ? "text-sm" : "text-base"}`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social Icons - Far Right Desktop */}
          <div className="hidden items-center space-x-4 lg:flex">
            <a
              href={content.social.facebook || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-white/80 transition-all duration-300 hover:scale-110 hover:text-white"
            >
              <Facebook
                className={`transition-all duration-300 ${isScrolled ? "h-5 w-5" : "h-6 w-6"}`}
              />
            </a>
            <a
              href={content.social.instagram || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-white/80 transition-all duration-300 hover:scale-110 hover:text-white"
            >
              <Instagram
                className={`transition-all duration-300 ${isScrolled ? "h-5 w-5" : "h-6 w-6"}`}
              />
            </a>
            <a
              href={content.social.youtube || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-white/80 transition-all duration-300 hover:scale-110 hover:text-white"
            >
              <Youtube
                className={`transition-all duration-300 ${isScrolled ? "h-6 w-6" : "h-7 w-7"}`}
              />
            </a>
            <a
              href={`mailto:${content.contact.email}`}
              className="rounded-lg p-2 text-white/80 transition-all duration-300 hover:scale-110 hover:text-white"
            >
              <Mail
                className={`transition-all duration-300 ${isScrolled ? "h-5 w-5" : "h-6 w-6"}`}
              />
            </a>
            <a
              href={`tel:${content.contact.phone}`}
              className="rounded-lg p-2 text-white/80 transition-all duration-300 hover:scale-110 hover:text-white"
            >
              <Phone
                className={`transition-all duration-300 ${isScrolled ? "h-5 w-5" : "h-6 w-6"}`}
              />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-white/60 transition-all duration-300 hover:scale-110 hover:text-white/80"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X
                  className={`transition-all duration-300 ${isScrolled ? "h-5 w-5" : "h-6 w-6"}`}
                />
              ) : (
                <Menu
                  className={`transition-all duration-300 ${isScrolled ? "h-5 w-5" : "h-6 w-6"}`}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="bg-black/90 backdrop-blur-sm lg:hidden">
          <div className="space-y-4 px-6 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`block rounded-lg px-3 py-2 uppercase tracking-wider text-white/80 transition-all duration-300 hover:scale-110 hover:text-white ${isScrolled ? "text-sm" : "text-base"}`}
              >
                {item.name}
              </a>
            ))}

            {/* Mobile Social Icons */}
            <div className="flex items-center justify-center space-x-6 border-t border-white/10 pt-4">
              <a
                href={content.social.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-white/80 transition-all duration-300 hover:scale-110 hover:text-white"
              >
                <Facebook
                  className={`transition-all duration-300 ${isScrolled ? "h-6 w-6" : "h-7 w-7"}`}
                />
              </a>
              <a
                href={content.social.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-white/80 transition-all duration-300 hover:scale-110 hover:text-white"
              >
                <Instagram
                  className={`transition-all duration-300 ${isScrolled ? "h-6 w-6" : "h-7 w-7"}`}
                />
              </a>
              <a
                href={content.social.youtube || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-white/80 transition-all duration-300 hover:scale-110 hover:text-white"
              >
                <Youtube
                  className={`transition-all duration-300 ${isScrolled ? "h-6 w-6" : "h-7 w-7"}`}
                />
              </a>
              <a
                href={`mailto:${content.contact.email}`}
                className="rounded-lg p-2 text-white/80 transition-all duration-300 hover:scale-110 hover:text-white"
              >
                <Mail
                  className={`transition-all duration-300 ${isScrolled ? "h-6 w-6" : "h-7 w-7"}`}
                />
              </a>
              <a
                href={`tel:${content.contact.phone}`}
                className="rounded-lg p-2 text-white/80 transition-all duration-300 hover:scale-110 hover:text-white"
              >
                <Phone
                  className={`transition-all duration-300 ${isScrolled ? "h-6 w-6" : "h-7 w-7"}`}
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
