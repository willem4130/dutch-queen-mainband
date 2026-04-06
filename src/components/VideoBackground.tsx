"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface VideoBackgroundProps {
  videos: string[];
  fallbackColor?: string;
  overlayOpacity?: number;
  className?: string;
}

export default function VideoBackground({
  videos,
  fallbackColor = "#2C3E3A",
  overlayOpacity = 0.4,
  className = "",
}: VideoBackgroundProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, [videos]);

  // Rotate through videos if multiple provided
  useEffect(() => {
    if (videos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 30000); // Change video every 30 seconds

    return () => clearInterval(interval);
  }, [videos.length]);

  // Handle video loading
  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn("Autoplay failed:", error);
      });
    }
  };

  const handleVideoError = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    console.error("Video error:", e);
    console.error("Failed to load video:", videos[currentVideoIndex]);
    setIsLoading(false);
    setHasError(true);
  };

  // Don't render on server
  if (!isMounted) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <div
          className="absolute inset-0"
          style={{ backgroundColor: fallbackColor }}
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Fallback background color */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: fallbackColor }}
      />

      {/* Video element - simplified for debugging */}
      {!hasError && videos.length > 0 && (
        <video
          key={currentVideoIndex}
          ref={videoRef}
          className="absolute inset-0 z-10 h-full w-full object-cover"
          style={{ opacity: isLoading ? 0.5 : 1 }}
          autoPlay
          muted
          loop
          playsInline
          poster="/forest-scene.jpg"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
        >
          <source src={videos[currentVideoIndex]} type="video/mp4" />
          <source src={videos[currentVideoIndex]} type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Loading indicator */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="h-16 w-16 rounded-full border-4 border-white/20 border-t-white/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Overlay for better text readability */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E3A]/0 via-[#5D3A1A]/30 to-transparent" />

      {/* Vignette effect */}
      <div className="bg-gradient-radial absolute inset-0 from-transparent via-transparent to-black/40" />
    </div>
  );
}
