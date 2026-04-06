# The Dutch Queen Unplugged - Customization Guide

This website is a complete clone of the full band website, configured for the Unplugged acoustic version. This guide shows you exactly which files to modify to customize it.

## Project Information

- **Local Directory**: `~/Queenwebsite_v3_UNPLUGGED`
- **GitHub Repository**: https://github.com/willem4130/Queenwebsite_v3_UNPLUGGED
- **Vercel Project**: (to be set up)
- **Band ID**: `the-dutch-queen-unplugged`

## Files You Need to Customize

### 1. Hero Video (REQUIRED)

Replace these video files with your unplugged performance footage:

```
public/videos/
├── hero-desktop.mp4      # Desktop video (1920x1080)
├── hero-desktop.webm     # Desktop video WebM format
├── hero-tablet.mp4       # Tablet video (1920x1080)
├── hero-tablet.webm      # Tablet video WebM format
├── hero-mobile.mp4       # Mobile video (1920:1080)
├── hero-mobile.webm      # Mobile video WebM format
├── poster-desktop.jpg    # Video poster/thumbnail
├── poster-tablet.jpg     # Tablet poster
└── poster-mobile.jpg     # Mobile poster
```

**How to optimize your videos**: See `VIDEO_OPTIMIZATION_GUIDE.md` in the root directory.

### 2. Background Images (OPTIONAL)

Replace these background images if desired:

```
public/
├── about-bg.jpg          # About section background
├── about-bg.webp         # About section WebP format
├── shows-bg.jpg          # Shows section background
├── shows-bg.webp         # Shows section WebP format
├── hero-bg.jpg           # Hero fallback background
└── hero-bg.webp          # Hero fallback WebP format
```

Also update the source images:

```
content/bands/the-dutch-queen-unplugged/assets/backgrounds/
├── about-bg.jpg
└── shows-bg.jpg
```

### 3. About Section Text (REQUIRED)

Edit the about content to reflect the unplugged nature:

**File**: `content/bands/the-dutch-queen-unplugged/data/about.json`

```json
{
  "title": "Over The Dutch Queen Unplugged",
  "intro": "Your intro text about the unplugged version...",
  "description": [
    "Paragraph 1 about your acoustic approach...",
    "Paragraph 2 about the intimate setting...",
    "Paragraph 3 about the unplugged experience..."
  ],
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
}
```

### 4. Gallery Images (REQUIRED)

Replace gallery images with unplugged performance photos:

```
public/gallery/
├── gallery-1.jpg
├── gallery-1.webp
├── gallery-2.jpg
├── gallery-2.webp
├── ... (up to gallery-14)
```

Also update source images:

```
content/bands/the-dutch-queen-unplugged/assets/gallery/
├── gallery-1.jpg
├── gallery-2.jpg
├── ... (add as many as needed)
```

### 5. Optional: Show Dates

If you have different show dates for the unplugged version:

**File**: `content/bands/the-dutch-queen-unplugged/data/shows.json`

```json
{
  "upcomingShows": [
    {
      "date": "2025-11-15",
      "venue": "Venue Name",
      "city": "City",
      "country": "NL",
      "ticketUrl": "https://tickets.example.com"
    }
  ]
}
```

### 6. Optional: Contact Information

If the unplugged band has different contact info:

**File**: `content/bands/the-dutch-queen-unplugged/data/contact.json`

## Quick Customization Checklist

- [ ] Replace hero video files (desktop, tablet, mobile - MP4 and WebM)
- [ ] Replace video poster images
- [ ] Update About section text in `about.json`
- [ ] Replace gallery images (14 images minimum)
- [ ] Optional: Update background images
- [ ] Optional: Update show dates
- [ ] Optional: Update contact information
- [ ] Test locally: `npm run dev`
- [ ] Deploy to Vercel

## Testing Locally

1. Navigate to the project:

   ```bash
   cd ~/Queenwebsite_v3_UNPLUGGED
   ```

2. Install dependencies (if not already done):

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Deployment to Vercel

The Vercel project will be set up automatically. Just push your changes to GitHub:

```bash
git add .
git commit -m "Update unplugged content"
git push
```

Vercel will automatically deploy your changes.

## Important Notes

- **DO NOT modify any code files** (only content and media assets)
- Keep the same image dimensions as the originals
- Use WebP format for better performance
- Test on mobile, tablet, and desktop before deploying
- This project is completely independent from the main website

## Need Help?

See the other documentation files:

- `VIDEO_OPTIMIZATION_GUIDE.md` - How to optimize video files
- `01_BAND_CONTENT.md` - Detailed content structure guide
- `02_HERO_CONFIGURATION.md` - Hero section configuration
- `03_MEDIA_CHECKLIST.md` - Complete media asset checklist
