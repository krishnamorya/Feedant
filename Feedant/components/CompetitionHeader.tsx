import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface CompetitionHeaderProps {
  title: string;
  isRegistered: boolean;
  tags: string[];
  certificateInfo: string;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  bookedSpots: number;
  onGoBack?: () => void;
}

export const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({
  title,
  isRegistered,
  tags,
  certificateInfo,
  prizePool,
  entryFee,
  totalSpots,
  bookedSpots,
  onGoBack,
}) => {
  const spotsLeft = totalSpots - bookedSpots;

  return (
    <View>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          <Text style={styles.backText}>Go back</Text>
        </TouchableOpacity>
        <View style={styles.langToggle}>
          <View style={styles.langActive}>
            <Text style={styles.langActiveText}>ENG</Text>
          </View>
          <Text style={styles.langInactiveText}>हिंदी</Text>
        </View>
      </View>

      {/* Competition Card */}
      <View style={styles.card}>
        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {isRegistered && (
            <View style={styles.registeredBadge}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.registered} />
              <Text style={styles.registeredText}>Registered</Text>
            </View>
          )}
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <Badge key={tag} label={tag} variant="outlined" />
          ))}
          <View style={styles.certificateRow}>
            <Ionicons name="ribbon-outline" size={14} color={COLORS.primary} />
            <Text style={styles.certificateText}>{certificateInfo}</Text>
          </View>
        </View>

        {/* Prize & Entry Fee */}
        <View style={styles.prizeRow}>
          <View style={styles.prizeBlock}>
            <Text style={styles.prizeLabel}>Prize Pool</Text>
            <Text style={styles.prizeAmount}>₹ {prizePool.toLocaleString()}</Text>
          </View>
          <View style={styles.prizeBlock}>
            <Text style={styles.prizeLabel}>Entry Fee</Text>
            <Text style={styles.entryFee}>₹ {entryFee}</Text>
          </View>
          <View style={styles.spotsBlock}>
            <View style={styles.spotsRow}>
              <Ionicons name="people-outline" size={14} color={COLORS.primary} />
              <Text style={styles.spotsText}>Only {spotsLeft} spots left</Text>
            </View>
            <Text style={styles.bookedText}>{bookedSpots} / {totalSpots} Booked</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  backText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    gap: SPACING.sm,
  },
  langActive: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  langActiveText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  langInactiveText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    paddingRight: SPACING.sm,
  },
  card: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  registeredText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.registered,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  certificateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certificateText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  prizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  prizeBlock: {
    flex: 1,
  },
  prizeLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  prizeAmount: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  entryFee: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  spotsBlock: {
    alignItems: 'flex-end',
  },
  spotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spotsText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  bookedText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
