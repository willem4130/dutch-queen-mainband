# Media Placement Guide - The Dutch Queen Unplugged

This guide shows you exactly where to place your new images and video files.

---

## ✅ COMPLETED STEPS

1. **Tour Dates** - Updated with 13 shows from 2026 (Jan 28 - Apr 23)
2. **About Text** - Updated with new descriptions from live website
3. **Tagline** - Changed to "We will ROCK you."

---

## 📸 GALLERY IMAGES (14 images needed)

### What to provide:

- **14 images** in any format (JPG, PNG, etc.)
- Any size/resolution (I'll optimize them)

### Where to place them:

```
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/gallery/
```

### Naming convention:

```
gallery-1.jpg  (or .png, .webp - I'll convert)
gallery-2.jpg
gallery-3.jpg
...
gallery-14.jpg
```

### What I'll do for you:

1. Compress and optimize each image
2. Create WebP versions for modern browsers (gallery-1.webp, etc.)
3. Keep JPG versions as fallback
4. Test bento grid layout

### Current placeholders:

The current gallery-1.jpg through gallery-14.jpg will be replaced with your new images.

---

## 🎥 INTRO/HERO VIDEO (1 video needed)

### What to provide:

- **1 high-quality video file** (original/uncompressed)
- Recommended: MP4 or MOV format
- Any resolution (preferably 1920x1080 or higher)

### Where I'll process it:

I'll create optimized versions and place them in:

```
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/videos/
```

### Files I'll create (matching current structure):

```
hero-desktop.mp4        (1920x1080, web-optimized)
hero-desktop.webm       (WebM version for smaller file size)
hero-tablet.mp4         (1280x720, tablet size)
hero-tablet.webm
hero-mobile.mp4         (720x480, mobile size)
hero-mobile.webm
poster-desktop.jpg      (fallback image - extracted frame)
poster-tablet.jpg
poster-mobile.jpg
```

### Specifications I'll match:

- **Desktop:** 1920x1080, 30fps, H.264/WebM
- **Tablet:** 1280x720, 30fps
- **Mobile:** 720x480, 30fps
- **Codecs:** H.264 for MP4, VP9 for WebM
- **Optimization:** Web-ready compression while maintaining quality

### How to provide the video:

- Put the original file in: `/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/video-originals/`
- Name it: `hero-original.mp4` (or whatever extension)
- I'll process it to create all responsive versions

---

## 🖼️ BACKGROUND IMAGES (2 images needed)

### 1. Shows/Tour Section Background

**What to provide:**

- 1 high-quality image
- Recommended size: 1920x1080 or larger
- Should work well with text overlay (dark or neutral)

**Where I'll place optimized versions:**

```
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/shows-bg-1280.webp
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/shows-bg-1920.webp
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/shows-bg-2560.webp
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/shows-bg-1280.jpg
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/shows-bg-1920.jpg
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/shows-bg-2560.jpg
```

**Also backup in content folder:**

```
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/content/bands/the-dutch-queen-unplugged/assets/backgrounds/shows-bg.jpg
```

**How to provide:**

- Put original in: `/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/content/bands/the-dutch-queen-unplugged/assets/backgrounds/`
- Name it: `shows-bg-original.jpg` (or .png)

---

### 2. About Section Background

**What to provide:**

- 1 high-quality image
- Recommended size: 1920x1080 or larger
- Should work well with text overlay

**Where I'll place optimized versions:**

```
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/about-bg-1280.webp
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/about-bg-1920.webp
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/about-bg-2560.webp
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/about-bg-1280.jpg
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/about-bg-1920.jpg
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/public/about-bg-2560.jpg
```

**Also backup in content folder:**

```
/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/content/bands/the-dutch-queen-unplugged/assets/backgrounds/about-bg.jpg
```

**How to provide:**

- Put original in: `/Users/willemvandenberg/Queenwebsite_v3_UNPLUGGED/content/bands/the-dutch-queen-unplugged/assets/backgrounds/`
- Name it: `about-bg-original.jpg` (or .png)

---

## 📋 QUICK CHECKLIST

When you're ready to provide media, place files here:

### For Gallery (14 images):

```
📁 /public/gallery/
  ├── your-image-1.jpg  → I'll rename to gallery-1.jpg
  ├── your-image-2.jpg  → I'll rename to gallery-2.jpg
  └── ... (14 total)
```

### For Hero Video (1 video):

```
📁 /video-originals/
  └── hero-original.mp4  → I'll process to 6 versions
```

### For Background Images (2 images):

```
📁 /content/bands/the-dutch-queen-unplugged/assets/backgrounds/
  ├── shows-bg-original.jpg   → I'll process to 6 versions
  └── about-bg-original.jpg   → I'll process to 6 versions
```

---

## 🚀 NEXT STEPS

Once you provide the files:

1. **Gallery images** - Tell me "I've added the gallery images" and I'll:
   - Rename them to gallery-1.jpg through gallery-14.jpg
   - Optimize and create WebP versions
   - Verify they display correctly

2. **Hero video** - Tell me "I've added the hero video" and I'll:
   - Create desktop/tablet/mobile versions
   - Generate WebM and MP4 formats
   - Extract poster frames
   - Replace in /public/videos/

3. **Background images** - Tell me "I've added the background images" and I'll:
   - Create responsive versions (1280px, 1920px, 2560px)
   - Generate WebP and JPG formats
   - Place in /public/ and content/bands/ folders
   - Verify they display correctly on the site

---

## 🔧 ALTERNATIVE: Direct Placement (Skip Optimization)

If you want to skip optimization and place files directly:

### Gallery Images (manual):

Place 14 files directly in `/public/gallery/` named `gallery-1.jpg` through `gallery-14.jpg`

### Hero Video (manual):

Place 6 video files + 3 poster images in `/public/videos/` with exact names above

### Background Images (manual):

Place responsive versions in `/public/` with exact names above

**Note:** Manual placement means no optimization, no WebP generation, and larger file sizes.

---

## ✨ OPTIMIZATION BENEFITS

When I optimize for you:

- **60-80% smaller file sizes** with WebP format
- **Faster page loads** with responsive images
- **Better mobile experience** with appropriate sizes
- **Modern browser support** with format fallbacks
- **Maintained quality** using smart compression

---

## 📞 WHEN YOU'RE READY

Just tell me:

- "I've added the gallery images"
- "I've added the hero video as hero-original.mp4"
- "I've added the background images"

Or ask:

- "Can you check if my files are in the right place?"
- "How do I optimize [specific file type]?"
- "I'm ready to start with [gallery/video/backgrounds]"
