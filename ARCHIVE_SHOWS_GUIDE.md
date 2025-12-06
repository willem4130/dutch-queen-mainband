# Archive Shows Guide

Complete guide for managing and archiving past shows on both The Dutch Queen websites.

## Overview

The archive-shows script safely moves past shows from the `upcoming` array to the `past` array in the shows.json files for both websites (Full Band and Unplugged). This keeps your show listings current and maintains a historical record.

## Features

- **Safety First:** Default dry-run mode previews changes without modifying files
- **Comprehensive Backups:** Timestamped backups created before any changes
- **Detailed Reports:** Human-readable markdown reports for every operation
- **Both Websites:** Processes both Full Band and Unplugged sites automatically
- **Conservative Logic:** Today's shows stay in upcoming; only past shows are archived
- **Atomic Operations:** No partial writes; changes are all-or-nothing

## File Locations

### Full Band Website
- **Shows Data:** `/dutch-queen-full-band-v4/content/bands/the-dutch-queen/data/shows.json`
- **Backups:** `/dutch-queen-full-band-v4/backups/`
- **Script:** `/dutch-queen-full-band-v4/scripts/archive-shows.ts`

### Unplugged Website
- **Shows Data:** `/Queenwebsite_v3_UNPLUGGED/content/bands/the-dutch-queen-unplugged/data/shows.json`
- **Backups:** `/Queenwebsite_v3_UNPLUGGED/backups/`
- **Script:** Uses the same script from Full Band (shared)

## Usage

### 1. Dry Run (Recommended First Step)

Preview what would be archived without making any changes:

```bash
cd dutch-queen-full-band-v4
npm run archive-shows
```

**What happens:**
- ✅ Creates backups of both shows.json files
- ✅ Generates detailed reports
- ✅ Shows what would be archived
- ❌ Does NOT modify shows.json files

**Output Example:**
```
Shows Archive Script - DRY RUN MODE
(No changes will be made)
======================================================================

Processing: The Dutch Queen (Full Band)
✅ Backup created: shows-backup-2025-12-06T08-07-25.json
✅ Report generated: shows-dryrun-2025-12-06T08-07-25.md

Analysis:
  - Total shows: 15
  - Shows to archive: 1
  - Shows remaining: 14

  Shows to be archived:
    • Dec 4, 2025 - Vorstin, Hilversum (2 days ago)

To execute this operation, run:
  npm run archive-shows:execute
```

### 2. Execute (Make Changes)

After reviewing the dry-run output, execute the archiving:

```bash
cd dutch-queen-full-band-v4
npm run archive-shows:execute
```

**What happens:**
- ✅ Creates backups of both shows.json files
- ✅ Generates detailed reports
- ✅ Shows what is being archived
- ✅ **MODIFIES shows.json files** (moves shows from upcoming to past)

**After execution:**
- Past shows are removed from the upcoming list
- Past shows are added to the past array (most recent first)
- All settings are preserved
- No data is lost

### 3. Verify (Check Integrity)

Verify the integrity of both shows.json files:

```bash
cd dutch-queen-full-band-v4
npm run archive-shows:verify
```

**What happens:**
- ✅ Creates backups of current state
- ✅ Validates JSON structure
- ✅ Reports show counts
- ❌ Does NOT modify files

Use this to:
- Confirm files are valid after execution
- Check current show counts
- Verify no corruption

## Understanding the Date Logic

### What Gets Archived?

**Archived (moved to past):**
- Shows with dates **BEFORE** today

**Kept in upcoming:**
- Shows happening **TODAY**
- Shows in the **FUTURE**

### Example (Today is Dec 6, 2025):

```
Dec 4, 2025  → ARCHIVED (2 days ago)
Dec 6, 2025  → KEPT (today)
Dec 11, 2025 → KEPT (5 days ahead)
```

### Date Format

Shows use this date format: `"Dec 4, 2025"` (Month Day, Year)

**Important:** The script validates dates and will NOT archive shows with unparseable dates (safety fallback).

## Backup Files

Every time you run the script, backups are created in the `backups/` directory:

### Backup Types

**1. JSON Backup (`shows-backup-YYYY-MM-DDTHH-MM-SS.json`)**
- Complete copy of original shows.json
- Use this to restore if something goes wrong

**2. Backup Report (`shows-backup-YYYY-MM-DDTHH-MM-SS-report.md`)**
- Human-readable list of all shows
- Includes file hash and metadata
- Easy to review what was backed up

**3. Dry-Run Report (`shows-dryrun-YYYY-MM-DDTHH-MM-SS.md`)**
- Preview of what would be archived
- Summary of changes

**4. Execution Report (`shows-execute-YYYY-MM-DDTHH-MM-SS.md`)**
- Record of what was actually archived
- Created when you run `--execute`

### Example Backup Directory

```
backups/
├── shows-backup-2025-12-06T08-07-25.json
├── shows-backup-2025-12-06T08-07-25-report.md
└── shows-dryrun-2025-12-06T08-07-25.md
```

## How to Restore from Backup

If something goes wrong, you can easily restore from backup:

### Full Band Website

```bash
# Find the backup file (most recent)
ls -lt dutch-queen-full-band-v4/backups/

# Restore from specific backup
cp dutch-queen-full-band-v4/backups/shows-backup-YYYY-MM-DDTHH-MM-SS.json \
   dutch-queen-full-band-v4/content/bands/the-dutch-queen/data/shows.json

# Verify restoration
cd dutch-queen-full-band-v4
npm run archive-shows:verify
```

### Unplugged Website

