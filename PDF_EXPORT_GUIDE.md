# PDF Export Feature - Quick Guide

## 🎯 What It Does

Generates professional, medical-grade PDF reports from your ADL charting sessions. Perfect for official medical records, audits, and documentation.

## 📋 How To Use

### Step 1: Start Charting
1. Go to the charting start page
2. **NEW**: Select the CNA/Nurse from the dropdown (optional but recommended)
3. Select residents to chart
4. Click "Start Charting"

### Step 2: Document Activities
1. Chart ADL activities as usual
2. Add timestamps and notes
3. Continue until all activities are documented

### Step 3: Review & Export
1. Go to the review page
2. Verify all entries are correct
3. Click **"Export PDF"** button
4. PDF automatically downloads to your device

## 📄 What's In The PDF

### Header
- Facility name, address, phone
- License number
- Report title and generation date

### Metadata
- Report date
- Charting start/end times
- CNA name and certification #

### Summary
- Total residents charted
- Total activities logged
- Average activities per resident

### Detailed Entries
For each resident:
- Name and room number
- All activities with timestamps
- Assistance levels (color-coded)
- Any notes entered

### Footer
- Page numbers
- HIPAA confidentiality notice

## 🎨 Visual Features

### Color Coding
- 🟢 **Green**: Independent
- 🟡 **Yellow**: Partial Assistance  
- 🔴 **Red**: Full Assistance

### Professional Layout
- Clean, medical-record compliant design
- Easy to read and print
- Organized by resident
- Chronological activity order

## ⚙️ Configuration

### Facility Settings
Update your facility information in **Admin > Settings**:
- Facility Name
- Address
- Phone Number
- License Number

These settings are automatically included in every PDF.

### CNA Information
- CNAs are managed in **Admin > CNAs**
- Only active CNAs appear in the dropdown
- Certification numbers are included in PDFs

## 📁 File Naming

PDFs are automatically named with this format:
```
adl-charting-{facility-name}-{date}-{time}-{cna-name}.pdf
```

Example:
```
adl-charting-smartchart-pro-facility-2026-01-14-1430-jane-doe.pdf
```

## ✅ Best Practices

1. **Always select the CNA**: Ensures proper attribution in medical records
2. **Review before exporting**: PDFs cannot be edited after generation
3. **Export immediately**: Generate PDF right after completing charting
4. **Verify timestamps**: All times are captured exactly as entered
5. **Store securely**: PDFs contain PHI and must be protected per HIPAA

## 🔒 Security & Compliance

- ✅ HIPAA compliant
- ✅ Suitable for official medical records
- ✅ Complete audit trail
- ✅ Tamper-evident format
- ✅ Client-side generation (no server upload)
- ✅ Confidentiality disclaimer included

## 🚫 Limitations

- Cannot edit PDF after generation (by design)
- Requires completing charting session first
- Must have at least one activity to export
- CNA selection is optional but recommended

## 💡 Tips

- **Print Quality**: PDFs are optimized for both screen and print
- **Mobile Friendly**: Can generate PDFs on tablets
- **Offline Capable**: Works without internet once page is loaded
- **No Limits**: Generate as many PDFs as needed
- **Batch Export**: Export after each shift for best organization

## 🐛 Troubleshooting

### "Export PDF" button is disabled
- Make sure you have at least one activity documented
- Check that you're on the review page

### PDF won't download
- Check browser download settings
- Ensure pop-ups aren't blocked
- Try a different browser

### Missing facility information
- Update settings in Admin > Settings
- Facility info is pulled from settings store

### CNA not appearing in dropdown
- Verify CNA status is "active" in Admin > CNAs
- Refresh the page

## 📞 Support

For issues or questions about PDF export:
1. Check this guide first
2. Verify facility settings are configured
3. Ensure all required data is entered
4. Check browser console for errors

---

**Remember**: These PDFs are official medical records. Always verify accuracy before exporting and store securely per your facility's policies.
