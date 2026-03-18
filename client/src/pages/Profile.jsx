import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const userId = "user1";

  useEffect(() => {
    fetch(`/api/profile?userId=${userId}`)
      .then(r => r.json())
      .then(setProfile);
  }, []);

  if (!profile) return null;

  return (
    <div>
      <h2>Level: {profile.level}</h2>
      <h3>XP: {profile.xp}</h3>

      {profile.savedChallenges?.map((c, i) => (
        <div key={i}>
          <h4>{c.status}</h4>
        </div>
      ))}
    </div>
  );
}