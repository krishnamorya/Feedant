import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';

interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  valueColor?: string;
  style?: ViewStyle;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  valueColor = COLORS.textPrimary,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      {value && <Text style={[styles.value, { color: valueColor }]}>{value}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: SPACING.md,
    width: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: '400',
  },
  value: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
});
