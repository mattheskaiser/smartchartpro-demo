# Quick Start - Charting Reports System

## 🚀 Setup (One-Time)

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add_charting_reports
```

This creates the `ChartingReport` table in your database.

### 2. Verify Setup

- Check that "Reports" appears in admin sidebar
- Navigate to `/admin/reports` - should see empty state

## 📖 How It Works Now

### Old Way (Before)
```
CNA charts → Review → Export PDF → End session
```

### New Way (Now)
```
CNA charts → Review → End session → Auto-saved to database!
Admin can export PDF anytime from dashboard
```

## 👤 For CNAs

### Charting Workflow

1. **Start** → `/charting/start`
   - Select your name (optional but recommended)
   - Select residents
   - Click "Start Charting"

2. **Chart** → `/charting/adls`
   - Select resident
   - Select activity
   - Select assistance level
   - Add notes
   - Repeat for all activities

3. **Review** → `/charting/review`
   - Review all entries
   - Click **"End Charting"**
   - ✅ Done! Report saved automatically

**No PDF export needed!** The report is automatically saved to the database.

## 👨‍💼 For Admins

### Viewing Reports

1. Go to **Admin → Reports** (`/admin/reports`)
2. See list of all charting sessions
3. Use filter buttons:
   - **All** - Show everything
   - **Pending** - New reports needing review
   - **Reviewed** - Already checked
   - **Archived** - Old reports

### Reviewing a Report

1. Click **"View"** on any report
2. See complete details:
   - CNA name and certification
   - Session times
   - All residents and activities
   - Timestamps and notes

3. Actions available:
   - **Export PDF** - Download PDF report
   - **Mark as Reviewed** - Change status to reviewed
   - **Archive** - Move to archived status

### Exporting PDFs

1. Open any report
2. Click **"Export PDF"**
3. PDF downloads automatically
4. Can export same report multiple times

## 🎯 Common Tasks

### Find Today's Reports
1. Go to Reports page
2. Look at top of list (sorted by date, newest first)

### Find Pending Reports
1. Go to Reports page
2. Click **"Pending"** filter button

### Review and Approve
1. Open report
2. Review details
3. Click **"Mark as Reviewed"**
4. Export PDF if needed

### Archive Old Reports
1. Open report
2. Click **"Archive"**
3. Report moves to archived status

## 📊 Report Information

Each report shows:
- **Date** - When charting session occurred
- **CNA** - Who performed the charting
- **Session Time** - Start and end times
- **Residents** - Number of residents charted
- **Activities** - Number of activities documented
- **Status** - Pending/Reviewed/Archived

## 🔍 What's Stored

The system saves:
- ✅ All resident information
- ✅ All ADL activities
- ✅ Timestamps for each activity
- ✅ Assistance levels
- ✅ Notes
- ✅ CNA information
- ✅ Session start/end times

## 💡 Tips

### For CNAs
- Always select your name at the start
- Review entries before ending session
- Can't edit after ending (by design)

### For Admins
- Review pending reports regularly
- Export PDFs for official records
- Archive old reports to keep list clean
- Use filters to find specific reports

## ⚠️ Important Notes

1. **Can't Edit After Saving**
   - Once CNA ends session, data is locked
   - This ensures data integrity
   - If mistake, create new session

2. **PDFs Generated On-Demand**
   - Not pre-generated
   - Can export multiple times
   - Always uses latest facility settings

3. **Status Workflow**
   - Pending → Reviewed → Archived
   - Can't go backwards
   - Archived reports still accessible

## 🆘 Troubleshooting

### "No reports found"
- CNAs need to complete charting sessions
- Check that sessions are being ended (not just closed)

### CNA name not showing
- CNA must select their name at start
- Optional but recommended for tracking

### Can't export PDF
- Check facility settings are configured
- Verify report has activities
- Check browser console for errors

### Reports not saving
- Check database connection
- Verify Prisma migration ran
- Check API routes are working

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Verify database connection
3. Check Prisma schema is up to date
4. Review API route logs

---

## ✅ Quick Checklist

Before going live:
- [ ] Run Prisma migration
- [ ] Test CNA workflow (start → chart → end)
- [ ] Verify report appears in admin dashboard
- [ ] Test PDF export
- [ ] Configure facility settings
- [ ] Add CNAs to system
- [ ] Train staff on new workflow

**You're all set!** The system is ready to use. 🎉
