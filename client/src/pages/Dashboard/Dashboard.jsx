import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

import ProfileInfo from "../../components/ProfileInfo/ProfileInfo.jsx";
import ChallengeCard from "../../components/ui/ChallengeCard/ChallengeCard";
import Card from "../../components/ui/Card/Card";

import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useUser();

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
      <ProfileInfo user={user} onUserUpdate={() => {}} />

      {/* GAME STATS */}
      <div className="stats-grid">
        <Card>
          <h3>Challenges</h3>
          <p>{savedChallenges.length}</p>
        </Card>

        <Card>
          <h3>Completed</h3>
          <p>
            {
              savedChallenges.filter(
                (c) => c.status === "Completed"
              ).length
            }
          </p>
        </Card>

        <Card>
          <h3>In Progress</h3>
          <p>
            {
              savedChallenges.filter(
                (c) => c.status === "In Progress"
              ).length
            }
          </p>
        </Card>
      </div>

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
                onImport={() => {}}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}