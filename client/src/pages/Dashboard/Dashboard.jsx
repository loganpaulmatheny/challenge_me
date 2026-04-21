import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useUser } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";

import ProfileInfo from "../../components/ProfileInfo/ProfileInfo.jsx";
import Skeleton from "../../components/ui/Skeleton/Skeleton.jsx";
import ChallengeCard from "../../components/ui/ChallengeCard/ChallengeCard";
import Badge from "../../components/ui/Badge/Badge";


import "./Dashboard.css";

export default function Dashboard() {
  const { user, profile, refreshUser, setProfile } = useUser();
  const toast = useToast();
  const [savedChallenges, setSavedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = "Dashboard — ChallengeMe"; }, []);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await fetch("/api/profile/challenges", { credentials: "include" });
        if (!res.ok) { setSavedChallenges([]); setLoading(false); return; }
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
      fetch("/api/profile", { credentials: "include" })
        .then((r) => r.json())
        .then((p) => { if (p) setProfile(p); })
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
      setSavedChallenges((prev) => prev.filter((c) => c._id.toString() !== challengeId));
      await refreshUser();
      toast.neutral("Removed from your dashboard");
    } catch {
      toast.error("Could not remove challenge.");
    }
  };

  const handleDelete = async (challengeId) => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setSavedChallenges((prev) => prev.filter((c) => c._id.toString() !== challengeId));
      await refreshUser();
      toast.success("Challenge deleted");
    } catch {
      toast.error("Could not delete challenge.");
    }
  };

  const getLevelProgress = (xp = 0, level = 1) => {
    const base = (level - 1) * 100;
    const next = level * 100;
    return {
      progress: Math.min(Math.max(((xp - base) / (next - base)) * 100, 0), 100),
      nextLevelXP: next,
    };
  };

  const level = profile?.level || 1;
  const xp = profile?.xp || 0;
  const { progress, nextLevelXP } = getLevelProgress(xp, level);
  const xpToNext = nextLevelXP - xp;

  const completed   = savedChallenges.filter((c) => c.status === "Completed").length;
  const inProgress  = savedChallenges.filter((c) => c.status === "In Progress").length;
  const badgeCount  = profile?.badges?.length || 0;

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>Your Dashboard</h1>
        <p className="muted">Track your progress and continue your challenges</p>
      </header>

      <section aria-label="Your Profile">
        <ProfileInfo user={user} onUserUpdate={refreshUser} />
      </section>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Challenge Statistics</h2>
        <div className="stat-grid" role="list" aria-label="Your challenge statistics">
          <StatCard
            icon="🗺"
            label="On My List"
            value={savedChallenges.length}
            sub="Adventures saved to explore"
          />
          <StatCard
            icon="✦"
            label="Completed"
            value={completed}
            sub="Quests sealed in the Grove"
            delta={completed > 0 ? `${completed} done` : null}
            deltaType="up"
          />
          <StatCard
            icon="⚔"
            label="In Progress"
            value={inProgress}
            sub="Currently exploring"
          />
          <StatCard
            icon="⚡"
            label="Total XP"
            value={xp}
            sub={`Level ${level} · ${xpToNext} XP to Level ${level + 1}`}
          />
          <StatCard
            icon="🏅"
            label="Badges"
            value={badgeCount}
            sub={
              badgeCount > 0
                ? profile.badges.slice(0, 2).join(" · ")
                : "Keep exploring to earn badges"
            }
          />
        </div>
      </section>

      <section className="level-section" aria-labelledby="level-heading">
        <div className="level-header">
          <h2 id="level-heading">Level {level}</h2>
          <span className="xp-text" aria-hidden="true">
            {xp} / {nextLevelXP} XP
          </span>
        </div>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`XP progress: ${Math.round(progress)}%`}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </section>

      {badgeCount > 0 && (
        <section aria-labelledby="badges-heading">
          <h2 id="badges-heading">Your Badges</h2>
          <div className="badges-row" role="list">
            {profile.badges.map((b, i) => (
              <Badge key={i} variant="primary" role="listitem">{b}</Badge>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="challenges-heading">
        <div className="section-heading-row">
          <h2 id="challenges-heading">Your Challenges</h2>
          {!loading && savedChallenges.length > 0 && (
            <p className="section-hint">
              Hit <strong>Continue steps <span aria-hidden="true">→</span></strong> on any card to track your progress and earn XP.
            </p>
          )}
        </div>
        {loading ? (
          <div className="dashboard-challenges" role="status" aria-label="Loading challenges">
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ marginBottom: "var(--sp-md)" }}>
                <Skeleton variant="card" height={180} />
              </div>
            ))}
          </div>
        ) : savedChallenges.length === 0 ? (
          <div className="empty-state" role="status">
            No challenges yet. Go explore the feed to find one you like!
          </div>
        ) : (
          <div className="dashboard-challenges">
            {savedChallenges.map((c) => (
              <ChallengeCard
                key={c._id}
                challenge={{ ...c, saved: true }}
                editableMode={true}
                onRemove={handleRemove}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ icon, label, value, sub, delta, deltaType = "up" }) {
  return (
    <div className="stat-card" role="listitem" aria-label={`${label}: ${value}`}>
      {delta && (
        <span className={`stat-delta stat-delta-${deltaType}`} aria-hidden="true">
          {delta}
        </span>
      )}
      <span className="stat-icon" aria-hidden="true">{icon}</span>
      <div className="stat-num" aria-hidden="true">{value}</div>
      <div className="stat-label" aria-hidden="true">{label}</div>
      {sub && <div className="stat-sub" aria-hidden="true">{sub}</div>}
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  sub: PropTypes.string,
  delta: PropTypes.string,
  deltaType: PropTypes.oneOf(["up", "down"]),
};

Dashboard.propTypes = {};
