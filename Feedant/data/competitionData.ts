export const competitionData = {
  id: '1',
  title: 'Feedants Classical Dance',
  isRegistered: true,
  tags: ['Dance', 'Multi-Win'],
  certificateInfo: 'Winners get certificate',
  prizePool: 1500,
  entryFee: 99,
  totalSpots: 20,
  bookedSpots: 1,

  judge: {
    name: 'Manju Duby',
    title: 'Professional Kathak Dancer',
    experience: '12+ Years of Experience',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    introVideoUrl: 'https://example.com/intro-video',
  },

  registrationDeadline: '2026-09-24T22:04:00Z',

  importantDates: {
    registerBefore: {
      date: '10 Aug 26',
      time: '11:50 PM',
    },
    submissionStarts: {
      date: '6 Aug 26',
      time: '04:00 AM',
    },
    submissionEnds: {
      date: '30 Aug 26',
      time: '11:55 PM',
    },
    resultDate: {
      date: '1 Sept 26',
      time: '11:50 PM',
    },
  },

  previousWinners: [
    {
      id: '1',
      name: 'Riya Shah',
      rank: '1st Winner',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Aarav Mehta',
      rank: '1st Winner',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '3',
      name: 'Neha Verma',
      rank: '2nd Winner',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '4',
      name: 'Ishita',
      rank: '3rd Winner',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '5',
      name: 'Choudhary',
      rank: '3rd Winner',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
  ],

  aboutCompetition: `This is an online classical dance competition open for all age groups.\nParticipate from anywhere and showcase your talent.\nExpress your passion through traditional dance.`,

  judgingParameters: `Participants will be judged on the following criteria:\n• Technique & Form (30%)\n• Expression & Emotion (25%)\n• Rhythm & Timing (20%)\n• Creativity & Choreography (15%)\n• Overall Presentation (10%)`,

  rulesAndEligibility: `• Open to all age groups\n• Video must be between 2-5 minutes\n• Only classical dance forms are accepted\n• No copyrighted music allowed\n• One submission per participant\n• Participants must be registered before the deadline`,

  rewards: [
    { position: '1st Winner', amount: 550, icon: '🏆' },
    { position: '2nd Winner', amount: 300, icon: '🥈' },
    { position: '3rd Winner', amount: 240, icon: '🥉' },
    { position: '4th Winner', amount: 200, icon: '⭐' },
    { position: '5th Winner', amount: 130, icon: '⭐' },
    { position: '6th Winner', amount: 80, icon: '⭐' },
  ],

  disclaimer: 'Only contributions from paid participants will be considered for judging.',

  referral: {
    link: 'https://feedants.com/r/referral123',
    earnPerSignup: 10,
  },

  testimonialText: 'Hear From Our Users',
  testimonialSubtext: 'See what participants say about Feedants',
};
