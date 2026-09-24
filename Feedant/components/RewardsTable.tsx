import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { InfoRow } from '@/components/ui/InfoRow';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface Reward {
  position: string;
  amount: number;
  icon: string;
}

interface RewardsTableProps {
  rewards: Reward[];
}

export const RewardsTable: React.FC<RewardsTableProps> = ({ rewards }) => {
  return (
    <View style={styles.container}>
      <SectionHeader
        title="Rewards"
        subtitle=""
        rightElement={
          <Text style={styles.allPositions}>(All Positions)</Text>
        }
      />
      <View style={styles.table}>
        {rewards.map((reward, index) => (
          <View key={reward.position}>
            <InfoRow
              icon={<Text style={styles.icon}>{reward.icon}</Text>}
              label={reward.position}
              value={`₹ ${reward.amount}`}
              valueColor={COLORS.primary}
            />
            {index < rewards.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  allPositions: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  table: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
  icon: {
    fontSize: 18,
  },
});
