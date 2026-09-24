import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { COLORS, SPACING } from '@/constants/theme';

interface Winner {
  id: string;
  name: string;
  rank: string;
  avatarUrl: string;
}

interface PreviousWinnersProps {
  winners: Winner[];
}

export const PreviousWinners: React.FC<PreviousWinnersProps> = ({ winners }) => {
  return (
    <View style={styles.container}>
      <SectionHeader title="Previous Winners" />
      <FlatList
        data={winners}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Avatar
            uri={item.avatarUrl}
            size={64}
            borderColor={COLORS.primary}
            borderWidth={2}
            label={item.name}
            sublabel={item.rank}
            showPlayIcon={true}
            style={styles.winnerItem}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: SPACING.lg,
    marginTop: SPACING.sm,
  },
  listContent: {
    paddingRight: SPACING.lg,
    gap: SPACING.lg,
  },
  winnerItem: {
    marginRight: SPACING.xs,
  },
});
