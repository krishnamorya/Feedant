import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
  style?: ViewStyle;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  label = 'Registration closes in',
  style,
}) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [targetDate]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        <Ionicons name="time-outline" size={16} color={COLORS.accentGreen} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.timerSection}>
        <Text style={styles.timerText}>
          {timeLeft.days}d : {String(timeLeft.hours).padStart(2, '0')}h :{' '}
          {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
          {String(timeLeft.seconds).padStart(2, '0')}s
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Ionicons name="alarm-outline" size={16} color={COLORS.white} />
        <Text style={styles.hurryText}>Hurry up!</Text>
      </View>
    </View>
  );
};

function getTimeLeft(targetDate: string) {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.countdownBg,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.accentGreen,
    fontWeight: '500',
  },
  timerSection: {
    flex: 1,
    alignItems: 'center',
  },
  timerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hurryText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.warning,
    fontWeight: '600',
  },
});
