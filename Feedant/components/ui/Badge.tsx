import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'outlined' | 'filled' | 'success';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'outlined', style }) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  filled: {
    backgroundColor: COLORS.primaryLight,
  },
  success: {
    backgroundColor: '#E8F5E9',
  },
  text: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  outlinedText: {
    color: COLORS.textSecondary,
  },
  filledText: {
    color: COLORS.primary,
  },
  successText: {
    color: COLORS.registered,
  },
});
