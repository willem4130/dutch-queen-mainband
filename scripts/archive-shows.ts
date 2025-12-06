#!/usr/bin/env ts-node

/**
 * Archive Shows Script
 *
 * Safely moves past shows from 'upcoming' to 'past' array for both The Dutch Queen websites.
 *
 * Features:
 * - Three modes: --dry-run (default), --execute, --verify
 * - Timestamped backups before any changes
 * - Human-readable markdown reports
 * - Conservative date parsing (keep if unparseable)
 * - Atomic file operations
 * - Comprehensive validation and sanity checks
 *
 * Usage:
 *   npm run archive-shows              # Dry run (safe, default)
 *   npm run archive-shows:execute      # Execute changes
 *   npm run archive-shows:verify       # Verify integrity
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// Types
// ============================================================================

interface Show {
  date: string;
  time: string;
  venue: string;
  city: string;
  status: 'tickets' | 'sold-out';
  ticketUrl?: string;
  [key: string]: unknown;
}

interface ShowsData {
  upcoming: Show[];
  past: Show[];
  settings: {
    showPastShows: boolean;
    maxUpcomingDisplay: number;
    maxPastDisplay: number;
    autoArchiveAfterDays: number;
  };
}

interface DateParseResult {
  success: boolean;
  date: Date | null;
  original: string;
  errors: string[];
}

interface ArchiveDecision {
  shouldArchive: boolean;
  reason: string;
  showDate: Date | null;
  daysAgo: number;
}

interface ArchiveResult {
  siteName: string;
  filePath: string;
  originalUpcoming: number;
  originalPast: number;
  archived: number;
  remaining: number;
  totalPast: number;
  archivedShows: Array<{
    date: string;
    venue: string;
    city: string;
    daysAgo: number;
  }>;
  errors: string[];
  warnings: string[];
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, '..');
const UNPLUGGED_ROOT = path.resolve(PROJECT_ROOT, '..', 'Queenwebsite_v3_UNPLUGGED');

const SITES = [
  {
    name: 'The Dutch Queen (Full Band)',
    filePath: path.join(PROJECT_ROOT, 'content/bands/the-dutch-queen/data/shows.json'),
    backupDir: path.join(PROJECT_ROOT, 'backups'),
  },
  {
    name: 'The Dutch Queen Unplugged',
    filePath: path.join(UNPLUGGED_ROOT, 'content/bands/the-dutch-queen-unplugged/data/shows.json'),
    backupDir: path.join(UNPLUGGED_ROOT, 'backups'),
  },
];

// ============================================================================
// Date Parsing & Validation
// ============================================================================

/**
 * Parse show date string with comprehensive validation
 * Format: "Dec 4, 2025" or "Month Day, Year"
 */
function parseShowDate(dateString: string): DateParseResult {
  const errors: string[] = [];

  // Validation 1: Format check (Month Day, Year)
  const formatRegex = /^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}$/;
  if (!formatRegex.test(dateString)) {
    errors.push(`Invalid format: "${dateString}" (expected: "MMM D, YYYY")`);
    return { success: false, date: null, original: dateString, errors };
  }

  // Validation 2: Parse using Date constructor
  const parsed = new Date(dateString);

  // Validation 3: Check if valid date
  if (isNaN(parsed.getTime())) {
    errors.push(`Could not parse: "${dateString}"`);
    return { success: false, date: null, original: dateString, errors };
  }

  // Validation 4: Reasonable date range (2020-2030)
  const year = parsed.getFullYear();
  if (year < 2020 || year > 2030) {
    errors.push(`Unreasonable year: ${year} in "${dateString}"`);
    return { success: false, date: null, original: dateString, errors };
  }

  return { success: true, date: parsed, original: dateString, errors: [] };
}

/**
 * Determine if show should be archived based on date
 * CRITICAL: Only archive shows BEFORE today (not equal to today)
 */
function shouldArchiveShow(showDateString: string, referenceDate: Date): ArchiveDecision {
  const parseResult = parseShowDate(showDateString);

  // SAFETY: If we can't parse the date, DO NOT archive it
  if (!parseResult.success) {
    return {
      shouldArchive: false,
      reason: `Could not parse date safely: ${parseResult.errors.join(', ')}`,
      showDate: null,
      daysAgo: 0,
    };
  }

  const showDate = parseResult.date!;
  const today = new Date(referenceDate);

  // Normalize to midnight for fair comparison
  today.setHours(0, 0, 0, 0);
  showDate.setHours(0, 0, 0, 0);

  const timeDiff = today.getTime() - showDate.getTime();
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // CRITICAL: Only archive shows BEFORE today (not equal to today)
  if (showDate < today) {
    return {
      shouldArchive: true,
      reason: `Show was ${daysAgo} day(s) ago`,
      showDate,
      daysAgo,
    };
  } else if (showDate.getTime() === today.getTime()) {
    return {
      shouldArchive: false,
      reason: "Show is today (keeping in upcoming)",
      showDate,
      daysAgo: 0,
    };
  } else {
    return {
      shouldArchive: false,
      reason: `Show is ${Math.abs(daysAgo)} day(s) in the future`,
      showDate,
      daysAgo,
    };
  }
}

