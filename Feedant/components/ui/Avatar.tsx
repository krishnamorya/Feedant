import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';

interface AvatarProps {
  uri: string;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
  label?: string;
  sublabel?: string;
  showPlayIcon?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 60,
  borderColor = COLORS.primary,
  borderWidth = 2,
  label,
  sublabel,
  showPlayIcon = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.imageWrapper,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor,
            borderWidth,
          },
        ]}
      >
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: size - borderWidth * 2,
              height: size - borderWidth * 2,
              borderRadius: (size - borderWidth * 2) / 2,
            },
          ]}
        />
        {showPlayIcon && (
          <View style={styles.playOverlay}>
            <View style={styles.playIcon}>
              <Text style={styles.playText}>▶</Text>
            </View>
          </View>
        )}
      </View>
      {label && <Text style={styles.label} numberOfLines={1}>{label}</Text>}
      {sublabel && <Text style={styles.sublabel} numberOfLines={1}>{sublabel}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 2,
    right: 7,
  },
  playText: {
    color: COLORS.white,
    fontSize: 10,
    marginLeft: 1,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginTop: SPACING.xs,
    maxWidth: 80,
    textAlign: 'center',
  },
  sublabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTeal,
    fontWeight: '600',
    maxWidth: 80,
    textAlign: 'center',
  },
});
