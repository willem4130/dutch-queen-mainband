"use client";

import { useBandContentAsync } from "@/hooks/useConfig";

export function Footer() {
  // Use async hook to get live data from CMS API
  const { content } = useBandContentAsync();

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">{content.bandName}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