// ============================================================================
// File Operations
// ============================================================================

/**
 * Calculate SHA256 hash of file
 */
function calculateFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Validate shows.json file structure
 */
function validateShowsStructure(data: unknown): ValidationResult {
  if (typeof data !== 'object' || data === null) {
    return { valid: false, error: 'Data is not an object' };
  }

  const showsData = data as Partial<ShowsData>;

  // Required fields
  if (!showsData.upcoming || !Array.isArray(showsData.upcoming)) {
    return { valid: false, error: 'Missing or invalid "upcoming" array' };
  }

  if (!showsData.past || !Array.isArray(showsData.past)) {
    return { valid: false, error: 'Missing or invalid "past" array' };
  }

  if (!showsData.settings || typeof showsData.settings !== 'object') {
    return { valid: false, error: 'Missing or invalid "settings" object' };
  }

  // Validate each show has required fields
  const requiredFields = ['date', 'time', 'venue', 'city', 'status'];
  for (let i = 0; i < showsData.upcoming.length; i++) {
    const show = showsData.upcoming[i] as Partial<Show>;
    for (const field of requiredFields) {
      if (!(field in show)) {
        return {
          valid: false,
          error: `Upcoming show #${i + 1} missing field: ${field}`,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Create timestamped backup of shows.json file
 */
function createBackup(filePath: string, backupDir: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupFileName = `shows-backup-${timestamp}.json`;
  const backupPath = path.join(backupDir, backupFileName);

  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Copy file
  fs.copyFileSync(filePath, backupPath);

  return backupPath;
}

/**
 * Write shows data to file atomically
 */
async function writeShowsFile(filePath: string, data: ShowsData): Promise<void> {
  const tmpPath = `${filePath}.tmp`;
  const backupPath = `${filePath}.backup`;

  try {
    // Write to temporary file
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');

    // Validate temporary file
    const tmpContent = fs.readFileSync(tmpPath, 'utf-8');
    JSON.parse(tmpContent); // Will throw if invalid

    // Create backup of current file
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    // Atomic rename (OS-level operation)
    fs.renameSync(tmpPath, filePath);

    // Cleanup backup
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
  } catch (err) {
    // Cleanup temporary file if it exists
    if (fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }

    // Restore from backup if it exists
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
    }

    throw err;
  }
}

// ============================================================================
// Report Generation
// ============================================================================

/**
 * Generate human-readable markdown report
 */
function generateReport(
  result: ArchiveResult,
  backupPath: string,
  reportType: 'backup' | 'dryrun' | 'execute'
): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let report = '';

  if (reportType === 'backup') {
    report += `# Shows Backup Report\n\n`;
    report += `**Generated:** ${timestamp}\n`;
    report += `**Original File:** ${result.filePath}\n`;
    report += `**Website:** ${result.siteName}\n\n`;

    // Read original file for backup report
    const data: ShowsData = JSON.parse(fs.readFileSync(result.filePath, 'utf-8'));

    report += `## Upcoming Shows (${data.upcoming.length} total)\n\n`;
    if (data.upcoming.length === 0) {
      report += `[None]\n\n`;
    } else {
      data.upcoming.forEach((show, index) => {
        report += `${index + 1}. **${show.date}** - ${show.venue}, ${show.city} (${show.time}) [${show.status}]\n`;
      });
      report += `\n`;
    }

    report += `## Past Shows (${data.past.length} total)\n\n`;
    if (data.past.length === 0) {
      report += `[None]\n\n`;
    } else {
      data.past.forEach((show, index) => {
        report += `${index + 1}. **${show.date}** - ${show.venue}, ${show.city} (${show.time}) [${show.status}]\n`;
      });
      report += `\n`;
    }

    report += `## Settings\n\n`;
    report += `- showPastShows: ${data.settings.showPastShows}\n`;
    report += `- maxUpcomingDisplay: ${data.settings.maxUpcomingDisplay}\n`;
    report += `- maxPastDisplay: ${data.settings.maxPastDisplay}\n`;
    report += `- autoArchiveAfterDays: ${data.settings.autoArchiveAfterDays}\n\n`;

    const fileHash = calculateFileHash(result.filePath);
    const stats = fs.statSync(result.filePath);
    report += `## File Integrity\n\n`;
    report += `- SHA256: ${fileHash.slice(0, 16)}...\n`;
    report += `- File Size: ${stats.size.toLocaleString()} bytes\n`;
    report += `- Last Modified: ${stats.mtime.toISOString().slice(0, 19).replace('T', ' ')}\n\n`;

    report += `---\n\n`;
    report += `To restore this backup:\n`;
    report += `\`\`\`bash\n`;
    report += `cp ${backupPath} ${result.filePath}\n`;
    report += `\`\`\`\n`;
  } else {
    // Dry-run or execute report
    report += `# Shows Archive ${reportType === 'dryrun' ? 'Dry Run' : 'Execution'} Report\n\n`;
    report += `**Generated:** ${timestamp}\n`;
    report += `**Website:** ${result.siteName}\n`;
    report += `**File:** ${result.filePath}\n\n`;

    report += `## Summary\n\n`;
    report += `- **Original upcoming shows:** ${result.originalUpcoming}\n`;
    report += `- **Original past shows:** ${result.originalPast}\n`;
    report += `- **Shows archived:** ${result.archived}\n`;
    report += `- **Remaining upcoming shows:** ${result.remaining}\n`;
    report += `- **Total past shows:** ${result.totalPast}\n\n`;

    if (result.archived > 0) {
      report += `## Shows ${reportType === 'dryrun' ? 'To Be' : ''} Archived\n\n`;
      result.archivedShows.forEach((show, index) => {
        report += `${index + 1}. **${show.date}** - ${show.venue}, ${show.city} (${show.daysAgo} day(s) ago)\n`;
      });
      report += `\n`;
    } else {
      report += `## No Shows ${reportType === 'dryrun' ? 'To Be' : ''} Archived\n\n`;
      report += `All shows are either today or in the future.\n\n`;
    }

    if (result.warnings.length > 0) {
      report += `## Warnings\n\n`;
      result.warnings.forEach((warning, index) => {
        report += `${index + 1}. ${warning}\n`;
      });
      report += `\n`;
    }

    if (result.errors.length > 0) {
      report += `## Errors\n\n`;
      result.errors.forEach((error, index) => {
        report += `${index + 1}. ${error}\n`;
      });
      report += `\n`;
    }
  }

  return report;
}

// ============================================================================
// Archive Logic
// ============================================================================

/**
 * Perform sanity checks on archive results
 */
function performSanityChecks(result: ArchiveResult): string[] {
  const warnings: string[] = [];

  // Check 1: Not archiving ALL shows
  if (result.remaining === 0 && result.archived > 0) {
    warnings.push('⚠️  All upcoming shows would be archived. This seems unusual.');
  }

  // Check 2: Not archiving too many shows at once
  if (result.archived > 10) {
    warnings.push(`⚠️  ${result.archived} shows would be archived. This seems high.`);
  }

  // Check 3: Not accidentally archiving future shows
  for (const show of result.archivedShows) {
    if (show.daysAgo < 0) {
      warnings.push(`❌ Future show would be archived: ${show.date} (${Math.abs(show.daysAgo)} days ahead)`);
    }
  }

  // Check 4: Today's shows are preserved
  for (const show of result.archivedShows) {
    if (show.daysAgo === 0) {
      warnings.push(`⚠️  Today's show would be archived: ${show.date}. This may not be desired.`);
    }
  }

  return warnings;
}

/**
 * Archive shows for a single site
 */
function archiveShows(
  siteName: string,
  filePath: string,
  backupDir: string,
  dryRun: boolean
): ArchiveResult {
  const today = new Date();

  // Read shows data
  const data: ShowsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Validate structure
  const validation = validateShowsStructure(data);
  if (!validation.valid) {
    throw new Error(`Invalid shows.json structure: ${validation.error}`);
  }

  const originalUpcoming = data.upcoming.length;
  const originalPast = data.past.length;

  // Determine which shows to archive
  const toArchive: Show[] = [];
  const toKeep: Show[] = [];

  for (const show of data.upcoming) {
    const decision = shouldArchiveShow(show.date, today);
    if (decision.shouldArchive) {
      toArchive.push(show);
    } else {
      toKeep.push(show);
    }
  }

  // Create result
  const result: ArchiveResult = {
    siteName,
    filePath,
    originalUpcoming,
    originalPast,
    archived: toArchive.length,
    remaining: toKeep.length,
    totalPast: originalPast + toArchive.length,
    archivedShows: toArchive.map(show => {
      const decision = shouldArchiveShow(show.date, today);
      return {
        date: show.date,
        venue: show.venue,
        city: show.city,
        daysAgo: decision.daysAgo,
      };
    }),
    errors: [],
    warnings: [],
  };

  // Perform sanity checks
  result.warnings = performSanityChecks(result);

  // If not dry run, write changes
  if (!dryRun && toArchive.length > 0) {
    // Add archived shows to past array (most recent first)
    const newPast = [...toArchive.reverse(), ...data.past];

    const newData: ShowsData = {
      upcoming: toKeep,
      past: newPast,
      settings: data.settings,
    };

    // Write atomically
    writeShowsFile(filePath, newData);
  }

  return result;
}

// ============================================================================
// Main Execution
// ============================================================================

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || '--dry-run';

  console.log('='.repeat(70));
  if (mode === '--execute') {
    console.log('Shows Archive Script - EXECUTION MODE');
    console.log('⚠️  This will modify shows.json files!');
  } else if (mode === '--verify') {
    console.log('Shows Archive Script - VERIFICATION MODE');
  } else {
    console.log('Shows Archive Script - DRY RUN MODE');
    console.log('(No changes will be made)');
  }
  console.log('='.repeat(70));
  console.log();

  const dryRun = mode !== '--execute';

  // Process each site
  for (const site of SITES) {
    console.log(`Processing: ${site.name}`);
    console.log(`File: ${site.filePath}`);
    console.log();

    // Check if file exists
    if (!fs.existsSync(site.filePath)) {
      console.error(`❌ File not found: ${site.filePath}`);
      console.log();
      continue;
    }

    try {
      // Create backup
      const backupPath = createBackup(site.filePath, site.backupDir);
      console.log(`✅ Backup created: ${path.basename(backupPath)}`);

      // Generate backup report
      const result = archiveShows(site.name, site.filePath, site.backupDir, true);
      const backupReport = generateReport(result, backupPath, 'backup');
      const backupReportPath = backupPath.replace('.json', '-report.md');
      fs.writeFileSync(backupReportPath, backupReport, 'utf-8');
      console.log(`✅ Backup report: ${path.basename(backupReportPath)}`);
      console.log();

      if (mode === '--verify') {
        // Verification mode
        console.log('Verification Results:');
        console.log(`  - Total shows: ${result.originalUpcoming + result.originalPast}`);
        console.log(`  - Upcoming shows: ${result.originalUpcoming}`);
        console.log(`  - Past shows: ${result.originalPast}`);
        console.log(`  - Structure: ✅ Valid`);
        console.log();
        continue;
      }

      // Archive shows
      const archiveResult = archiveShows(site.name, site.filePath, site.backupDir, dryRun);

      // Display results
      console.log('Analysis:');
      console.log(`  - Total shows: ${archiveResult.originalUpcoming + archiveResult.originalPast}`);
      console.log(`  - Shows ${dryRun ? 'to archive' : 'archived'}: ${archiveResult.archived}`);
      console.log(`  - Shows remaining: ${archiveResult.remaining}`);

      if (archiveResult.archived > 0) {
        console.log();
        console.log(`  Shows ${dryRun ? 'to be' : ''} archived:`);
        archiveResult.archivedShows.forEach(show => {
          console.log(`    • ${show.date} - ${show.venue}, ${show.city} (${show.daysAgo} days ago)`);
        });
      }

      if (archiveResult.warnings.length > 0) {
        console.log();
        console.log('  Warnings:');
        archiveResult.warnings.forEach(warning => {
          console.log(`    ${warning}`);
        });
      }

      // Generate report
      const reportType = dryRun ? 'dryrun' : 'execute';
      const report = generateReport(archiveResult, backupPath, reportType);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const reportPath = path.join(site.backupDir, `shows-${reportType}-${timestamp}.md`);
      fs.writeFileSync(reportPath, report, 'utf-8');
      console.log();
      console.log(`✅ Report generated: ${path.basename(reportPath)}`);
      console.log();

      if (dryRun && archiveResult.archived > 0) {
        console.log('To execute this operation, run:');
        console.log('  npm run archive-shows:execute');
      } else if (!dryRun && archiveResult.archived > 0) {
        console.log('✅ Changes applied successfully!');
        console.log('Verify with: npm run archive-shows:verify');
      } else {
        console.log('No changes needed - all shows are today or in the future.');
      }

      console.log();
      console.log('-'.repeat(70));
      console.log();
    } catch (error) {
      console.error(`❌ Error processing ${site.name}:`, error);
      console.log();
    }
  }

  console.log('='.repeat(70));
  console.log('Archive script completed');
  console.log('='.repeat(70));
}

// Run main function
main();
