import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

export const InfoCards: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Prize Money Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Ionicons name="play-circle" size={28} color={COLORS.primary} />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.cardTitle}>How will you receive{'\n'}prize money?</Text>
            <Text style={styles.cardSubtitle}>Watch video to know more</Text>
          </View>
        </View>
        <View style={styles.dividerVertical} />
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.infoItem} activeOpacity={0.7}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>Refund policy</Text>
          </TouchableOpacity>
          <View style={styles.secureRow}>
            <Ionicons name="lock-closed-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.secureText}>Secure payments powered by</Text>
          </View>
          <Text style={styles.razorpay}>Razorpay</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secureText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  razorpay: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 2,
    marginLeft: 18,
  },
});
