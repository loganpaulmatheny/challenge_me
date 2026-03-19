import { useEffect, useState } from "react";
import ChallengeCard from "../../components/ui/ChallengeCard/ChallengeCard";
import Chip from "../../components/ui/Chip/Chip";

import { useUser } from "../../context/UserContext";

export default function Feed() {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState("All");

  const { profile, likedIds, setProfile } = useUser();

  useEffect(() => {
    fetch("/api/challenges", { credentials: "include" })
      .then((r) => r.json())
      .then(setChallenges);
  }, []);

  const filtered =
    filter === "All"
      ? challenges
      : challenges.filter((c) => c.category === filter);

  const importChallenge = async (id) => {
    const alreadySaved = profile?.savedChallenges?.some(
      (c) => c.challengeId.toString() === id
    );

    if (alreadySaved) return;

    await fetch(`/api/profile/import/${id}`, {
      method: "POST",
      credentials: "include",
    });

    // update local profile state
    const newEntry = {
      challengeId: id,
      status: "Not Started",
      progress: [],
    };

    setProfile((prev) => ({
      ...prev,
      savedChallenges: [...(prev.savedChallenges || []), newEntry],
    }));
  };

  if (filtered.length === 0) {
    return <div>No Challenges found.</div>;
  }

  return (
    <div className="feed-container">
      <div className="filter-bar">
        {["All", "food", "movies", "explore"].map((f) => (
          <Chip
            key={f}
            label={f}
            active={filter === f}
            onClick={() => setFilter(f)}
          />
        ))}
      </div>

      {filtered.map((c) => {
        const saved = profile?.savedChallenges?.some(
          (sc) => sc.challengeId.toString() === c._id
        );

        const liked = likedIds.includes(c._id);

        return (
          <ChallengeCard
            key={c._id}
            challenge={{ ...c, saved, liked }}
            onImport={importChallenge}
          />
        );
      })}
    </div>
  );
}