import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActionButton } from '@/components/ui/ActionButton';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface ReferralSectionProps {
  referralLink: string;
  earnPerSignup: number;
  onCopyLink?: () => void;
  onReferNow?: () => void;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({
  referralLink,
  earnPerSignup,
  onCopyLink,
  onReferNow,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="megaphone" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Refer & Earn more discount</Text>
        </View>
      </View>

      <View style={styles.linkRow}>
        <View style={styles.linkInput}>
          <Ionicons name="link-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
        </View>
        <TouchableOpacity style={styles.copyButton} onPress={onCopyLink} activeOpacity={0.7}>
          <Text style={styles.copyButtonText}>Copy Link</Text>
        </TouchableOpacity>
        <ActionButton
          title="Refer Now"
          variant="primary"
          style={styles.referButton}
          onPress={onReferNow}
        />
      </View>

      <Text style={styles.earnText}>
        You earn <Text style={styles.earnAmount}>₹{earnPerSignup}</Text> for every signup
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  linkInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  linkText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    flex: 1,
  },
  copyButton: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  copyButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  referButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  earnText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.sm,
  },
  earnAmount: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
