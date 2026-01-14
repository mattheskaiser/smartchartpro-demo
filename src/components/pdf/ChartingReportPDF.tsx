import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Professional medical document styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #1f2937',
    paddingBottom: 15,
  },
  facilityName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 4,
  },
  facilityInfo: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111827',
    marginTop: 10,
    marginBottom: 5,
  },
  metadataSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    border: '1 solid #e5e7eb',
  },
  metadataRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  metadataLabel: {
    width: '35%',
    fontSize: 9,
    fontWeight: 700,
    color: '#374151',
  },
  metadataValue: {
    width: '65%',
    fontSize: 9,
    color: '#111827',
  },
  summarySection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 4,
    border: '1 solid #bfdbfe',
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1e40af',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 9,
    color: '#1e3a8a',
    marginBottom: 3,
  },
  residentSection: {
    marginBottom: 20,
    pageBreakInside: 'avoid',
  },
  residentHeader: {
    backgroundColor: '#1f2937',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  residentName: {
    fontSize: 12,
    fontWeight: 700,
    color: '#ffffff',
  },
  residentRoom: {
    fontSize: 9,
    color: '#d1d5db',
    marginTop: 2,
  },
  entryCard: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
    border: '1 solid #e5e7eb',
    borderRadius: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  activityType: {
    fontSize: 10,
    fontWeight: 700,
    color: '#111827',
  },
  timestamp: {
    fontSize: 9,
    color: '#6b7280',
  },
  assistanceLevel: {
    fontSize: 9,
    marginBottom: 4,
  },
  assistanceIndependent: {
    color: '#065f46',
  },
  assistancePartial: {
    color: '#92400e',
  },
  assistanceFull: {
    color: '#991b1b',
  },
  notes: {
    fontSize: 9,
    color: '#374151',
    fontStyle: 'italic',
    marginTop: 4,
    paddingTop: 4,
    borderTop: '1 solid #e5e7eb',
  },
  noEntries: {
    padding: 20,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 10,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  pageNumber: {
    fontSize: 8,
    color: '#9ca3af',
  },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fef3c7',
    border: '1 solid #fbbf24',
    borderRadius: 4,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#78350f',
    textAlign: 'center',
  },
});

interface ChartingReportPDFProps {
  facilityName: string;
  facilityAddress: string;
  facilityPhone: string;
  licenseNumber: string;
  cnaName?: string;
  cnaCertification?: string;
  sessionStartTime: Date;
  selectedResidents: Array<{
    id: string;
    name: string;
    room: string;
    status: string;
  }>;
  entries: Array<{
    residentId: string;
    activityType: string;
    assistance: string;
    timestamp: Date;
    notes?: string;
  }>;
}

const ADL_TYPES: Record<string, string> = {
  bathing: 'Bathing',
  dressing: 'Dressing',
  eating: 'Eating',
  toileting: 'Toileting',
  mobility: 'Mobility',
  health: 'Health Check',
};

const ASSISTANCE_LEVELS: Record<string, string> = {
  independent: 'Independent',
  partial: 'Partial Assistance',
  full: 'Full Assistance',
};

