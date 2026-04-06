"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  Music,
  Camera,
  Mic2,
  Lightbulb,
  Users,
  Coffee,
  Car,
  Home,
  ExternalLink,
  Mail,
  Phone,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  FileDown,
} from "lucide-react";
import { useProData } from "@/hooks/useConfig";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useState, useEffect, useCallback } from "react";

// Copy to clipboard hook
function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  return { copied, copy };
}

// Intersection observer hook for active section
function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: "-20% 0px -70% 0px" },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [sectionIds]);

  return activeSection;
}

export default function ProPage() {
  const { data, loading, error } = useProData();
  const { copied, copy } = useCopyToClipboard();
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const activeSection = useActiveSection([
    "presskit",
    "technical",
    "hospitality",
    "downloads",
  ]);
  const {
    trackProPageView,
    trackDownload,
    trackLightboxNavigate,
    trackSocialClick,
  } = useAnalytics();

  // Track pro page view on mount
  useEffect(() => {
    if (!loading && data) {
      trackProPageView();
    }
  }, [loading, data, trackProPageView]);

  // Track scroll for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyNav(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateLightbox = useCallback(
    (direction: "prev" | "next") => {
      if (!data?.presskit?.photos) return;
      trackLightboxNavigate({ direction, imageIndex: lightboxIndex });
      const photos = data.presskit.photos;
      const newIndex =
        direction === "next"
          ? (lightboxIndex + 1) % photos.length
          : (lightboxIndex - 1 + photos.length) % photos.length;
      setLightboxIndex(newIndex);
      setLightboxImage(photos[newIndex]);
    },
    [lightboxIndex, data?.presskit?.photos, trackLightboxNavigate],
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxImage || !data?.presskit?.photos) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      else if (e.key === "ArrowRight") navigateLightbox("next");
      else if (e.key === "Escape") setLightboxImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxImage, navigateLightbox]);

  const scrollToSection = (id: string) => {
    trackProPageView({
      section: id as "presskit" | "technical" | "hospitality" | "downloads",
    });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Collect all downloads
  const getAllDownloads = () => {
    if (!data) return [];
    const downloads: { name: string; url: string; type: string }[] = [];

    if (data.presskit?.photos) {
      data.presskit.photos.forEach((photo, i) => {
        downloads.push({
          name: `Press Photo ${i + 1}`,
          url: photo,
          type: "photo",
        });
      });
    }
    if (data.presskit?.logos) {
      data.presskit.logos.forEach((logo, i) => {
        downloads.push({ name: `Logo ${i + 1}`, url: logo, type: "logo" });
      });
    }
    if (data.riders?.technical?.stagePlotUrl) {
      downloads.push({
        name: "Stage Plot",
        url: data.riders.technical.stagePlotUrl,
        type: "document",
      });
    }
    if (data.riders?.technical?.pdfUrl) {
      downloads.push({
        name: "Technical Rider PDF",
        url: data.riders.technical.pdfUrl,
        type: "pdf",
      });
    }
    if (data.riders?.hospitality?.pdfUrl) {
      downloads.push({
        name: "Hospitality Rider PDF",
        url: data.riders.hospitality.pdfUrl,
        type: "pdf",
      });
    }

    return downloads;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center">
        <h1 className="mb-4 text-2xl font-bold text-white">
          Professional Materials
        </h1>
        <p className="mb-8 text-gray-400">
          {error
            ? "Failed to load materials. Please try again later."
            : "No materials available at this time."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>
      </div>
    );
  }

  const { presskit, riders, bandName, contact } = data;
  const downloads = getAllDownloads();

  const navItems = [
    { id: "presskit", label: "Press Kit", icon: FileText },
    { id: "technical", label: "Technical", icon: Mic2 },
    { id: "hospitality", label: "Hospitality", icon: Users },
    { id: "downloads", label: "Downloads", icon: FileDown },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-black to-black">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          {/* Logo */}
          <div className="mx-auto mb-6 h-40 w-72 sm:h-52 sm:w-96">
            <Image
              src="/logo/hero-logo.png"
              alt={bandName}
              width={800}
              height={550}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <h1 className="mb-2 text-3xl font-bold tracking-wide text-white sm:text-4xl">
            {bandName}
          </h1>
          <p className="mb-8 text-lg text-gray-400">Professional Materials</p>

          {/* Contact with copy buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {contact.email && (
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Mail className="h-4 w-4 text-amber-400" />
                <a
                  href={`mailto:${contact.email}`}
                  onClick={() =>
                    trackSocialClick({
                      platform: "email",
                      location: "pro-page",
                    })
                  }
                  className="text-white hover:text-amber-300"
                >
                  {contact.email}
                </a>
                <button
                  onClick={() => {
                    copy(contact.email!, "email");
                    trackSocialClick({
                      platform: "email",
                      location: "pro-page",
                    });
                  }}
                  className="ml-1 rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  title="Copy email"
                >
                  {copied === "email" ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Phone className="h-4 w-4 text-amber-400" />
                <a
                  href={`tel:${contact.phone}`}
                  onClick={() =>
                    trackSocialClick({
                      platform: "phone",
                      location: "pro-page",
                    })
                  }
                  className="text-white hover:text-amber-300"
                >
                  {contact.phone}
                </a>
                <button
                  onClick={() => {
                    copy(contact.phone!, "phone");
                    trackSocialClick({
                      platform: "phone",
                      location: "pro-page",
                    });
                  }}
                  className="ml-1 rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  title="Copy phone"
                >
                  {copied === "phone" ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Sticky Navigation */}
      <AnimatePresence>
        {showStickyNav && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-1 sm:gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                      activeSection === item.id
                        ? "bg-amber-500/20 text-amber-400"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>
              <Link href="/" className="text-sm text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Inline Navigation (visible when sticky is hidden) */}
      <nav className="border-b border-white/10 bg-black/50">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-4 py-3 sm:gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                activeSection === item.id
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Press Kit Section */}
        <motion.section
          id="presskit"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 scroll-mt-20"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/20 p-3">
              <FileText className="h-6 w-6 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Press Kit
            </h2>
          </div>

          {presskit ? (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Bio */}
              {presskit.bio?.full && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
                    Biography
                  </h3>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-300">
                    {presskit.bio.full}
                  </p>
                </div>
              )}

              {/* Photos with Lightbox */}
              {presskit.photos?.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
                    Press Photos
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {presskit.photos.map((photo, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setLightboxImage(photo);
                          setLightboxIndex(i);
                        }}
                        className="group relative aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <Image
                          src={photo}
                          alt={`Press photo ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="text-sm font-medium text-white">
                            View
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Logos */}
              {presskit.logos?.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
                    Logos
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {presskit.logos.map((logo, i) => (
                      <a
                        key={i}
                        href={logo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-gray-300 transition-all hover:border-amber-500/50 hover:bg-amber-500/10"
                      >
                        <Camera className="h-5 w-5 text-amber-400" />
                        Logo {i + 1}
                        <Download className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {presskit.videos?.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
                    Videos
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {presskit.videos.map((video, i) => (
                      <a
                        key={i}
                        href={video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-gray-300 transition-all hover:border-amber-500/50 hover:bg-amber-500/10"
                      >
                        <Music className="h-5 w-5 text-amber-400" />
                        Video {i + 1}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Stats */}
              {presskit.socialStats &&
                Object.keys(presskit.socialStats).length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
                    <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
                      Social Media
                    </h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {Object.entries(presskit.socialStats).map(
                        ([platform, value]) => (
                          <div
                            key={platform}
                            className="rounded-lg border border-white/10 bg-white/5 p-4 text-center"
                          >
                            <p className="text-2xl font-bold text-white">
                              {value}
                            </p>
                            <p className="text-sm capitalize text-gray-400">
                              {platform}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-gray-400">No press kit available yet.</p>
            </div>
          )}
        </motion.section>

        {/* Technical Rider Section */}
        <motion.section
          id="technical"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 scroll-mt-20"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-3">
              <Mic2 className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Technical Rider
            </h2>
          </div>

          {riders?.technical ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {riders.technical.summary && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                    Overview
                  </h3>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {riders.technical.summary}
                  </p>
                </div>
              )}

              {riders.technical.sound?.requirements && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Mic2 className="h-5 w-5 text-blue-400" />
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400">
                      Sound
                    </h3>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {riders.technical.sound.requirements}
                  </p>
                </div>
              )}

              {riders.technical.lighting && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400">
                      Lighting
                    </h3>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {riders.technical.lighting}
                  </p>
                </div>
              )}

              {riders.technical.stage && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                    Stage Requirements
                  </h3>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {riders.technical.stage}
                  </p>
                </div>
              )}

              {riders.technical.backline && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                    Backline
                  </h3>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {riders.technical.backline}
                  </p>
                </div>
              )}

              {riders.technical.stagePlotUrl && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
                    Stage Plot
                  </h3>
                  <a
                    href={riders.technical.stagePlotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-video overflow-hidden rounded-lg border border-white/10 transition-all hover:border-blue-500/50"
                  >
                    <Image
                      src={riders.technical.stagePlotUrl}
                      alt="Stage plot"
                      fill
                      className="object-contain"
                    />
                  </a>
                </div>
              )}

              {riders.technical.pdfUrl && (
                <div className="lg:col-span-2">
                  <a
                    href={riders.technical.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackDownload({
                        fileName: "Technical Rider PDF",
                        fileType: "pdf",
                      })
                    }
                    className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-500"
                  >
                    <Download className="h-6 w-6" />
                    Download Technical Rider PDF
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-gray-400">No technical rider available yet.</p>
            </div>
          )}
        </motion.section>

        {/* Hospitality Rider Section */}
        <motion.section
          id="hospitality"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 scroll-mt-20"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-green-500/20 p-3">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Hospitality Rider
            </h2>
          </div>

          {riders?.hospitality ? (
            <div className="grid gap-6 md:grid-cols-2">
              {riders.hospitality.summary && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 md:col-span-2">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                    Overview
                  </h3>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {riders.hospitality.summary}
                  </p>
                </div>
              )}

              {riders.hospitality.dressing && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Home className="h-5 w-5 text-green-400" />
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400">
                      Dressing Room
                    </h3>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {riders.hospitality.dressing}
                  </p>
                </div>
              )}

              {riders.hospitality.catering && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-orange-400" />
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400">
                      Catering
                    </h3>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {riders.hospitality.catering}
                  </p>
                </div>
              )}

              {riders.hospitality.accommodation && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                    Accommodation
                  </h3>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {riders.hospitality.accommodation}
                  </p>
                </div>
              )}

              {riders.hospitality.parking && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Car className="h-5 w-5 text-purple-400" />
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400">
                      Parking
                    </h3>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {riders.hospitality.parking}
                  </p>
                </div>
              )}

              {riders.hospitality.pdfUrl && (
                <div className="md:col-span-2">
                  <a
                    href={riders.hospitality.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackDownload({
                        fileName: "Hospitality Rider PDF",
                        fileType: "pdf",
                      })
                    }
                    className="inline-flex items-center gap-3 rounded-lg bg-green-600 px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-green-500"
                  >
                    <Download className="h-6 w-6" />
                    Download Hospitality Rider PDF
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-gray-400">
                No hospitality rider available yet.
              </p>
            </div>
          )}
        </motion.section>

        {/* Download Center */}
        <motion.section
          id="downloads"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-20"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/20 p-3">
              <FileDown className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Download Center
            </h2>
          </div>

          {downloads.length > 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="mb-6 text-gray-400">
                All available materials for download:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {downloads.map((download, i) => (
                  <a
                    key={i}
                    href={download.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackDownload({
                        fileName: download.name,
                        fileType: download.type as
                          | "photo"
                          | "logo"
                          | "pdf"
                          | "document"
                          | "other",
                      })
                    }
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-purple-500/50 hover:bg-purple-500/10"
                  >
                    {download.type === "photo" && (
                      <Camera className="h-5 w-5 text-amber-400" />
                    )}
                    {download.type === "logo" && (
                      <FileText className="h-5 w-5 text-blue-400" />
                    )}
                    {download.type === "document" && (
                      <FileText className="h-5 w-5 text-green-400" />
                    )}
                    {download.type === "pdf" && (
                      <FileText className="h-5 w-5 text-red-400" />
                    )}
                    <span className="flex-1 text-white">{download.name}</span>
                    <Download className="h-4 w-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-gray-400">No downloads available yet.</p>
            </div>
          )}
        </motion.section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>
            This page is intended for venues, promoters, and press only.
            <br />
            For booking inquiries, please contact us at{" "}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="text-amber-400 hover:text-amber-300"
              >
                {contact.email}
              </a>
            )}
          </p>
        </footer>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && presskit?.photos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              onClick={() => setLightboxImage(null)}
            >
              <X className="h-8 w-8" />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <motion.div
              key={lightboxImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage}
                alt="Press photo"
                fill
                className="object-contain"
              />
            </motion.div>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60">
              {lightboxIndex + 1} / {presskit.photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