```bash
# Find the backup file (most recent)
ls -lt Queenwebsite_v3_UNPLUGGED/backups/

# Restore from specific backup
cp Queenwebsite_v3_UNPLUGGED/backups/shows-backup-YYYY-MM-DDTHH-MM-SS.json \
   Queenwebsite_v3_UNPLUGGED/content/bands/the-dutch-queen-unplugged/data/shows.json

# Verify restoration
cd Queenwebsite_v3_UNPLUGGED
npm run archive-shows:verify
```

## Workflow Recommendations

### After Each Show

1. **Run dry-run:**
   ```bash
   npm run archive-shows
   ```

2. **Review output:**
   - Check which shows would be archived
   - Verify the counts are correct
   - Read the dry-run report in `backups/`

3. **Execute if satisfied:**
   ```bash
   npm run archive-shows:execute
   ```

4. **Verify success:**
   ```bash
   npm run archive-shows:verify
   ```

5. **Test website:**
   - Start dev server: `npm run dev`
   - Visit http://localhost:3007
   - Verify upcoming shows display correctly
   - Check that past show is gone from upcoming list

### Monthly Maintenance

1. Run verify mode to check file integrity
2. Clean up old backups (keep last 10-20)
3. Review past shows in shows.json

## Troubleshooting

### Problem: Script shows "File not found"

**Solution:**
- Verify you're in the correct directory
- Check the shows.json file exists at the expected path
- Ensure you haven't moved or renamed files

### Problem: Script shows "Invalid JSON structure"

**Solution:**
- Restore from the most recent backup
- Check shows.json for syntax errors
- Ensure required fields exist (upcoming, past, settings)

### Problem: Wrong shows are being archived

**Solution:**
- Check the dry-run report carefully
- Verify the date format in shows.json is correct
- Review the date logic section above
- Contact support if date parsing seems incorrect

### Problem: All shows would be archived

**Solution:**
- The script will warn you if this happens
- Check if your dates are correct
- Verify today's date is correct
- Do NOT execute if this seems wrong

### Problem: Backups directory is getting large

**Solution:**
- Backups are excluded from git (in .gitignore)
- Safe to manually delete old backups
- Keep at least the 5 most recent backups
- Consider archiving very old backups elsewhere

## Safety Features

### Pre-Execution Checks
- ✅ File exists and is readable
- ✅ Valid JSON structure
- ✅ Required fields present
- ✅ Backup created successfully

### During Execution
- ✅ Conservative date parsing
- ✅ Unparseable dates kept in upcoming
- ✅ Atomic file writes (temp file → rename)
- ✅ No partial writes

### Post-Execution Verification
- ✅ Total show count preserved
- ✅ Settings unchanged
- ✅ Valid JSON structure
- ✅ Chronological ordering

### Sanity Checks
- ⚠️ Warns if archiving all shows
- ⚠️ Warns if archiving > 10 shows
- ❌ Errors if archiving future shows
- ⚠️ Warns if archiving today's shows

## Technical Details

### What the Script Does

1. **Reads** both shows.json files
2. **Validates** JSON structure
3. **Creates** timestamped backups
4. **Parses** show dates with validation
5. **Determines** which shows to archive (date < today)
6. **Moves** past shows to past array
7. **Writes** changes atomically
8. **Verifies** data integrity
9. **Generates** detailed reports

### Date Parsing

```typescript
// Only archive shows BEFORE today (not equal to today)
const today = new Date();
today.setHours(0, 0, 0, 0);  // Normalize to midnight

const showDate = new Date(show.date);
showDate.setHours(0, 0, 0, 0);

// Archive only if: showDate < today
// Keep if: showDate >= today (includes today's shows)
```

### Atomic Operations

The script uses atomic file operations to prevent corruption:

1. Write to temporary file (`shows.json.tmp`)
2. Validate temporary file (parse JSON)
3. Create backup of current file
4. Atomic rename (temp → actual)
5. Cleanup

If anything fails, the original file is preserved.

## Future Automation

### Option 1: Manual (Recommended)

Run manually after each show or monthly:
- Most control
- Review each operation
- Safest approach

### Option 2: Cron Job (Advanced)

Run automatically on a schedule:

```bash
# Add to crontab (weekly on Sunday at 2 AM)
0 2 * * 0 cd /path/to/dutch-queen-full-band-v4 && npm run archive-shows:execute
```

**Important:** Only automate after thoroughly testing the script and verifying it works correctly.

### Option 3: GitHub Actions (Advanced)

Automate via CI/CD:
- Weekly scheduled run
- Automatic commit of changes
- Only after extensive testing

## FAQ

**Q: Will this delete my shows?**
A: No. Shows are moved to the `past` array, not deleted. All data is preserved.

**Q: Can I undo archiving?**
A: Yes. Restore from the backup created before archiving.

**Q: What if I have shows without dates?**
A: The script will skip them and log an error. They'll stay in upcoming.

**Q: Does this affect the website immediately?**
A: Yes, once executed. The website reads from shows.json directly.

**Q: Can I run this from either project?**
A: Yes. Both projects have npm scripts that run the same script and process both websites.

**Q: What happens to show settings?**
A: Settings are never modified. Only the upcoming and past arrays change.

**Q: How do I know if it worked?**
A: Check the console output, review the reports in backups/, and run verify mode.

**Q: Can I archive specific shows manually?**
A: Yes, by manually editing shows.json. Move shows from upcoming to past array.

## Support

For issues or questions:
- Review this guide
- Check the dry-run report
- Verify backups exist
- Test restore process
- Check console output for errors

## Summary

**Always safe to run:**
- `npm run archive-shows` (dry-run)
- `npm run archive-shows:verify`

**Modifies files:**
- `npm run archive-shows:execute` (creates backups first)

**Best practice:**
1. Dry-run first
2. Review reports
3. Execute
4. Verify
5. Test website

**Remember:** Backups are created automatically. You can always restore if needed.
