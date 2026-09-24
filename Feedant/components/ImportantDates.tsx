import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface DateItem {
  date: string;
  time: string;
}

interface ImportantDatesProps {
  registerBefore: DateItem;
  submissionStarts: DateItem;
  submissionEnds: DateItem;
  resultDate: DateItem;
}

const DateBlock: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  date: string;
  time: string;
}> = ({ icon, label, date, time }) => (
  <View style={styles.dateBlock}>
    <Ionicons name={icon} size={20} color={COLORS.primary} style={styles.dateIcon} />
    <Text style={styles.dateLabel}>{label}</Text>
    <Text style={styles.dateValue}>{date}</Text>
    <Text style={styles.dateTime}>{time}</Text>
  </View>
);

export const ImportantDates: React.FC<ImportantDatesProps> = ({
  registerBefore,
  submissionStarts,
  submissionEnds,
  resultDate,
}) => {
  return (
    <View style={styles.container}>
      <SectionHeader title="Important Dates" />
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <DateBlock
            icon="calendar-outline"
            label="Register Before"
            date={registerBefore.date}
            time={registerBefore.time}
          />
          <DateBlock
            icon="document-text-outline"
            label="Submission Starts"
            date={submissionStarts.date}
            time={submissionStarts.time}
          />
        </View>
        <View style={styles.gridRow}>
          <DateBlock
            icon="time-outline"
            label="Submission Ends"
            date={submissionEnds.date}
            time={submissionEnds.time}
          />
          <DateBlock
            icon="flag-outline"
            label="Result Date"
            date={resultDate.date}
            time={resultDate.time}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  grid: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  dateBlock: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.sm,
  },
  dateIcon: {
    marginBottom: SPACING.xs,
  },
  dateLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '400',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '700',
  },
  dateTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});
