import { useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import { personalizeChallenges } from "../utils/personalization";

export default function Feed() {
    const [challenges, setChallenges] = useState([]);
    const [profile, setProfile] = useState(null);

    const userId = "user1";

    useEffect(() => {
        const load = async () => {
            const challengesData = await fetch("/api/challenges", { credentials: "include" }).then(r => r.json());

            const likedIds = await fetch("/api/interactions/likes", {
                credentials: "include"
            }).then(r => r.json());

            const enriched = challengesData.map(c => ({
                ...c,
                liked: likedIds.includes(c._id),
            }));

            setChallenges(enriched);
        };

        load();
    }, []);

    const importChallenge = async (id) => {
        await fetch(`/api/profile/import/${id}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
    };

    return (
        <div className="feed-container">

        <div className="filter-bar">
          <div className="filter-chip active">All</div>
          <div className="filter-chip">Food</div>
          <div className="filter-chip">Movies</div>
        </div>
      
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