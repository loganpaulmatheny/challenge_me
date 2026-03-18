export function personalizeChallenges(challenges, profile) {
    if (!profile) return challenges;
  
    const savedIds = profile.savedChallenges?.map(c =>
      c.challengeId.toString()
    );
  
    return challenges
      .map(c => {
        let score = 0;
  
        if (savedIds?.includes(c._id)) score += 50;
  
        if (profile.badges?.includes("Explorer") && c.category === "outdoors")
          score += 20;
  
        score += c.stats.likes * 2;
  
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score);
  }