# PDF Export Components

This directory contains components for generating professional PDF reports from charting data.

## ChartingReportPDF

A medical-grade PDF document component that generates comprehensive ADL charting reports.

### Features

- **Professional Layout**: Clean, medical-record-compliant design
- **Complete Metadata**: Includes facility info, CNA details, timestamps, and license numbers
- **Color-Coded Assistance Levels**: 
  - Green: Independent
  - Yellow/Orange: Partial Assistance
  - Red: Full Assistance
- **HIPAA Disclaimer**: Includes confidentiality notice
- **Page Numbers**: Automatic pagination with page numbers
- **Print-Friendly**: Optimized for both digital viewing and printing

### Required Props

All props are required to ensure medical record accuracy:

- `facilityName`: Name of the healthcare facility
- `facilityAddress`: Complete facility address
- `facilityPhone`: Facility contact number
- `licenseNumber`: Facility license number
- `cnaName`: Name of the CNA/nurse (optional but recommended)
- `cnaCertification`: CNA certification number (optional)
- `sessionStartTime`: When charting session began
- `selectedResidents`: Array of residents being charted
- `entries`: Array of ADL entries with timestamps and notes

### Usage

```tsx
import { ChartingReportPDF } from '@/components/pdf/ChartingReportPDF';
import { generateAndDownloadPDF } from '@/lib/pdfExport';

const pdfDocument = (
  <ChartingReportPDF
    facilityName="SmartChart Pro Facility"
    facilityAddress="123 Healthcare Ave"
    facilityPhone="(555) 123-4567"
    licenseNumber="HC-2024-001"
    cnaName="Jane Doe"
    cnaCertification="CNA-12345"
    sessionStartTime={new Date()}
    selectedResidents={residents}
    entries={entries}
  />
);

await generateAndDownloadPDF(pdfDocument, 'charting-report');
```

## Important Notes

- **Medical Record Compliance**: This PDF is designed for official medical records
- **Data Accuracy**: All timestamps and data are preserved exactly as entered
- **No Modifications**: Generated PDFs should not be edited after creation
- **Secure Storage**: PDFs contain PHI and must be stored securely per HIPAA guidelines
