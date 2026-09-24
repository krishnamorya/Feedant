import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface DisclaimerBannerProps {
  text: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="information-circle-outline" size={18} color={COLORS.textSecondary} />
      <Text style={styles.text}>
        <Text style={styles.disclaimer}>Disclaimer: </Text>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  text: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  disclaimer: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