export const ChartingReportPDF: React.FC<ChartingReportPDFProps> = ({
  facilityName,
  facilityAddress,
  facilityPhone,
  licenseNumber,
  cnaName,
  cnaCertification,
  sessionStartTime,
  selectedResidents,
  entries,
}) => {
  // Group entries by resident
  const entriesByResident = entries.reduce(
    (acc, entry) => {
      if (!acc[entry.residentId]) {
        acc[entry.residentId] = [];
      }
      acc[entry.residentId].push(entry);
      return acc;
    },
    {} as Record<string, typeof entries>
  );

  // Sort entries by timestamp
  Object.keys(entriesByResident).forEach(residentId => {
    entriesByResident[residentId].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });

  const totalActivities = entries.length;
  const residentCount = selectedResidents.length;
  const completionTime = new Date();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.facilityName}>{facilityName}</Text>
          <Text style={styles.facilityInfo}>{facilityAddress}</Text>
          <Text style={styles.facilityInfo}>Phone: {facilityPhone}</Text>
          <Text style={styles.facilityInfo}>License: {licenseNumber}</Text>
          <Text style={styles.documentTitle}>ADL CHARTING REPORT</Text>
          <Text style={styles.facilityInfo}>
            Generated: {format(completionTime, 'MMMM dd, yyyy - h:mm a')}
          </Text>
        </View>

        {/* Metadata Section */}
        <View style={styles.metadataSection}>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Report Date:</Text>
            <Text style={styles.metadataValue}>
              {format(sessionStartTime, 'EEEE, MMMM dd, yyyy')}
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Charting Start Time:</Text>
            <Text style={styles.metadataValue}>{format(sessionStartTime, 'h:mm a')}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Charting End Time:</Text>
            <Text style={styles.metadataValue}>{format(completionTime, 'h:mm a')}</Text>
          </View>
          {cnaName && (
            <>
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Charted By (CNA):</Text>
                <Text style={styles.metadataValue}>{cnaName}</Text>
              </View>
              {cnaCertification && (
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>Certification #:</Text>
                  <Text style={styles.metadataValue}>{cnaCertification}</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>CHARTING SUMMARY</Text>
          <Text style={styles.summaryText}>Total Residents Charted: {residentCount}</Text>
          <Text style={styles.summaryText}>Total Activities Documented: {totalActivities}</Text>
          <Text style={styles.summaryText}>
            Average Activities per Resident:{' '}
            {residentCount > 0 ? (totalActivities / residentCount).toFixed(1) : '0'}
          </Text>
        </View>

        {/* Resident Sections */}
        {selectedResidents.map((resident, index) => {
          const residentEntries = entriesByResident[resident.id] || [];

          return (
            <View key={resident.id} style={styles.residentSection} wrap={false}>
              <View style={styles.residentHeader}>
                <Text style={styles.residentName}>
                  {index + 1}. {resident.name}
                </Text>
                <Text style={styles.residentRoom}>
                  Room: {resident.room} | Status: {resident.status}
                </Text>
              </View>

              {residentEntries.length > 0 ? (
                residentEntries.map((entry, entryIndex) => {
                  // Determine assistance style
                  let assistanceStyle = styles.assistanceLevel;
                  if (entry.assistance === 'independent') {
                    assistanceStyle = {
                      ...styles.assistanceLevel,
                      ...styles.assistanceIndependent,
                    };
                  } else if (entry.assistance === 'partial') {
                    assistanceStyle = { ...styles.assistanceLevel, ...styles.assistancePartial };
                  } else if (entry.assistance === 'full') {
                    assistanceStyle = { ...styles.assistanceLevel, ...styles.assistanceFull };
                  }

                  return (
                    <View key={entryIndex} style={styles.entryCard}>
                      <View style={styles.entryHeader}>
                        <Text style={styles.activityType}>
                          {ADL_TYPES[entry.activityType] || entry.activityType}
                        </Text>
                        <Text style={styles.timestamp}>
                          {format(new Date(entry.timestamp), 'h:mm a')}
                        </Text>
                      </View>
                      <Text style={assistanceStyle}>
                        Assistance Level: {ASSISTANCE_LEVELS[entry.assistance] || entry.assistance}
                      </Text>
                      {entry.notes && <Text style={styles.notes}>Notes: {entry.notes}</Text>}
                    </View>
                  );
                })
              ) : (
                <Text style={styles.noEntries}>No activities documented for this resident</Text>
              )}
            </View>
          );
        })}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This is an official medical record. All information contained herein is confidential and
            protected under HIPAA regulations. Unauthorized access or disclosure is prohibited.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {facilityName} | {format(completionTime, 'MM/dd/yyyy')}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};
