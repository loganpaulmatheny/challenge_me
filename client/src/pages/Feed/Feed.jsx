import { useEffect, useState } from "react";
import ChallengeCard from "../../components/ui/ChallengeCard/ChallengeCard";
import Chip from "../../components/ui/Chip/Chip";

export default function Feed() {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState("All");

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
    await fetch(`/api/profile/import/${id}`, {
      method: "POST",
      credentials: "include",
    });

    setChallenges((prev) =>
      prev.map((c) => (c._id === id ? { ...c, saved: true } : c))
    );
  };

  if (filtered.length===0)
    return <div>No Challenges found.</div>

  return (
    <div className="feed-container">
      <div className="filter-bar">
        {["All", "food", "movies"].map((f) => (
          <Chip
            key={f}
            label={f}
            active={filter === f}
            onClick={() => setFilter(f)}
          />
        ))}
      </div>

      {filtered.map((c) => (
        <ChallengeCard key={c._id} challenge={c} onImport={importChallenge} />
      ))}
    </div>
  );
}
