import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

import ProfileInfo from "../../components/ProfileInfo/ProfileInfo.jsx";
import ChallengeCard from "../../components/ui/ChallengeCard/ChallengeCard";
import Card from "../../components/ui/Card/Card";
import Badge from "../../components/ui/Badge/Badge";

import "./Dashboard.css";

export default function Dashboard() {
  const { user, setProfile, profile, refreshUser } = useUser();

  const [savedChallenges, setSavedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH SAVED CHALLENGES (from backend join)
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await fetch("/api/profile/challenges", {
          credentials: "include",
        });

        if (!res.ok) {
          setSavedChallenges([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setSavedChallenges(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  useEffect(() => {
    const handler = () => {
      fetch("/api/profile", {
        credentials: "include",
      })
        .then((r) => r.json())
        .then((p) => {
          if (p) {
            setProfile(p);
          }
        })
        .catch(console.error);
    };

    window.addEventListener("xpUpdated", handler);
    return () => window.removeEventListener("xpUpdated", handler);
  }, [setProfile]);

  const handleRemove = async (challengeId) => {
    try {
      await fetch(`/api/profile/challenge/${challengeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      // update UI instantly
      setSavedChallenges((prev) =>
        prev.filter((c) => c._id.toString() !== challengeId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getLevelProgress = (xp = 0, level = 1) => {
    const currentLevelXP = (level - 1) * 100;
    const nextLevelXP = level * 100;

    const progress =
      ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return {
      progress: Math.min(Math.max(progress, 0), 100),
      currentLevelXP,
      nextLevelXP,
    };
  };

  const { progress, currentLevelXP, nextLevelXP } = getLevelProgress(
    profile?.xp || 0,
    profile?.level || 1
  );

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Your Dashboard</h1>
        <p className="muted">
          Track your progress and continue your challenges
        </p>
      </div>

      {/* PROFILE */}
      <ProfileInfo user={user} onUserUpdate={refreshUser} />

      {/* GAME STATS */}
      <div className="stats-grid">
        <Card>
          <h3>Challenges</h3>
          <p>{savedChallenges.length}</p>
        </Card>

        <Card>
          <h3>Completed</h3>
          <p>
            {savedChallenges.filter((c) => c.status === "Completed").length}
          </p>
        </Card>

        <Card>
          <h3>In Progress</h3>
          <p>
            {savedChallenges.filter((c) => c.status === "In Progress").length}
          </p>
        </Card>
      </div>

      <section className="level-section">
        <div className="level-header">
          <h2>Level {profile?.level || 1}</h2>
          <span className="xp-text">
            {profile?.xp || 0} / {nextLevelXP} XP
          </span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </section>

      {profile?.badges?.length > 0 && (
        <section>
          <h2>Your Badges</h2>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {profile.badges.map((b, i) => (
              <Badge key={i} variant="primary">
                {b}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* CHALLENGES GRID */}
      <section>
        <h2>Your Challenges</h2>

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : savedChallenges.length === 0 ? (
          <div className="empty-state">
            No challenges yet. Go explore the feed.
          </div>
        ) : (
          <div className="feed-grid">
            {savedChallenges.map((c) => (
              <ChallengeCard
                key={c._id}
                challenge={c}
                editableMode={true}
                onImport={() => {}}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
