"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Clock,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Hero } from "@/components/Hero";
import { useBandContent, useMediaPaths, useShows } from "@/hooks/useConfig";
import { throttle } from "@/lib/performance-utils";

// Lazy load AnimatePresence for lightbox (only loads when user clicks gallery)
const AnimatePresence = lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.AnimatePresence }))
);

// Image orientations (portrait = taller than wide, landscape = wider than tall)
const imageOrientations = [
  "portrait", // 1: 800x1200
  "landscape", // 2: 1200x800
  "portrait", // 3: 799x1200
  "landscape", // 4: 1200x800
  "portrait", // 5: 800x1200
  "portrait", // 6: 800x1200
  "portrait", // 7: 800x1200
  "landscape", // 8: 1200x800
  "portrait", // 9: 800x1200
  "portrait", // 10: 800x1200
  "portrait", // 11: 800x1200
  "portrait", // 12: 800x1200
  "landscape", // 13: 1200x800
  "landscape", // 14: 1200x800
  "landscape", // 15: 1200x800
  "portrait", // 16: 800x1200
  "portrait", // 17: 800x1200
  "landscape", // 18: 1200x800
  "landscape", // 19: 1200x800
  "landscape", // 20: 1200x800
  "landscape", // 21: 1200x800
  "landscape", // 22: 1200x800
  "landscape", // 23: 1200x800
];

// Pattern presets for portrait (tall) images
const portraitPatterns = [
  { row: "span 2", col: "span 1" }, // Tall single
  { row: "span 2", col: "span 2" }, // Tall double width
  { row: "span 1", col: "span 1" }, // Small square
];

// Pattern presets for landscape (wide) images
const landscapePatterns = [
  { row: "span 1", col: "span 2" }, // Wide single
  { row: "span 2", col: "span 2" }, // Large square
  { row: "span 1", col: "span 1" }, // Small square
];

