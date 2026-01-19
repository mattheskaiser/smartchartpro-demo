import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Clean, professional medical document styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },

  // Simple header
  header: {
    marginBottom: 30,
    borderBottom: '1 solid #000000',
    paddingBottom: 20,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  facilityAddress: {
    fontSize: 11,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 6,
  },
  facilityContact: {
    fontSize: 10,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 3,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
  },

  // Report info
  reportInfo: {
    marginBottom: 25,
    fontSize: 10,
  },
  reportInfoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reportLabel: {
    width: '25%',
    fontWeight: 'bold',
  },
  reportValue: {
    width: '75%',
  },

  // Resident sections
  residentSection: {
    marginBottom: 25,
    pageBreakInside: 'avoid',
  },
  residentHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1 solid #cccccc',
    paddingBottom: 5,
  },

  // Activity entries
  activityEntry: {
    marginBottom: 8,
    paddingLeft: 15,
  },
  activityRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  activityTime: {
    width: '15%',
    fontSize: 10,
  },
  activityType: {
    width: '30%',
    fontSize: 10,
  },
  activityAssistance: {
    width: '25%',
    fontSize: 10,
  },
  activityNotes: {
    width: '30%',
    fontSize: 10,
  },

  // Table headers
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 3,
    borderBottom: '1 solid #000000',
    fontWeight: 'bold',
    fontSize: 10,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    borderTop: '1 solid #000000',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
  },
});

interface ChartingReportPDFProps {
  facilityName: string;
  facilityAddress: string;
  facilityPhone: string;
  facilityFax?: string;
  facilityWebsite?: string;
  licenseNumber: string;
  npiNumber?: string;
  taxId?: string;
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
  facilityFax,
  facilityWebsite,
  licenseNumber,
  npiNumber,
  taxId,
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
          <Text style={styles.facilityAddress}>{facilityAddress}</Text>
          {facilityPhone && <Text style={styles.facilityContact}>Phone: {facilityPhone}</Text>}
          {facilityFax && <Text style={styles.facilityContact}>Fax: {facilityFax}</Text>}
          {licenseNumber && <Text style={styles.facilityContact}>License: {licenseNumber}</Text>}
          {npiNumber && <Text style={styles.facilityContact}>NPI: {npiNumber}</Text>}
          <Text style={styles.documentTitle}>ACTIVITIES OF DAILY LIVING REPORT</Text>
        </View>

        {/* Report Information */}
        <View style={styles.reportInfo}>
          <View style={styles.reportInfoRow}>
            <Text style={styles.reportLabel}>Report Date:</Text>
            <Text style={styles.reportValue}>{format(sessionStartTime, 'EEEE, MMMM dd, yyyy')}</Text>
          </View>
          <View style={styles.reportInfoRow}>
            <Text style={styles.reportLabel}>Start Time:</Text>
            <Text style={styles.reportValue}>{format(sessionStartTime, 'h:mm a')}</Text>
          </View>
          <View style={styles.reportInfoRow}>
            <Text style={styles.reportLabel}>End Time:</Text>
            <Text style={styles.reportValue}>{format(completionTime, 'h:mm a')}</Text>
          </View>
          {cnaName && (
            <View style={styles.reportInfoRow}>
              <Text style={styles.reportLabel}>Charted By:</Text>
              <Text style={styles.reportValue}>{cnaName} {cnaCertification ? `(${cnaCertification})` : ''}</Text>
            </View>
          )}
          <View style={styles.reportInfoRow}>
            <Text style={styles.reportLabel}>Total Residents:</Text>
            <Text style={styles.reportValue}>{residentCount}</Text>
          </View>
          <View style={styles.reportInfoRow}>
            <Text style={styles.reportLabel}>Total Activities:</Text>
            <Text style={styles.reportValue}>{totalActivities}</Text>
          </View>
        </View>

        {/* Resident Sections */}
        {selectedResidents.map((resident, index) => {
          const residentEntries = entriesByResident[resident.id] || [];

          return (
            <View key={resident.id} style={styles.residentSection} wrap={false}>
              <Text style={styles.residentHeader}>
                {index + 1}. {resident.name} - Room {resident.room}
              </Text>

              {residentEntries.length > 0 ? (
                <>
                  <View style={styles.tableHeader}>
                    <Text style={styles.activityTime}>Time</Text>
                    <Text style={styles.activityType}>Activity</Text>
                    <Text style={styles.activityAssistance}>Assistance</Text>
                    <Text style={styles.activityNotes}>Notes</Text>
                  </View>
                  {residentEntries.map((entry, entryIndex) => (
                    <View key={entryIndex} style={styles.activityEntry}>
                      <View style={styles.activityRow}>
                        <Text style={styles.activityTime}>
                          {format(new Date(entry.timestamp), 'h:mm a')}
                        </Text>
                        <Text style={styles.activityType}>
                          {ADL_TYPES[entry.activityType] || entry.activityType}
                        </Text>
                        <Text style={styles.activityAssistance}>
                          {ASSISTANCE_LEVELS[entry.assistance] || entry.assistance}
                        </Text>
                        <Text style={styles.activityNotes}>
                          {entry.notes || ''}
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              ) : (
                <Text style={{ fontSize: 10, fontStyle: 'italic', paddingLeft: 15 }}>
                  No activities documented for this resident
                </Text>
              )}
            </View>
          );
        })}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated: {format(completionTime, 'MM/dd/yyyy h:mm a')}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};