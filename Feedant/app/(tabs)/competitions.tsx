import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompetitionHeader } from '@/components/CompetitionHeader';
import { JudgeCard } from '@/components/JudgeCard';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { ImportantDates } from '@/components/ImportantDates';
import { PreviousWinners } from '@/components/PreviousWinners';
import { CompetitionTabs } from '@/components/CompetitionTabs';
import { RewardsTable } from '@/components/RewardsTable';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { InfoCards } from '@/components/InfoCards';
import { ReferralSection } from '@/components/ReferralSection';
import { TestimonialSection } from '@/components/TestimonialSection';
import { ActionButton } from '@/components/ui/ActionButton';
import { competitionData } from '@/data/competitionData';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { fetchCompetitions } from '@/services/api';

export default function HomeScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchCompetitions();
        if (response?.data?.competitions?.length > 0) {
          const comp = response.data.competitions[0];
          
          const formatDate = (dateStr: string) => {
            const date = new Date(dateStr);
            return {
              date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }),
              time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
          };

          const mappedData = {
            id: comp._id,
            title: comp.title,
            isRegistered: false,
            tags: comp.tags || [],
            certificateInfo: comp.certificateEnabled ? 'Winners get certificate' : '',
            prizePool: comp.prizePool,
            entryFee: comp.entryFee,
            totalSpots: comp.maxParticipants,
            bookedSpots: comp.bookedCount || 0,
            judge: {
              name: comp.judge.name,
              title: comp.judge.title,
              experience: comp.judge.experience,
              avatarUrl: comp.judge.photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
              introVideoUrl: comp.judge.introVideoUrl || 'https://example.com/intro-video',
            },
            registrationDeadline: comp.registrationDeadline,
            importantDates: {
              registerBefore: formatDate(comp.registrationDeadline),
              submissionStarts: formatDate(comp.submissionStartDate),
              submissionEnds: formatDate(comp.submissionEndDate),
              resultDate: formatDate(comp.resultDate),
            },
            previousWinners: competitionData.previousWinners, // Mock data for now
            aboutCompetition: comp.about,
            judgingParameters: comp.judgingParameters?.map((p: any) => `• ${p.name} (${p.weightage}%)\n  ${p.description}`).join('\n\n') || '',
            rulesAndEligibility: comp.rules,
            rewards: comp.rewards?.map((r: any) => ({ position: r.label, amount: r.amount, icon: r.icon || '🏆' })) || [],
            disclaimer: comp.disclaimer,
            referral: {
              link: 'https://feedants.com/r/referral123',
              earnPerSignup: comp.referralBonusAmount || 10,
            },
            testimonialText: 'Hear From Our Users',
            testimonialSubtext: 'See what participants say about Feedants',
          };
          setData(mappedData);
        } else {
          setData(competitionData);
        }
      } catch (error) {
        console.error("Failed to fetch competitions:", error);
        setData(competitionData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!data) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Competition Header */}
        <CompetitionHeader
          title={data.title}
          isRegistered={data.isRegistered}
          tags={data.tags}
          certificateInfo={data.certificateInfo}
          prizePool={data.prizePool}
          entryFee={data.entryFee}
          totalSpots={data.totalSpots}
          bookedSpots={data.bookedSpots}
        />

        {/* Judge Card */}
        <JudgeCard
          name={data.judge.name}
          title={data.judge.title}
          experience={data.judge.experience}
          avatarUrl={data.judge.avatarUrl}
        />

        {/* Countdown Timer */}
        <View style={styles.timerWrapper}>
          <CountdownTimer
            targetDate={data.registrationDeadline}
          />
        </View>

        {/* Important Dates */}
        <ImportantDates
          registerBefore={data.importantDates.registerBefore}
          submissionStarts={data.importantDates.submissionStarts}
          submissionEnds={data.importantDates.submissionEnds}
          resultDate={data.importantDates.resultDate}
        />

        {/* Previous Winners */}
        <PreviousWinners winners={data.previousWinners} />

        {/* Competition Tabs (About, Judging, Rules) */}
        <CompetitionTabs
          aboutText={data.aboutCompetition}
          judgingText={data.judgingParameters}
          rulesText={data.rulesAndEligibility}
        />

        {/* Rewards Table */}
        <RewardsTable rewards={data.rewards} />

        {/* Disclaimer */}
        <DisclaimerBanner text={data.disclaimer} />

        {/* Info Cards */}
        <InfoCards />

        {/* Referral Section */}
        <ReferralSection
          referralLink={data.referral.link}
          earnPerSignup={data.referral.earnPerSignup}
        />

        {/* Testimonials */}
        <TestimonialSection
          title={data.testimonialText}
          subtitle={data.testimonialSubtext}
        />

        {/* Ad Placeholder */}
        <View style={styles.adPlaceholder}>
          <Ionicons name="megaphone-outline" size={16} color={COLORS.textMuted} />
          <Text style={styles.adText}>Ad Here</Text>
        </View>

        {/* Upload Submission Button */}
        <View style={styles.ctaWrapper}>
          <ActionButton
            title="Upload Submission"
            subtitle="Registered"
            variant="primary"
            style={styles.ctaButton}
          />
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  timerWrapper: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  adPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  adText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  ctaWrapper: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  ctaButton: {
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
  },
  bottomSpacer: {
    height: 20,
  },
});


