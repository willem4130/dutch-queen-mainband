"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { throttle } from "@/lib/performance-utils";

interface HeroProps {
  onScrollToSection?: (sectionId: string) => void;
  enableVideo?: boolean;
}

export function Hero({ onScrollToSection, enableVideo = false }: HeroProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [hasAudio, setHasAudio] = useState(true); // Assume true, our videos have audio

  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [showPoster, setShowPoster] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect network quality and Save Data mode
  useEffect(() => {
    // Check for Save Data mode
    interface NetworkInformation {
      saveData?: boolean;
      effectiveType?: string;
    }

    const connection = (navigator as { connection?: NetworkInformation })
      .connection;

    if (connection?.saveData) {
      setShouldLoadVideo(false);
      return;
    }

    // Detect network quality - handled silently for production
    if (connection) {
      // Network quality detected, video optimized accordingly
    }

    setShouldLoadVideo(true);
  }, []);

  // Detect device type on mount (client-side only)
  useEffect(() => {
    const width = window.innerWidth;
    if (width < 768) {
      setDeviceType("mobile");
    } else if (width <= 1024) {
      setDeviceType("tablet");
    } else {
      setDeviceType("desktop");
    }
  }, []);

  // Ensure scroll is never blocked on mount
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }, []);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
      } else if (width <= 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    checkDevice();
    const throttledCheckDevice = throttle(checkDevice, 150);
    window.addEventListener("resize", throttledCheckDevice, { passive: true });
    return () => window.removeEventListener("resize", throttledCheckDevice);
  }, []);

  // Handle video ready state and poster timing
  useEffect(() => {
    if (!enableVideo || !videoRef.current) return;

    const video = videoRef.current;

    const handleCanPlay = () => {
      setVideoReady(true);
    };

    const handleLoadedData = () => {
      setVideoReady(true);
    };

    const handleLoadedMetadata = () => {
      // Video metadata loaded
    };

    const handlePlaying = () => {
      // Video is now playing
    };

    const handleError = () => {
      setVideoReady(false);
      setShowPoster(true); // Show poster on error as fallback
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
    };
  }, [enableVideo]);

  // Manage poster visibility based on device and video ready state
  useEffect(() => {
    if (!enableVideo) return;

    // Show audio controls
    setHasAudio(true);

    // Don't show poster - let video play immediately
    setShowPoster(false);
  }, [enableVideo, deviceType, videoReady]);

  useEffect(() => {
    if (!videoRef.current) return;
    // Set volume to 100% for when user unmutes
    videoRef.current.volume = 1.0;
  }, []);

  // Intersection Observer for smart autoplay/pause
  useEffect(() => {
    if (!videoRef.current || !enableVideo) return;

    const video = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Video is visible, play it
          video.play().catch(() => {
            // Video autoplay prevented
          });
        } else {
          // Video is not visible, pause to save resources
          video.pause();
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of video is visible
        rootMargin: "0px",
      }
    );

    const section = document.getElementById("home");
    if (section) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, [enableVideo]);

  const scrollToSection = (sectionId: string) => {
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const newMutedState = !isMuted;

    video.muted = newMutedState;
    video.volume = volume;
    setIsMuted(newMutedState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen w-full max-w-full overflow-hidden"
      style={{ position: "relative", touchAction: "pan-y" }}
    >
      {/* Background video */}
      <div
        className="absolute inset-0 min-h-screen overflow-hidden"
        style={{ pointerEvents: "none" }}
      >
        <div className="relative h-full min-h-screen w-full">
          {shouldLoadVideo ? (
            <>
              {/* Video with WebM and MP4 sources for optimal performance */}
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={
                  deviceType === "mobile"
                    ? "/videos/poster-mobile.jpg?v=20251104"
                    : deviceType === "tablet"
                      ? "/videos/poster-desktop.jpg?v=20251104"
                      : "/videos/poster-desktop.jpg?v=20251104"
                }
                className="absolute inset-0 z-0 h-full min-h-full w-full min-w-full object-cover"
              >
                {/* WebM format first (65% smaller, better compression) */}
                <source
                  src={
                    deviceType === "mobile"
                      ? "/videos/hero-mobile.webm?v=20251104"
                      : deviceType === "tablet"
                        ? "/videos/hero-tablet.webm?v=20251104"
                        : "/videos/hero-desktop.webm?v=20251104"
                  }
                  type="video/webm"
                />
                {/* MP4 fallback for older browsers */}
                <source
                  src={
                    deviceType === "mobile"
                      ? "/videos/hero-mobile.mp4?v=20251104"
                      : deviceType === "tablet"
                        ? "/videos/hero-tablet.mp4?v=20251104"
                        : "/videos/hero-desktop.mp4?v=20251104"
                  }
                  type="video/mp4"
                />
                {/* Fallback text for browsers that don't support video */}
                Your browser does not support the video tag.
              </video>
            </>
          ) : (
            // Fallback static poster for Save Data mode
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  deviceType === "mobile"
                    ? "/videos/poster-mobile.jpg"
                    : "/videos/poster-desktop.jpg"
                }
                alt="The Dutch Queen"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <p className="text-sm text-white/60">
                  Video disabled (Data Saver mode)
                </p>
              </div>
            </div>
          )}

          {/* Poster image overlay - shows on error or when video is loading */}
          <AnimatePresence>
            {showPoster && (
              <motion.div
                key="poster"
                className="absolute inset-0 z-20"
                style={{
                  willChange: "opacity",
                  transform: "translateZ(0)", // Force GPU layer for smooth animation
                }}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    deviceType === "mobile"
                      ? "/videos/poster-mobile.jpg"
                      : "/videos/poster-desktop.jpg"
                  }
                  alt="The Dutch Queen"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex h-screen flex-col items-center justify-center">
        {/* Audio controls - only show if video has audio */}
        {hasAudio && (
          <div className="absolute bottom-6 left-6 flex items-center gap-3 md:bottom-8 md:left-8">
            {/* Volume slider - only show when unmuted */}
            {!isMuted && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 cursor-pointer accent-amber-600 md:w-24"
                  aria-label="Volume control"
                />
                <span className="text-xs tabular-nums text-white/70">
                  {Math.round(volume * 100)}%
                </span>
              </motion.div>
            )}

            {/* Mute toggle button */}
            <motion.button
              onClick={toggleMute}
              className="rounded-full bg-black/30 p-3 text-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-amber-900/40 hover:text-white hover:shadow-lg hover:shadow-amber-900/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 drop-shadow-lg" />
              ) : (
                <Volume2 className="h-5 w-5 drop-shadow-lg" />
              )}
            </motion.button>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-8" style={{ position: "absolute" }}>
          <motion.button
            onClick={() => scrollToSection("shows")}
            className="rounded-full p-2 text-white/60 transition-all duration-500 hover:bg-amber-900/20 hover:text-white/90 hover:shadow-lg hover:shadow-amber-900/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { duration: 0.6, ease: "easeOut" },
              y: { duration: 2, repeat: Infinity },
            }}
          >
            <ChevronDown className="h-8 w-8 drop-shadow-lg" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
