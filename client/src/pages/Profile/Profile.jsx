import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { useUser } from "../../context/UserContext";
import Avatar from "../../components/ui/Avatar/Avatar";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";
import Card from "../../components/ui/Card/Card";
import EditProfileModal from "../../components/EditProfileModal";
import "./Profile.css";

export default function Profile() {
  const { user, profile, refreshUser } = useUser();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    document.title = user ? `${user.username} — ChallengeMe` : "Profile — ChallengeMe";
  }, [user]);

  if (!user || !profile) {
    return (
      <div className="profile-loading" role="status" aria-live="polite">
        Loading profile…
      </div>
    );
  }

  const getLevelProgress = (xp = 0, level = 1) => {
    const base = (level - 1) * 100;
    const next = level * 100;
    return {
      pct: Math.min(Math.max(((xp - base) / (next - base)) * 100, 0), 100),
      nextXP: next,
    };
  };

  const { pct, nextXP } = getLevelProgress(profile.xp || 0, profile.level || 1);

  const saved    = profile.savedChallenges?.length ?? 0;
  const completed = profile.savedChallenges?.filter((c) => c.status === "Completed").length ?? 0;
  const inProgress = profile.savedChallenges?.filter((c) => c.status === "In Progress").length ?? 0;

  return (
    <main className="profile-page">
      <nav className="profile-back-nav" aria-label="Page navigation">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} aria-label="Go back">
          ← Back
        </Button>
      </nav>

      {/* ── Identity card ── */}
      <Card tint="teal" className="profile-identity-card">
        <div className="profile-identity">
          <div className="profile-avatar-area">
            <Avatar
              src={user.profileImageURL}
              username={user.username || "?"}
              size={80}
            />
          </div>
          <div className="profile-identity-info">
            <h1 className="profile-display-name">
              {user.name || user.username}
            </h1>
            <p className="profile-username">@{user.username}</p>
            {(user.bio) && (
              <p className="profile-bio">{user.bio}</p>
            )}
            {(user.city || user.state) && (
              <p className="profile-location" aria-label="Location">
                <span aria-hidden="true">📍</span>{" "}
                {[user.city, user.state].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
          <div className="profile-edit-area">
            <Button
              variant="soft"
              size="sm"
              onClick={() => setShowEdit(true)}
              aria-label="Edit your profile"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Level & XP ── */}
      <Card>
        <section aria-labelledby="profile-xp-heading">
        <h2 id="profile-xp-heading" className="sr-only">Level & XP</h2>
        <div className="profile-level-section">
          <div className="profile-level-header">
            <span className="profile-level-label">
              <span aria-hidden="true">⚡</span> Level {profile.level || 1}
            </span>
            <span className="profile-xp-text" aria-hidden="true">
              {profile.xp || 0} / {nextXP} XP
            </span>
          </div>
          <div
            className="profile-xp-track"
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`XP progress: ${Math.round(pct)}% to next level`}
          >
            <div className="profile-xp-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="profile-xp-hint">
            {nextXP - (profile.xp || 0)} XP until Level {(profile.level || 1) + 1}
          </p>
        </div>
        </section>
      </Card>

      {/* ── Stats ── */}
      <h2 className="sr-only" id="profile-stats-heading">Your Statistics</h2>
      <div className="profile-stats-row" role="list" aria-labelledby="profile-stats-heading">
        <StatCard label="Saved" value={saved} icon="🗂️" />
        <StatCard label="In Progress" value={inProgress} icon="🔥" />
        <StatCard label="Completed" value={completed} icon="✅" />
      </div>

      {/* ── Badges ── */}
      {profile.badges?.length > 0 && (
        <Card>
          <section aria-labelledby="badges-heading" className="profile-badges-section">
            <h2 id="badges-heading" className="profile-section-heading">
              Badges Earned
            </h2>
            <div className="profile-badges" role="list">
              {profile.badges.map((b, i) => (
                <Badge key={i} variant="success" role="listitem">
                  {b}
                </Badge>
              ))}
            </div>
          </section>
        </Card>
      )}

      {/* ── No badges yet ── */}
      {(!profile.badges || profile.badges.length === 0) && (
        <Card tint="mist">
          <div className="profile-empty-badges">
            <span aria-hidden="true">🏅</span>
            <p>Complete challenges to earn your first badge!</p>
            <Button variant="primary" size="sm" onClick={() => navigate("/feed")}>
              Browse Challenges
            </Button>
          </div>
        </Card>
      )}

      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onUserUpdate={async () => {
            await refreshUser();
            setShowEdit(false);
          }}
        />
      )}
    </main>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <Card role="listitem" className="profile-stat-card">
      <div className="profile-stat">
        <span className="profile-stat-icon" aria-hidden="true">{icon}</span>
        <span className="profile-stat-value">{value}</span>
        <span className="profile-stat-label">{label}</span>
      </div>
    </Card>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
};

Profile.propTypes = {};
