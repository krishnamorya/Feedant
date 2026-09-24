import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { fetchHealthCheck, fetchCompetitions } from '@/services/api';

export default function HomeScreen() {
  const [serverStatus, setServerStatus] = useState<string>('Connecting to backend...');
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const health = await fetchHealthCheck();
        setServerStatus(`Backend Connected: ${health.message}`);
        
        const comps = await fetchCompetitions();
        setCompetitions(comps.data || comps);
      } catch (error) {
        setServerStatus('Failed to connect to backend.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Ionicons name="trophy-outline" size={48} color={COLORS.primary} />
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Browse all active competitions</Text>

        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText, 
            { color: serverStatus.includes('Connected') ? 'green' : 'red' }
          ]}>
            {serverStatus}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.listContainer}>
            {competitions.length > 0 ? (
              competitions.map((comp, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.cardTitle}>{comp.title || comp.name || 'Competition'}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noData}>No competitions found.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  statusContainer: {
    padding: SPACING.sm,
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  listContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  noData: {
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
  }
});
