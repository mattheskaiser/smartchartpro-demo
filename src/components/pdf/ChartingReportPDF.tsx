import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Clean, modern medical document styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },

  // Modern header with blue accent
  header: {
    marginBottom: 30,
    borderBottomWidth: 3,
    borderBottomColor: '#3b82f6',
    paddingBottom: 20,
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 6,
  },
  facilityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
    textAlign: 'center',
  },
  facilityAddress: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  facilityContact: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 2,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
    letterSpacing: 1,
  },

  // Report info with subtle background
  reportInfo: {
    marginBottom: 25,
    fontSize: 10,
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  reportInfoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  reportLabel: {
    width: '30%',
    fontWeight: 'bold',
    color: '#374151',
  },
  reportValue: {
    width: '70%',
    color: '#1f2937',
  },

  // Modern resident sections
  residentSection: {
    marginBottom: 25,
    pageBreakInside: 'avoid',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  residentHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 0,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: 12,
  },

  // Clean table styling
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableHeaderAssistance: {
    width: '20%',
    fontSize: 9,
    color: '#000000',
    fontWeight: 'bold',
  },

  // Activity entries with better spacing
  activityEntry: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityTime: {
    width: '15%',
    fontSize: 9,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  activityType: {
    width: '25%',
    fontSize: 9,
    color: '#374151',
    fontWeight: 'bold',
  },
  activityAssistance: {
    width: '20%',
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Assistance level colors
  assistanceIndependent: {
    color: '#059669',
  },
  assistancePartial: {
    color: '#d97706',
  },
  assistanceFull: {
    color: '#dc2626',
  },
  activityNotes: {
    width: '40%',
    fontSize: 9,
    color: '#6b7280',
    fontStyle: 'italic',
  },

  // Modern footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#6b7280',
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
  licenseNumber,
  npiNumber,
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

  const getAssistanceStyle = (assistance: string) => {
    switch (assistance.toLowerCase()) {
      case 'independent':
        return styles.assistanceIndependent;
      case 'partial':
        return styles.assistancePartial;
      case 'full':
        return styles.assistanceFull;
      default:
        return styles.assistancePartial;
    }
  };

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
            <Text style={styles.reportValue}>
              {format(sessionStartTime, 'EEEE, MMMM dd, yyyy')}
            </Text>
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
              <Text style={styles.reportValue}>
                {cnaName} {cnaCertification ? `(${cnaCertification})` : ''}
              </Text>
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
                    <Text style={styles.tableHeaderAssistance}>Assistance</Text>
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
                        <Text
                          style={[styles.activityAssistance, getAssistanceStyle(entry.assistance)]}
                        >
                          {ASSISTANCE_LEVELS[entry.assistance] || entry.assistance}
                        </Text>
                        <Text style={styles.activityNotes}>{entry.notes || ''}</Text>
                      </View>
                    </View>
                  ))}
                </>
              ) : (
                <View style={{ padding: 15, backgroundColor: '#f9fafb' }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontStyle: 'italic',
                      color: '#6b7280',
                      textAlign: 'center',
                    }}
                  >
                    No activities documented for this resident
                  </Text>
                </View>
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
