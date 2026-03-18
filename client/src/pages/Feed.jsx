import { useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import { personalizeChallenges } from "../utils/personalization";

export default function Feed() {
  const [challenges, setChallenges] = useState([]);
  const [profile, setProfile] = useState(null);

  const userId = "user1";

  useEffect(() => {
    const load = async () => {
      const c = await fetch("/api/challenges").then(r => r.json());
      const p = await fetch(`/api/profile?userId=${userId}`).then(r => r.json());

      setProfile(p);
      setChallenges(personalizeChallenges(c, p));
    };

    load();
  }, []);

  const importChallenge = async (id) => {
    await fetch(`/api/profile/import/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  };

  return (
    <div>
      {challenges.map(c => (
        <ChallengeCard
          key={c._id}
          challenge={c}
          onImport={importChallenge}
        />
      ))}
    </div>
  );
}