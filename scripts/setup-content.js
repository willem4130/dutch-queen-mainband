#!/usr/bin/env node

/**
 * Band Website Content Setup Script
 *
 * Reads user-friendly markdown files and generates proper JSON configuration files
 * No JSON knowledge required - just fill in the markdown forms!
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${"=".repeat(60)}`, "cyan");
  log(`  ${title}`, "bright");
  log("=".repeat(60), "cyan");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

// Parse markdown content sections
function extractContent(markdown, sectionTitle) {
  const regex = new RegExp(
    `###?\\s*${sectionTitle}[\\s\\S]*?\`\`\`([\\s\\S]*?)\`\`\``,
    "i",
  );
  const match = markdown.match(regex);
  return match ? match[1].trim() : "";
}

function extractMultilineContent(markdown, sectionTitle) {
  const regex = new RegExp(
    `###?\\s*${sectionTitle}[\\s\\S]*?\`\`\`([\\s\\S]*?)\`\`\``,
    "i",
  );
  const match = markdown.match(regex);
  return match ? match[1].trim() : "";
}

// Parse band content from 01_BAND_CONTENT.md
function parseBandContent() {
  const contentPath = path.join(__dirname, "..", "01_BAND_CONTENT.md");

  if (!fs.existsSync(contentPath)) {
    logError("01_BAND_CONTENT.md not found!");
    log(
      "Please create 01_BAND_CONTENT.md using the provided template.",
      "yellow",
    );
    process.exit(1);
  }

  const content = fs.readFileSync(contentPath, "utf8");

  // Extract basic information
  const bandName = extractContent(content, "Band Name");
  const tagline = extractContent(content, "Tagline");
  const genre = extractContent(content, "Genre");
  const establishedYear = extractContent(content, "Established Year");

  // Extract descriptions
  const shortDesc = extractMultilineContent(content, "Short Description");
  const mediumDesc = extractMultilineContent(content, "Medium Description");
  const longDesc = extractMultilineContent(content, "Long Description");

  // Extract story elements
  const founding = extractMultilineContent(content, "Founding Story");
  const mission = extractMultilineContent(content, "Mission Statement");
  const vision = extractMultilineContent(content, "Vision");

  // Extract contact info
  const email = extractContent(content, "Email");
  const phone = extractContent(content, "Phone \\(optional\\)");
  const address = extractContent(content, "Address \\(optional\\)");

  // Extract social media
  const facebook = extractContent(content, "Facebook");
  const instagram = extractContent(content, "Instagram");
  const twitter = extractContent(content, "Twitter/X");
  const youtube = extractContent(content, "YouTube");
  const spotify = extractContent(content, "Spotify");
  const bandcamp = extractContent(content, "Bandcamp");
  const tiktok = extractContent(content, "TikTok \\(optional\\)");
  const soundcloud = extractContent(content, "SoundCloud \\(optional\\)");

  // Extract SEO
  const metaTitle = extractContent(content, "Meta Title");
  const metaDescription = extractMultilineContent(content, "Meta Description");
  const keywords = extractContent(content, "Keywords");

  // Extract members (simple parsing - looks for Member sections)
  const members = [];
  const memberMatches = content.matchAll(
    /### Member \d+[\s\S]*?(?=### Member \d+|## \d+\.|$)/g,
  );

  for (const memberSection of memberMatches) {
    const memberText = memberSection[0];
    const name = extractContent(memberText, "Name");
    const role = extractContent(memberText, "Role");
    const bio = extractMultilineContent(memberText, "Bio");
    const photo = extractContent(memberText, "Photo Filename");

    if (name && role) {
      members.push({
        name,
        role,
        bio,
        image: `/content/bands/template-band/assets/members/${photo}`,
      });
    }
  }

  // Extract achievements
  const achievements = [];
  const achievementMatches = content.matchAll(
    /### (\d{4})[\s\S]*?\`\`\`([\\s\\S]*?)\`\`\`/g,
  );

  for (const match of achievementMatches) {
    const year = match[1];
    const achievement = match[2].trim();
    if (achievement && !achievement.includes("Achievement description")) {
      achievements.push({ year, achievement });
    }
  }

  // Extract shows
  const shows = [];
  const showMatches = content.matchAll(
    /### Show \d+[\s\S]*?(?=### Show \d+|## Setup Instructions|$)/g,
  );

  for (const showSection of showMatches) {
    const showText = showSection[0];
    const date = extractContent(showText, "Date");
    const time = extractContent(showText, "Time");
    const venueName = extractContent(showText, "Venue Name");
    const city = extractContent(showText, "City");
    const state = extractContent(showText, "State/Province");
    const country = extractContent(showText, "Country");
    const ticketUrl = extractContent(showText, "Ticket URL");
    const soldOut =
      extractContent(showText, "Sold Out").toLowerCase() === "true";
    const featured =
      extractContent(showText, "Featured Show").toLowerCase() === "true";

    if (date && venueName) {
      shows.push({
        id: `show-${date}`,
        date,
        time,
        venue: { name: venueName, city, state, country },
        ticketUrl: ticketUrl || "",
        soldOut,
        featured,
      });
    }
  }

  return {
    bandName,
    tagline,
    genre,
    establishedYear,
    descriptions: { short: shortDesc, medium: mediumDesc, long: longDesc },
    story: { founding, mission, vision },
    contact: { email, phone, address },
    social: {
      facebook,
      instagram,
      twitter,
      youtube,
      spotify,
      bandcamp,
      tiktok,
      soundcloud,
    },
    seo: {
      metaTitle,
      metaDescription,
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    },
    members,
    achievements,
    shows,
  };
}

// Parse hero configuration
function parseHeroConfig() {
  const heroPath = path.join(__dirname, "..", "02_HERO_CONFIGURATION.md");

  if (!fs.existsSync(heroPath)) {
    logWarning("02_HERO_CONFIGURATION.md not found - using defaults");
    return {
      displayMode: "text",
      textAnimation: "fade-up",
      textGlow: true,
      textGlowColor: "auto",
    };
  }

  const content = fs.readFileSync(heroPath, "utf8");

  return {
    displayMode: extractContent(content, "HERO_DISPLAY_MODE") || "text",
    logoFile: extractContent(content, "HERO_LOGO_FILE") || "hero-logo.png",
    logoAnimation: extractContent(content, "LOGO_ANIMATION") || "fade-scale",
    textAnimation: extractContent(content, "TEXT_ANIMATION") || "fade-up",
    overlayEnhancement:
      extractContent(content, "OVERLAY_ENHANCEMENT").toLowerCase() === "true",
    overlayStyle: extractContent(content, "OVERLAY_STYLE") || "radial-dark",
    overlayIntensity: extractContent(content, "OVERLAY_INTENSITY") || "medium",
    logoGlow: extractContent(content, "LOGO_GLOW").toLowerCase() === "true",
    logoGlowColor: extractContent(content, "LOGO_GLOW_COLOR") || "auto",
    textGlow: extractContent(content, "TEXT_GLOW").toLowerCase() === "true",
    textGlowColor: extractContent(content, "TEXT_GLOW_COLOR") || "auto",
    logoDropShadow:
      extractContent(content, "LOGO_DROP_SHADOW").toLowerCase() === "true",
    animationDuration:
      parseFloat(extractContent(content, "ANIMATION_DURATION")) || 1.2,
    animationDelay:
      parseFloat(extractContent(content, "ANIMATION_DELAY")) || 0.3,
    animationEasing: extractContent(content, "ANIMATION_EASING") || "easeOut",
    mobileScale: parseFloat(extractContent(content, "MOBILE_SCALE")) || 0.7,
    tabletScale: parseFloat(extractContent(content, "TABLET_SCALE")) || 0.85,
  };
}

// Generate JSON files
function generateJSONFiles(data, heroConfig) {
  const bandId = data.bandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const contentDir = path.join(__dirname, "..", "content", "bands", bandId);
  const dataDir = path.join(contentDir, "data");

  // Create directories
  [contentDir, dataDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logSuccess(`Created directory: ${dir}`);
    }
  });

  // Generate band-profile.json
  const bandProfile = {
    id: bandId,
    name: data.bandName,
    tagline: data.tagline,
    genre: data.genre,
    established: data.establishedYear,
    theme: {
      primaryColor: "amber-900",
      secondaryColor: "teal-800",
      accentColor: "purple-600",
      animationIntensity: "full",
      particleEffects: true,
      glowEffects: true,
    },
    hero: heroConfig,
    seo: {
      metaTitle: data.seo.metaTitle || `${data.bandName} | Official Website`,
      metaDescription: data.seo.metaDescription || data.descriptions.short,
      keywords: data.seo.keywords,
      ogImage: `/content/bands/${bandId}/assets/logos/og-image.jpg`,
    },
    branding: {
      logoMain: `/content/bands/${bandId}/assets/logos/main-logo.png`,
      logoIcon: `/content/bands/${bandId}/assets/logos/icon.png`,
      favicon: `/content/bands/${bandId}/assets/logos/favicon.ico`,
    },
  };

  fs.writeFileSync(
    path.join(contentDir, "band-profile.json"),
    JSON.stringify(bandProfile, null, 2),
  );
  logSuccess("Generated: band-profile.json");

  // Generate about.json
  const about = {
    title: "About Us",
    descriptions: data.descriptions,
    story: data.story,
    members: data.members,
    achievements: data.achievements,
  };

  fs.writeFileSync(
    path.join(dataDir, "about.json"),
    JSON.stringify(about, null, 2),
  );
  logSuccess("Generated: data/about.json");

  // Generate contact.json
  const contact = {
    email: data.contact.email,
    phone: data.contact.phone || null,
    address: data.contact.address || null,
  };

  fs.writeFileSync(
    path.join(dataDir, "contact.json"),
    JSON.stringify(contact, null, 2),
  );
  logSuccess("Generated: data/contact.json");

  // Generate social.json
  const social = Object.fromEntries(
    Object.entries(data.social).filter(([, value]) => value && value.trim()),
  );

  fs.writeFileSync(
    path.join(dataDir, "social.json"),
    JSON.stringify(social, null, 2),
  );
  logSuccess("Generated: data/social.json");

  // Generate shows.json
  const shows = {
    upcoming: data.shows,
    past: [],
    settings: {
      showPastShows: true,
      maxUpcomingDisplay: 10,
      maxPastDisplay: 5,
      autoArchiveAfterDays: 7,
    },
  };

  fs.writeFileSync(
    path.join(dataDir, "shows.json"),
    JSON.stringify(shows, null, 2),
  );
  logSuccess("Generated: data/shows.json");

  return bandId;
}

// Validate content
function validateContent(data) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!data.bandName || data.bandName.includes("Your Band Name")) {
    errors.push("Band name is required");
  }
  if (!data.tagline || data.tagline.includes("Your Tagline")) {
    errors.push("Tagline is required");
  }
  if (
    !data.descriptions.short ||
    data.descriptions.short.includes("Write your")
  ) {
    errors.push("Short description is required");
  }
  if (!data.contact.email || data.contact.email.includes("yourband")) {
    errors.push("Valid email is required");
  }

  // Warnings
  if (data.members.length === 0) {
    warnings.push("No band members defined");
  }
  if (data.shows.length === 0) {
    warnings.push("No upcoming shows defined");
  }
  if (!data.social.facebook && !data.social.instagram) {
    warnings.push("No social media links provided");
  }

  return { errors, warnings };
}

// Main execution
function main() {
  logSection("Band Website Content Setup");

  log("\n📖 Reading 01_BAND_CONTENT.md...", "blue");
  const data = parseBandContent();

  log("\n🎨 Reading 02_HERO_CONFIGURATION.md...", "blue");
  const heroConfig = parseHeroConfig();

  log("\n✅ Validating content...", "blue");
  const validation = validateContent(data);

  if (validation.errors.length > 0) {
    logError("\nValidation errors found:");
    validation.errors.forEach((err) => log(`  • ${err}`, "red"));
    log(
      "\nPlease fix these errors in 01_BAND_CONTENT.md and try again.",
      "yellow",
    );
    process.exit(1);
  }

  if (validation.warnings.length > 0) {
    logWarning("\nWarnings (not critical):");
    validation.warnings.forEach((warn) => log(`  • ${warn}`, "yellow"));
  }

  log("\n📝 Generating JSON files...", "blue");
  const bandId = generateJSONFiles(data, heroConfig);

  logSection("Setup Complete! 🎉");

  log(`\nYour band ID: ${bandId}`, "cyan");
  log(`Content location: content/bands/${bandId}/\n`, "cyan");

  log("Next steps:", "bright");
  log("  1. Add media assets (see 03_MEDIA_CHECKLIST.md)");
  log("  2. Create .env.local with: NEXT_PUBLIC_BAND_ID=" + bandId);
  log("  3. Run: npm run dev");
  log("  4. Visit: http://localhost:3000\n");

  logSuccess("Content setup completed successfully!");
}

// Run the script
try {
  main();
} catch (error) {
  logError("\nAn error occurred:");
  console.error(error);
  process.exit(1);
}
