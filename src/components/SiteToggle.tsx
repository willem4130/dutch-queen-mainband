"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Three-site switch, kept identical across Full Band, Unplugged and MJ Unplugged
// (only the labels/currentSite differ per repo).
type SiteKey = "fullband" | "unplugged" | "mj";

interface SiteToggleProps {
  currentSite: SiteKey;
  fullbandUrl: string;
  unpluggedUrl: string;
  mjUrl: string;
  isScrolled?: boolean;
}

const LINKS: { key: SiteKey; label: string; title: string }[] = [
  { key: "fullband", label: "full show", title: "The Dutch Queen" },
  { key: "unplugged", label: "unplugged", title: "The Dutch Queen Unplugged" },
  { key: "mj", label: "mj unplugged", title: "Michael Jackson Unplugged" },
];

export function SiteToggle({
  currentSite,
  fullbandUrl,
  unpluggedUrl,
  mjUrl,
  isScrolled = false,
}: SiteToggleProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const urls: Record<SiteKey, string> = {
    fullband: fullbandUrl,
    unplugged: unpluggedUrl,
    mj: mjUrl,
  };

  const handleSiteSwitch = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetUrl: string,
  ) => {
    e.preventDefault();

    // Start fade out transition
    setIsTransitioning(true);

    // Navigate after fade completes
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 400);
  };

  // Phones: smaller + tighter so three links fit beside the menu button.
  // xl: same size as the centred desktop nav items so the switch clears them.
  const size = isScrolled
    ? "text-xs min-[400px]:text-[13px] sm:text-base md:text-lg xl:text-sm"
    : "text-xs min-[400px]:text-[13px] sm:text-lg md:text-xl xl:text-base";

  return (
    <>
      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Toggle Links */}
      <div className="flex items-center gap-1 sm:gap-2">
        {LINKS.map((link, i) => {
          const isCurrent = currentSite === link.key;
          return (
            <span key={link.key} className="flex items-center gap-1 sm:gap-2">
              {i > 0 && <span className="text-white/40">|</span>}
              <a
                href={urls[link.key]}
                title={link.title}
                aria-current={isCurrent ? "page" : undefined}
                onClick={(e) =>
                  !isCurrent && handleSiteSwitch(e, urls[link.key])
                }
                className={`whitespace-nowrap font-semibold uppercase tracking-normal transition-all duration-300 hover:scale-110 sm:tracking-wide ${size} ${
                  isCurrent
                    ? "text-white/90 hover:text-white"
                    : "text-white/60 hover:text-white/80 cursor-pointer"
                }`}
              >
                {link.label}
              </a>
            </span>
          );
        })}
      </div>
    </>
  );
}
