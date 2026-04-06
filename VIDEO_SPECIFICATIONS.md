# Hero Video Specifications - EXACT Configuration

**CRITICAL:** These specifications are for working videos. Follow EXACTLY when creating new videos.

## Overview

The hero section uses device-specific video variants for optimal performance and rendering. All current videos render correctly with these exact specifications.

---

## Video Files Required

### 1. DESKTOP VIDEO

**File:** `public/videos/hero-desktop.mp4`
**File Size:** 34MB (35,884,637 bytes)
**Duration:** 38.8 seconds

#### Video Stream Specifications

- **Codec:** H.264 / AVC (libx264)
- **Profile:** Constrained Baseline
- **Resolution:** 1920x1080 (Full HD)
- **Aspect Ratio:** 16:9
- **Frame Rate:** 30 fps (constant)
- **Bitrate:** 7.27 Mbps (7,266,475 bps)
- **Pixel Format:** yuv420p
- **Color Space:** bt709
- **Color Range:** tv
- **Level:** 3.1
- **Progressive:** Yes
- **B-Frames:** 0 (no B-frames)
- **Reference Frames:** 1

#### Audio Stream Specifications

- **Codec:** AAC-LC (Advanced Audio Coding - Low Complexity)
- **Sample Rate:** 44,100 Hz
- **Channels:** 2 (Stereo)
- **Bitrate:** 125 kbps (125,266 bps)
- **Sample Format:** fltp (floating point)

#### Container

- **Format:** MP4 (QuickTime/MOV compatible)
- **Compatible Brands:** isom, iso2, avc1, mp41

---

### 2. TABLET VIDEO

**File:** `public/videos/hero-tablet.mp4`
**File Size:** 12MB (13,078,785 bytes)
**Duration:** 24.2 seconds

#### Video Stream Specifications

- **Codec:** H.264 / AVC (libx264)
- **Profile:** Constrained Baseline
- **Resolution:** 1920x1080 (Full HD)
- **Aspect Ratio:** 16:9
- **Frame Rate:** 30 fps (constant)
- **Bitrate:** 4.20 Mbps (4,195,286 bps)
- **Pixel Format:** yuv420p
- **Color Space:** bt709
- **Color Range:** tv
- **Level:** 3.1
- **Progressive:** Yes
- **B-Frames:** 0 (no B-frames)
- **Reference Frames:** 1

#### Audio Stream Specifications

- **Codec:** AAC-LC (Advanced Audio Coding - Low Complexity)
- **Sample Rate:** 44,100 Hz
- **Channels:** 2 (Stereo)
- **Bitrate:** 121 kbps (120,818 bps)
- **Sample Format:** fltp (floating point)

#### Container

- **Format:** MP4 (QuickTime/MOV compatible)
- **Compatible Brands:** isom, iso2, avc1, mp41

---

### 3. MOBILE VIDEO

**File:** `public/videos/hero-mobile.mp4`
**File Size:** 6.9MB (7,232,422 bytes)
**Duration:** 24.2 seconds

#### Video Stream Specifications

- **Codec:** H.264 / AVC (libx264)
- **Profile:** Constrained Baseline
- **Profile:** Constrained Baseline
- **Resolution:** 1920x1080 (Full HD)
- **Aspect Ratio:** 16:9
- **Frame Rate:** 30 fps (constant)
- **Bitrate:** 2.26 Mbps (2,262,606 bps)
- **Pixel Format:** yuv420p
- **Color Space:** bt709
- **Color Range:** tv
- **Level:** 3.1
- **Progressive:** Yes
- **B-Frames:** 0 (no B-frames)
- **Reference Frames:** 1

#### Audio Stream Specifications

- **Codec:** AAC-LC (Advanced Audio Coding - Low Complexity)
- **Sample Rate:** 44,100 Hz
- **Channels:** 2 (Stereo)
- **Bitrate:** 121 kbps (120,818 bps)
- **Sample Format:** fltp (floating point)

#### Container

- **Format:** MP4 (QuickTime/MOV compatible)
- **Compatible Brands:** isom, iso2, avc1, mp41

---

## WebM Fallback Videos (Optional)

### Desktop WebM

- **File:** `public/videos/hero-desktop.webm`
- **Size:** 14MB

### Tablet WebM

- **File:** `public/videos/hero-tablet.webm`
- **Size:** 5.8MB

### Mobile WebM

- **File:** `public/videos/hero-mobile.webm`
- **Size:** 4.6MB

**Note:** WebM format is optional but recommended for modern browsers. MP4 is the primary format.

---

## Poster Images (Required)

Poster images display while video loads or if playback fails.

### Desktop Poster

- **File:** `public/videos/poster-desktop.jpg`
- **Resolution:** 1920x1080
- **Format:** JPEG

### Tablet Poster

- **File:** `public/videos/poster-tablet.jpg`
- **Resolution:** 1920x1080
- **Format:** JPEG

### Mobile Poster

- **File:** `public/videos/poster-mobile.jpg`
- **Resolution:** 1920x1080
- **Format:** JPEG

---

## Device Breakpoints

The application automatically selects videos based on viewport width:

- **Mobile:** Width < 768px → `hero-mobile.mp4`
- **Tablet:** Width 768px - 1024px → `hero-tablet.mp4`
- **Desktop:** Width > 1024px → `hero-desktop.mp4`

Defined in: `src/components/Hero.tsx:52-59`

---

## FFmpeg Encoding Commands

Use these exact commands to encode new videos with matching specifications:

