/**
 * Script to generate 6 demo PDF reports with realistic charting data
 * Run with: node scripts/generate-demo-pdfs.js
 */

const React = require('react');
const { renderToStream } = require('@react-pdf/renderer');
const fs = require('fs');
const path = require('path');

// Mock data
const FACILITY_INFO = {
  name: 'Sunrise Senior Living',
  address: '123 Care Lane, Springfield, IL 62701',
  phone: '(555) 123-4567',
  fax: '(555) 123-4568',
  license: 'IL-SNF-12345',
  npi: '1234567890',
};

const CNAS = [
  { id: 'cna_001', name: 'Jennifer Rodriguez', cert: 'CNA-2022-001' },
  { id: 'cna_002', name: 'Michael Thompson', cert: 'CNA-2021-045' },
  { id: 'cna_003', name: 'Sarah Johnson', cert: 'CNA-2023-012' },
  { id: 'cna_004', name: 'David Lee', cert: 'CNA-2022-078' },
];

const RESIDENTS = [
  { id: 'res_001', name: 'Margaret Thompson', room: '101', status: 'partial' },
  { id: 'res_002', name: 'Robert Chen', room: '102', status: 'independent' },
  { id: 'res_003', name: 'Dorothy Williams', room: '103', status: 'full' },
  { id: 'res_004', name: 'James Martinez', room: '104', status: 'partial' },
  { id: 'res_005', name: 'Patricia Johnson', room: '105', status: 'independent' },
  { id: 'res_006', name: 'William Anderson', room: '106', status: 'partial' },
  { id: 'res_007', name: 'Mary Davis', room: '107', status: 'partial' },
  { id: 'res_008', name: 'Charles Brown', room: '108', status: 'independent' },
  { id: 'res_009', name: 'Barbara Wilson', room: '109', status: 'full' },
];

// Generate realistic charting entries
function generateEntries(residents, startTime) {
  const entries = [];
  const activities = ['bathing', 'dressing', 'eating', 'toileting', 'mobility', 'health'];
  const assistanceLevels = {
    full: 'full',
    partial: 'partial',
    independent: 'independent',
  };

  const notes = {
    bathing: [
      'Assisted with shower. Patient cooperative.',
      'Bed bath completed. Skin integrity good.',
      'Shower completed without issues.',
      'Patient preferred morning bath.',
    ],
    dressing: [
      'Helped with buttons and shoes.',
      'Assisted with clothing selection.',
      'Patient dressed independently with supervision.',
      'Changed into fresh clothes.',
    ],
    eating: [
      'Ate 75% of breakfast. Good appetite.',
      'Assisted with cutting food. Ate well.',
      'Fed independently. No issues.',
      'Encouraged fluid intake.',
    ],
    toileting: [
      'Assisted with transfer to bathroom.',
      'No issues reported.',
      'Assisted with transfer to commode.',
      'Continent, no accidents.',
    ],
    mobility: [
      'Ambulated with walker to dining room.',
      'Transferred to wheelchair for activities.',
      'Assisted with position changes.',
      'Walked 50 feet with assistance.',
    ],
    health: [
      'Vital signs stable.',
      'No complaints of pain.',
      'Medication administered as ordered.',
      'Blood pressure within normal limits.',
    ],
  };

  let currentTime = new Date(startTime);

  residents.forEach((resident, index) => {
    // Each resident gets 3-5 activities
    const numActivities = 3 + Math.floor(Math.random() * 3);
    const selectedActivities = activities.sort(() => Math.random() - 0.5).slice(0, numActivities);

    selectedActivities.forEach(activity => {
      // Space activities 15-30 minutes apart
      currentTime = new Date(currentTime.getTime() + (15 + Math.random() * 15) * 60000);

      const assistance =
        resident.status === 'full'
          ? 'full'
          : resident.status === 'independent'
            ? 'independent'
            : Math.random() > 0.5
              ? 'partial'
              : 'independent';

      const noteOptions = notes[activity];
      const note = noteOptions[Math.floor(Math.random() * noteOptions.length)];

      entries.push({
        residentId: resident.id,
        activityType: activity,
        assistance: assistance,
        timestamp: new Date(currentTime),
        notes: note,
      });
    });
  });

  return entries.sort((a, b) => a.timestamp - b.timestamp);
}

// Generate 6 reports
const reports = [
  {
    daysAgo: 0,
    cna: CNAS[0],
    residents: [RESIDENTS[0], RESIDENTS[3], RESIDENTS[6], RESIDENTS[1]],
  },
  {
    daysAgo: 1,
    cna: CNAS[1],
    residents: [RESIDENTS[2], RESIDENTS[4], RESIDENTS[7]],
  },
  {
    daysAgo: 2,
    cna: CNAS[2],
    residents: [RESIDENTS[5], RESIDENTS[8], RESIDENTS[0], RESIDENTS[3], RESIDENTS[6]],
  },
  {
    daysAgo: 3,
    cna: CNAS[0],
    residents: [RESIDENTS[1], RESIDENTS[4], RESIDENTS[7], RESIDENTS[2]],
  },
  {
    daysAgo: 4,
    cna: CNAS[3],
    residents: [RESIDENTS[5], RESIDENTS[8], RESIDENTS[0]],
  },
  {
    daysAgo: 5,
    cna: CNAS[1],
    residents: [RESIDENTS[3], RESIDENTS[6], RESIDENTS[1], RESIDENTS[4]],
  },
];

console.log('Generating 6 demo PDF reports...\n');

// Create public/demo-reports directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'public', 'demo-reports');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Note: This script requires the PDF component to be transpiled
// For now, we'll create a manifest file that the app can use
const manifest = reports.map((report, index) => {
  const date = new Date();
  date.setDate(date.getDate() - report.daysAgo);
  const startTime = new Date(date);
  startTime.setHours(6, 0, 0, 0);

  const entries = generateEntries(report.residents, startTime);

  return {
    id: `report_${String(index + 1).padStart(3, '0')}`,
    reportDate: date.toISOString(),
    sessionStartTime: startTime.toISOString(),
    cnaId: report.cna.id,
    cnaName: report.cna.name,
    cnaCertification: report.cna.cert,
    totalResidents: report.residents.length,
    totalActivities: entries.length,
    residents: report.residents,
    entries: entries.map(e => ({
      ...e,
      timestamp: e.timestamp.toISOString(),
    })),
  };
});

// Save manifest
const manifestPath = path.join(outputDir, 'reports-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`✓ Generated manifest with ${manifest.length} reports`);
console.log(`✓ Saved to: ${manifestPath}\n`);

manifest.forEach((report, index) => {
  console.log(`Report ${index + 1}:`);
  console.log(`  - Date: ${new Date(report.reportDate).toLocaleDateString()}`);
  console.log(`  - CNA: ${report.cnaName}`);
  console.log(`  - Residents: ${report.totalResidents}`);
  console.log(`  - Activities: ${report.totalActivities}\n`);
});

console.log('Done! The app will generate PDFs on-demand from this manifest.');
