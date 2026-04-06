# The Dutch Queen Unplugged - Project Setup Summary

## Setup Complete! ✅

This project has been successfully created as a complete clone of your production website, configured for the unplugged version.

## Project Information

### Local Development

- **Directory**: `~/Queenwebsite_v3_UNPLUGGED`
- **Band ID**: `the-dutch-queen-unplugged`
- **Environment File**: `.env.local` (configured with correct band ID)

### GitHub Repository

- **URL**: https://github.com/willem4130/Queenwebsite_v3_UNPLUGGED
- **Status**: ✅ Created and pushed
- **Commits**: Configuration complete

### Vercel Deployment

- **Status**: ⏳ Ready for deployment
- **Project Name**: `the-dutch-queen-unplugged`
- **Next Steps**: Connect GitHub repo to Vercel manually or run:
  ```bash
  cd ~/Queenwebsite_v3_UNPLUGGED
  vercel deploy --prod --yes
  ```

## Production Site Safety ✅

**Your production site is completely untouched:**

- **Production Directory**: `~/251002_QueenWebsitev2/dutch-queen-mainband-website`
- **Git Status**: Clean working tree (verified)
- **Environment**: Still configured with `NEXT_PUBLIC_BAND_ID=the-dutch-queen`
- **GitHub**: https://github.com/willem4130/251002_Queenwebsite_v3 (unchanged)
- **Vercel**: https://the-dutch-queen-full-show-v3.vercel.app (unaffected)

## What Was Done

1. ✅ **Cloned entire website** to new directory
2. ✅ **Created new GitHub repository** (Queenwebsite_v3_UNPLUGGED)
3. ✅ **Updated configuration**:
   - Changed band ID to `the-dutch-queen-unplugged`
   - Renamed content folder to `the-dutch-queen-unplugged`
   - Updated band profile (name, tagline, ID)
4. ✅ **Created documentation**:
   - `UNPLUGGED_CUSTOMIZATION_GUIDE.md` - Step-by-step customization guide
   - `PROJECT_SETUP_SUMMARY.md` - This file
5. ✅ **Verified production isolation** - Zero changes to production site

## Next Steps for You

### Step 1: Customize Content

Follow the guide in `UNPLUGGED_CUSTOMIZATION_GUIDE.md` to update:

**Required:**

- [ ] Hero videos (desktop, tablet, mobile - MP4 & WebM)
- [ ] About section text
- [ ] Gallery images

**Optional:**

- [ ] Background images
- [ ] Show dates
- [ ] Contact information

### Step 2: Test Locally

```bash
cd ~/Queenwebsite_v3_UNPLUGGED
npm install
npm run dev
```

Open http://localhost:3000 to preview

### Step 3: Deploy to Vercel

**Option A: Automatic (Recommended)**

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import `willem4130/Queenwebsite_v3_UNPLUGGED` from GitHub
4. Add environment variable:
   - Name: `NEXT_PUBLIC_BAND_ID`
   - Value: `the-dutch-queen-unplugged`
5. Deploy

**Option B: CLI**

```bash
cd ~/Queenwebsite_v3_UNPLUGGED
vercel deploy --prod --yes
```

### Step 4: Update Content and Push

After customizing your content:

```bash
cd ~/Queenwebsite_v3_UNPLUGGED
git add .
git commit -m "Add unplugged content and media"
git push
```

Vercel will automatically redeploy.

## Project Structure

```
~/Queenwebsite_v3_UNPLUGGED/
├── content/bands/the-dutch-queen-unplugged/   # Your band content
│   ├── band-profile.json                      # Band configuration
│   ├── data/
│   │   ├── about.json                         # ← Edit this
│   │   ├── shows.json
│   │   ├── contact.json
│   │   └── social.json
│   └── assets/
│       ├── backgrounds/                        # ← Replace these
│       ├── gallery/                            # ← Replace these
│       └── logos/
├── public/
│   ├── videos/                                 # ← Replace hero videos
│   ├── gallery/                                # ← Replace gallery
│   └── [background images]                     # ← Optional
├── .env.local                                  # Already configured
└── UNPLUGGED_CUSTOMIZATION_GUIDE.md          # Your guide

```

## Important Notes

- **DO NOT modify code files** - Only update content and media
- **Keep production site separate** - Never work in `~/251002_QueenWebsitev2/`
- **Test before deploying** - Always run `npm run dev` locally first
- **Use WebP format** - Better performance than JPG
- **Optimize videos** - See `VIDEO_OPTIMIZATION_GUIDE.md`

## Support Documentation

- `UNPLUGGED_CUSTOMIZATION_GUIDE.md` - Complete customization guide
- `VIDEO_OPTIMIZATION_GUIDE.md` - Video optimization tutorial
- `01_BAND_CONTENT.md` - Content structure details
- `02_HERO_CONFIGURATION.md` - Hero section configuration
- `03_MEDIA_CHECKLIST.md` - Media asset checklist

## Quick Reference

| Aspect             | Production                                             | Unplugged                                  |
| ------------------ | ------------------------------------------------------ | ------------------------------------------ |
| **Local Dir**      | `~/251002_QueenWebsitev2/dutch-queen-mainband-website` | `~/Queenwebsite_v3_UNPLUGGED`              |
| **GitHub**         | willem4130/251002_Queenwebsite_v3                      | willem4130/Queenwebsite_v3_UNPLUGGED       |
| **Band ID**        | `the-dutch-queen`                                      | `the-dutch-queen-unplugged`                |
| **Content Folder** | `content/bands/the-dutch-queen/`                       | `content/bands/the-dutch-queen-unplugged/` |
| **Vercel**         | the-dutch-queen-full-show-v3                           | the-dutch-queen-unplugged (to setup)       |

---

**Setup completed successfully! Your production site is safe and the unplugged project is ready for customization.** 🎸