### Desktop Video

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -profile:v baseline \
  -level 3.1 \
  -pix_fmt yuv420p \
  -r 30 \
  -b:v 7.27M \
  -maxrate 7.27M \
  -bufsize 14.54M \
  -vf "scale=1920:1080:flags=lanczos" \
  -bf 0 \
  -refs 1 \
  -c:a aac \
  -b:a 125k \
  -ar 44100 \
  -ac 2 \
  -movflags +faststart \
  -colorspace bt709 \
  -color_primaries bt709 \
  -color_trc bt709 \
  public/videos/hero-desktop.mp4
```

### Tablet Video

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -profile:v baseline \
  -level 3.1 \
  -pix_fmt yuv420p \
  -r 30 \
  -b:v 4.20M \
  -maxrate 4.20M \
  -bufsize 8.40M \
  -vf "scale=1920:1080:flags=lanczos" \
  -bf 0 \
  -refs 1 \
  -c:a aac \
  -b:a 121k \
  -ar 44100 \
  -ac 2 \
  -movflags +faststart \
  -colorspace bt709 \
  -color_primaries bt709 \
  -color_trc bt709 \
  public/videos/hero-tablet.mp4
```

### Mobile Video

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -profile:v baseline \
  -level 3.1 \
  -pix_fmt yuv420p \
  -r 30 \
  -b:v 2.26M \
  -maxrate 2.26M \
  -bufsize 4.52M \
  -vf "scale=1920:1080:flags=lanczos" \
  -bf 0 \
  -refs 1 \
  -c:a aac \
  -b:a 121k \
  -ar 44100 \
  -ac 2 \
  -movflags +faststart \
  -colorspace bt709 \
  -color_primaries bt709 \
  -color_trc bt709 \
  public/videos/hero-mobile.mp4
```

### Generate Poster Images

```bash
# Desktop poster (at 2 seconds)
ffmpeg -i public/videos/hero-desktop.mp4 -ss 00:00:02 -vframes 1 -q:v 2 public/videos/poster-desktop.jpg

# Tablet poster
ffmpeg -i public/videos/hero-tablet.mp4 -ss 00:00:02 -vframes 1 -q:v 2 public/videos/poster-tablet.jpg

# Mobile poster
ffmpeg -i public/videos/hero-mobile.mp4 -ss 00:00:02 -vframes 1 -q:v 2 public/videos/poster-mobile.jpg
```

---

## Critical Encoding Parameters

These parameters are ESSENTIAL for browser compatibility:

### ✅ MUST HAVE

- **Profile:** `baseline` (not main or high) - Maximum browser compatibility
- **Pixel Format:** `yuv420p` - Standard chroma subsampling
- **B-Frames:** `0` - No bi-directional frames (baseline requirement)
- **Reference Frames:** `1` - Single reference (baseline requirement)
- **Level:** `3.1` - Supports 1080p at 30fps
- **Faststart:** `-movflags +faststart` - Enables streaming/progressive download
- **Color Space:** `bt709` - Standard HD color space

### ⚠️ COMMON MISTAKES TO AVOID

- ❌ Using `profile:v main` or `high` - causes playback issues
- ❌ Omitting `-movflags +faststart` - prevents streaming
- ❌ Using variable frame rate - causes sync issues
- ❌ Wrong pixel format (yuv422p, yuv444p) - incompatible with web
- ❌ Including B-frames - breaks baseline profile
- ❌ Multiple reference frames - breaks baseline profile

---

## Validation Checklist

Before deploying new videos, verify:

- [ ] File sizes: Desktop ~34MB, Tablet ~12MB, Mobile ~7MB
- [ ] Duration matches (desktop can be longer)
- [ ] Resolution: 1920x1080 for all variants
- [ ] Frame rate: Constant 30fps
- [ ] Codec profile: H.264 Baseline
- [ ] Pixel format: yuv420p
- [ ] Faststart flag enabled (check with `ffprobe`)
- [ ] No B-frames (check with `ffprobe`)
- [ ] Color space: bt709
- [ ] Audio: AAC stereo, 44.1kHz
- [ ] Container: MP4 with compatible brands
- [ ] Poster images generated
- [ ] Test playback in Chrome, Safari, Firefox, and mobile browsers

---

## Testing Commands

### Check video specifications:

```bash
ffprobe -v error -show_format -show_streams public/videos/hero-desktop.mp4
```

### Verify faststart flag:

```bash
ffprobe -v error -show_format public/videos/hero-desktop.mp4 | grep "fast"
```

### Check for B-frames (should be 0):

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=has_b_frames -of default=noprint_wrappers=1:nokey=1 public/videos/hero-desktop.mp4
```

---

## Component Configuration

Videos are loaded in: `src/components/Hero.tsx`

**Cache busting query parameters:**

- Desktop: `?v=20251104`
- Tablet: `?v=20251201`
- Mobile: `?v=20251104`

Update these version numbers when replacing videos to force browser cache refresh.

---

## Performance Notes

- Desktop video is longer (38.8s) with higher bitrate for better quality
- Tablet/mobile videos are shorter (24.2s) with lower bitrates for faster loading
- All maintain 1920x1080 resolution but use bitrate to control file size
- Constrained Baseline profile ensures maximum device compatibility
- Progressive download (faststart) allows playback to start before full download

---

## Browser Compatibility

These specifications are tested and working on:

- ✅ Chrome/Edge (all versions)
- ✅ Safari (desktop and iOS)
- ✅ Firefox
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Last Updated:** December 6, 2025
**Working Video Version:** Current production videos (v20251104/v20251201)
