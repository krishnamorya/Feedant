import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabSelector } from '@/components/ui/TabSelector';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';

interface CompetitionTabsProps {
  aboutText: string;
  judgingText: string;
  rulesText: string;
}

const TABS = [
  { key: 'about', label: 'About Competition' },
  { key: 'judging', label: 'Judging Parameters' },
  { key: 'rules', label: 'Rules & Eligibility' },
];

export const CompetitionTabs: React.FC<CompetitionTabsProps> = ({
  aboutText,
  judgingText,
  rulesText,
}) => {
  const [activeTab, setActiveTab] = useState('about');
  const [expanded, setExpanded] = useState(false);

  const getContent = () => {
    switch (activeTab) {
      case 'about':
        return aboutText;
      case 'judging':
        return judgingText;
      case 'rules':
        return rulesText;
      default:
        return aboutText;
    }
  };

  const content = getContent();
  const shouldTruncate = content
  const displayContent = !expanded && shouldTruncate
    ? content.substring(0, 150) + '...'
    : content;

  return (
    <View style={styles.container}>
      <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <View style={styles.content}>
        <Text style={styles.contentText}>{displayContent}</Text>
        {shouldTruncate && (
          <TouchableOpacity
            style={styles.viewMore}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewMoreText}>
              {expanded ? 'View less' : 'View more'}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  content: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  contentText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: SPACING.sm,
  },
  viewMoreText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