function HomeContent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Configuration hooks
  const content = useBandContent();
  const media = useMediaPaths();
  const { upcoming: upcomingShows } = useShows();

  // Detect desktop for bento grid patterns and check motion preferences
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    const checkMotion = () =>
      setPrefersReducedMotion(
        window.innerWidth < 1024 ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );

    checkDesktop();
    checkMotion();

    const handleResize = () => {
      checkDesktop();
      checkMotion();
    };

    const throttledHandleResize = throttle(handleResize, 200);
    window.addEventListener("resize", throttledHandleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []);

  // Scroll animation refs
  const showsRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  // Shows section - DRAMATIC: big parallax + scale swoosh
  const { scrollYProgress: showsProgress } = useScroll({
    target: showsRef,
    offset: ["start end", "end start"],
  });
  const showsBgY = useTransform(showsProgress, [0, 1], [150, -150]);
  const showsOpacity = useTransform(
    showsProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0.9]
  );
  const showsScale = useTransform(
    showsProgress,
    [0, 0.15, 0.85, 1],
    [0.85, 1, 1, 1.05]
  );
  const showsY = useTransform(showsProgress, [0, 0.15], [100, 0]);

  // Gallery section - DRAMATIC: slide up + scale entrance
  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });
  const galleryOpacity = useTransform(
    galleryProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0.9]
  );
  const galleryY = useTransform(
    galleryProgress,
    [0, 0.2, 0.8, 1],
    [150, 0, 0, -80]
  );
  const galleryScale = useTransform(
    galleryProgress,
    [0, 0.2, 0.8, 1],
    [0.85, 1, 1, 1.05]
  );

  // About section - DRAMATIC: mega parallax + scale entrance (widened trigger window for reliability)
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });
  const aboutBgY = useTransform(aboutProgress, [0, 1], [350, -350]);
  const aboutBgScale = useTransform(aboutProgress, [0, 0.3], [0.8, 1.1]);
  const aboutBgOpacity = useTransform(
    aboutProgress,
    [0, 0.2, 0.9, 1],
    [0, 1, 1, 0.8]
  );
  const aboutOpacity = useTransform(
    aboutProgress,
    [0, 0.25, 0.85, 1],
    [0, 1, 1, 0.9]
  );
  const aboutScale = useTransform(aboutProgress, [0, 0.3], [0.95, 1.0]);
  const aboutY = useTransform(aboutProgress, [0, 0.3], [120, 0]);

  // Gallery images from configuration (must be declared before navigateImage/useEffect)
  const galleryImages = media.gallery.map((path: string) =>
    path.replace("/gallery/", "")
  );

  const getBentoPattern = (index: number) => {
    const orientation = imageOrientations[index] || "portrait";
    const patterns =
      orientation === "portrait" ? portraitPatterns : landscapePatterns;
    return patterns[index % patterns.length];
  };

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(`/gallery/${image}`);
    setSelectedIndex(index);
  };

  const navigateImage = useCallback(
    (dir: "prev" | "next") => {
      setDirection(dir);
      const newIndex =
        dir === "next"
          ? (selectedIndex + 1) % galleryImages.length
          : (selectedIndex - 1 + galleryImages.length) % galleryImages.length;

      setSelectedIndex(newIndex);
      setSelectedImage(`/gallery/${galleryImages[newIndex]}`);
    },
    [selectedIndex, galleryImages]
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigateImage("prev");
      } else if (e.key === "ArrowRight") {
        navigateImage("next");
      } else if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, navigateImage]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full bg-black">
      {/* Hero Section - Static (no scroll lock) */}
      <div className="relative w-full">
        <Hero onScrollToSection={scrollToSection} enableVideo={true} />
      </div>

      {/* Shows Section - DRAMATIC: big parallax + scale swoosh */}
      <motion.section
        ref={showsRef}
        id="shows"
        className="relative flex h-screen w-full overflow-hidden"
        style={{
          opacity: prefersReducedMotion ? 1 : showsOpacity,
          scale: prefersReducedMotion ? 1 : showsScale,
          y: prefersReducedMotion ? 0 : showsY,
          willChange: prefersReducedMotion ? "auto" : "transform, opacity",
        }}
      >
        {/* Parallax background image (moves slower than content) */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: prefersReducedMotion ? 0 : showsBgY,
            willChange: prefersReducedMotion ? "auto" : "transform",
          }}
        >
          <Image
            src="/shows-bg-1920.webp"
            alt="Shows background"
            fill
            priority
            quality={isDesktop ? 80 : 65}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-6 pb-8 pt-12">
          {/* Title Section - Fixed at top */}
          <div className="flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2
                className="mb-6 text-center text-3xl font-light uppercase tracking-widest text-white sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl"
                style={{
                  textShadow:
                    "0 3px 6px rgba(0, 0, 0, 0.95), 0 6px 12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.7)",
                  WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.3)",
                }}
              >
                Shows
              </h2>
            </motion.div>
          </div>

          {/* Shows List - Scrollable */}
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl space-y-4 pb-24">
              {upcomingShows.map((show, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.01, 0.15),
                    ease: "easeOut",
                  }}
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {show.status === "sold-out" ? (
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block cursor-pointer rounded-lg border border-white/10 bg-black/70 p-6 opacity-60 backdrop-blur-md transition-all duration-200 ease-in-out hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex-1">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="text-center md:text-left">
                              <div className="text-2xl font-bold text-white">
                                {show.date.split(",")[0]}
                              </div>
                              <div className="text-sm text-gray-400">
                                {show.date.split(",")[1]}
                              </div>
                            </div>

                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white">
                                {show.venue}
                              </h3>
                              <div className="flex items-center space-x-2 text-gray-400">
                                <MapPin className="h-4 w-4" />
                                <span>{show.city}</span>
                                <span>•</span>
                                <Clock className="h-4 w-4" />
                                <span>{show.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className="inline-flex items-center space-x-2 rounded-full bg-gray-600 px-6 py-2 font-medium text-gray-300">
                            <Ticket className="h-4 w-4" />
                            <span>Sold Out</span>
                          </span>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block cursor-pointer rounded-lg border border-white/10 bg-black/70 p-6 backdrop-blur-md transition-all duration-200 ease-in-out hover:border-emerald-500/60 hover:bg-black/80 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 active:scale-[0.99] active:border-emerald-500/60"
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex-1">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="text-center md:text-left">
                              <div className="text-2xl font-bold text-white">
                                {show.date.split(",")[0]}
                              </div>
                              <div className="text-sm text-gray-400">
                                {show.date.split(",")[1]}
                              </div>
                            </div>

                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white">
                                {show.venue}
                              </h3>
                              <div className="flex items-center space-x-2 text-gray-400">
                                <MapPin className="h-4 w-4" />
                                <span>{show.city}</span>
                                <span>•</span>
                                <Clock className="h-4 w-4" />
                                <span>{show.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 rounded-full bg-white px-6 py-2 font-medium text-black transition-all duration-200 ease-in-out group-hover:bg-emerald-600 group-hover:text-white">
                          <Ticket className="h-4 w-4" />
                          <span>Tickets</span>
                        </div>
                      </div>
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll indicator - Fixed at bottom */}
          <div className="relative h-16 flex-shrink-0">
            <motion.button
              onClick={() => scrollToSection("gallery")}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full p-2 text-white/60 transition-all duration-300 hover:scale-110 hover:bg-amber-900/20 hover:text-white/90 hover:shadow-lg hover:shadow-amber-900/30"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="h-8 w-8 drop-shadow-lg" />
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Gallery Section - DRAMATIC: slide up + scale entrance */}
      <motion.section
        ref={galleryRef}
        id="gallery"
        className="relative min-h-screen w-full overflow-hidden py-16"
        style={{
          opacity: prefersReducedMotion ? 1 : galleryOpacity,
          y: prefersReducedMotion ? 0 : galleryY,
          scale: prefersReducedMotion ? 1 : galleryScale,
          willChange: prefersReducedMotion ? "auto" : "transform, opacity",
        }}
      >
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2
              className="mb-8 text-center text-3xl font-light uppercase tracking-widest text-white sm:mb-12 sm:text-4xl md:mb-16 md:text-5xl lg:text-6xl"
              style={{
                textShadow:
                  "0 3px 6px rgba(0, 0, 0, 0.95), 0 6px 12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.7)",
                WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.3)",
              }}
            >
              Gallery
            </h2>

            {/* Bento Grid */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-4"
                style={{
                  gridAutoRows: "200px",
                }}
              >
                {galleryImages.map((image: string, i: number) => {
                  const pattern = getBentoPattern(i);
                  return (
                    <motion.div
                      key={`gallery-${i}`}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl"
                      style={{
                        gridRow: isDesktop && pattern ? pattern.row : "auto",
                        gridColumn: isDesktop && pattern ? pattern.col : "auto",
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                          duration: 0.4,
                          delay: i * 0.03,
                          ease: "easeOut",
                        },
                      }}
                      viewport={{ once: true, amount: 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.3 },
                      }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleImageClick(image, i)}
                    >
                      {/* Ambient glow effect */}
                      <motion.div
                        className="absolute -inset-2 -z-10 rounded-2xl opacity-0 group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.15) 50%, transparent 70%)",
                          filter: "blur(20px)",
                        }}
                        initial={{ scale: 0.9 }}
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.4 },
                        }}
                      />

                      {/* Image */}
                      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-900">
                        <Image
                          src={`/gallery/${image}`}
                          alt={`Gallery image ${i + 1}`}
                          fill
                          loading={i < 4 ? "eager" : "lazy"}
                          quality={isDesktop ? 80 : 70}
                          className="scale-110 object-cover transition-transform duration-500 group-hover:scale-100"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          draggable={false}
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section - DRAMATIC: mega parallax + scale entrance */}
      <motion.section
        ref={aboutRef}
        id="about"
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden py-20"
        style={{
          opacity: prefersReducedMotion ? 1 : aboutOpacity,
          scale: prefersReducedMotion ? 1 : aboutScale,
          y: prefersReducedMotion ? 0 : aboutY,
          willChange: prefersReducedMotion ? "auto" : "transform, opacity",
        }}
      >
        {/* Parallax background image (slower scroll) */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: prefersReducedMotion ? 1 : aboutBgOpacity,
            y: prefersReducedMotion ? 0 : aboutBgY,
            scale: prefersReducedMotion ? 1 : aboutBgScale,
            willChange: prefersReducedMotion ? "auto" : "transform, opacity",
          }}
        >
          <Image
            src={isDesktop ? "/about-bg-1920.webp" : "/about-bg-1280.webp"}
            alt="About background"
            fill
            loading="lazy"
            quality={isDesktop ? 80 : 65}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="mb-8 text-center text-3xl font-light uppercase tracking-widest text-white sm:mb-10 sm:text-4xl md:mb-12 md:text-5xl lg:text-6xl"
            style={{
              textShadow:
                "0 3px 6px rgba(0, 0, 0, 0.95), 0 6px 12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.7)",
              WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.3)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            About
          </motion.h2>

          {/* Flex container for responsive layout */}
          <div className="flex w-full justify-center lg:justify-start">
            {/* Text content - centered on mobile, left-aligned on desktop */}
            <div className="w-full max-w-3xl lg:w-1/2 lg:max-w-none">
              <div
                className="space-y-4 text-left text-white sm:space-y-6"
                style={{
                  textShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.9), 0 4px 8px rgba(0, 0, 0, 0.7)",
                }}
              >
                {content.description.long
                  .split("\n\n")
                  .map((paragraph: string, i: number) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? "text-lg font-medium leading-relaxed sm:text-xl"
                          : "text-base font-normal leading-relaxed sm:text-lg"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>

            {/* Right section - empty for background visibility on desktop */}
            <div className="hidden lg:block lg:w-1/2"></div>
          </div>
        </div>
      </motion.section>

      {/* Lightbox Modal */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-8"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="relative h-full max-h-[85vh] w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={selectedImage}
                    custom={direction}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = Math.abs(offset.x) * velocity.x;
                      if (swipe > 10000) {
                        navigateImage(offset.x > 0 ? "prev" : "next");
                      } else if (Math.abs(offset.x) > 100) {
                        navigateImage(offset.x > 0 ? "prev" : "next");
                      }
                    }}
                    initial={{
                      x:
                        direction === "next"
                          ? "100%"
                          : direction === "prev"
                            ? "-100%"
                            : 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                    }}
                    exit={{
                      x:
                        direction === "next"
                          ? "-100%"
                          : direction === "prev"
                            ? "100%"
                            : 0,
                      opacity: 0,
                    }}
                    transition={{
                      x: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                      opacity: { duration: 0.5, ease: "easeOut" },
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <Image
                      src={selectedImage}
                      alt="Gallery image"
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Close button */}
                <button
                  className="absolute -top-12 right-0 p-2 text-white transition-colors hover:text-amber-400"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Previous arrow */}
                <motion.button
                  className="absolute left-2 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-colors hover:bg-amber-500/20 sm:left-4 sm:p-4"
                  onClick={() => navigateImage("prev")}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                </motion.button>

                {/* Next arrow */}
                <motion.button
                  className="absolute right-2 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-colors hover:bg-amber-500/20 sm:right-4 sm:p-4"
                  onClick={() => navigateImage("next")}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                </motion.button>

                {/* Image counter */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm font-light tracking-wider text-white/70">
                  {selectedIndex + 1} / {galleryImages.length}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <HomeContent />
    </ErrorBoundary>
  );
}
