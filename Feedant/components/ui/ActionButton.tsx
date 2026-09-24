import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface ActionButtonProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  variant?: 'primary' | 'outlined' | 'teal';
  style?: ViewStyle;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  subtitle,
  onPress,
  variant = 'primary',
  style,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.title, styles[`${variant}Title` as keyof typeof styles]]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, styles[`${variant}Subtitle` as keyof typeof styles]]}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  teal: {
    backgroundColor: COLORS.primaryTeal,
  },
  disabled: {
    opacity: 0.6,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  primaryTitle: {
    color: COLORS.white,
  },
  outlinedTitle: {
    color: COLORS.primary,
  },
  tealTitle: {
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  primarySubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
  outlinedSubtitle: {
    color: COLORS.textSecondary,
  },
  tealSubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
});
