export function calculateLevel(xp) {
    return Math.floor(xp / 100) + 1;
  }
  
  export function checkBadges(profile) {
    const badges = [];
  
    if (profile.xp > 500) badges.push("Explorer");
    if (profile.xp > 1000) badges.push("City Master");
  
    return badges;
  }