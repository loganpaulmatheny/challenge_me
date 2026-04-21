import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Card from "../Card/Card";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import { useUser } from "../../../context/UserContext";
import { useToast } from "../../../context/ToastContext";

import "./ChallengeCard.css";

const CATEGORY_TINT = {
  // Legacy seed data values (short lowercase)
  "food":   "gold",
  "social": "teal",
  "arts":   "gold",
  "shop":   "gold",
  "spots":  "terra",
  "explore": "terra",
  "outdoor": "terra",
  "fitness": "terra",
  "wellness": "mist",
  "creative": "gold",
  "cozy":   "mist",
  // Full display names (from challengeOptions.js)
  "Food & Drink": "gold",
  "Social": "teal",
  "Solo Adventures": "terra",
  "Outdoors": "terra",
  "Creative": "gold",
  "Cozy": "mist",
  "Slow Living": "mist",
  "Self Care": "mist",
  "Romantic": "teal",
  "City Exploration": "terra",
  "Hidden Gems": "terra",
  "Touristy (but fun)": "terra",
  "Neighborhood Walks": "teal",
  "Fitness": "terra",
  "Wellness": "mist",
  "Shopping": "gold",
  "Nightlife": "terra",
  "Books & Cafes": "gold",
  "Art & Museums": "gold",
  "Music & Events": "terra",
  "Photography": "gold",
  "Date Ideas": "teal",
  "Friends Hangout": "teal",
  "Group Activities": "teal",
  "Introvert Friendly": "mist",
  "Seasonal": "mist",
  "Rainy Day": "mist",
  "Winter": "mist",
  "Summer": "teal",
  "Challenges": "teal",
  "Mini Quests": "teal",
  "XP Boost": "teal",
};

const STATUS_VARIANT = {
  "Not Started": "terra",
  "In Progress": "warning",
  "Completed": "complete",
};

export default function ChallengeCard({
  challenge,
  onImport,
  editableMode = false,
  onRemove,
  onDelete,
}) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(challenge.liked || false);
  const [likesCount, setLikesCount] = useState(challenge.stats?.likes || 0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Sync when parent re-renders with the real liked state from context
  useEffect(() => { setLiked(challenge.liked || false); }, [challenge.liked]);
  const { user, refreshUser } = useUser();
  const toast = useToast();
  const isOwner = user && challenge.createdBy === user._id;

  const tint = CATEGORY_TINT[challenge.category] || null;
  const avatarVariant = tint === "terra" ? "terra" : tint === "gold" ? "gold" : "teal";
  const creatorInitials = (challenge.creator?.username || "??").slice(0, 2).toUpperCase();
  const [creatorImgError, setCreatorImgError] = useState(false);

  const goToDetail = () => {
    navigate(`/challenge/${challenge._id}`, {
      state: { editable: editableMode },
    });
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/challenges/like/${challenge._id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikesCount((prev) => (data.liked ? prev + 1 : prev - 1));
      refreshUser();
      if (data.liked) toast.info("Added to your liked challenges", "Liked");
    } catch {
      toast.error("Could not update like.");
    }
  };

  const handleUnsave = (e) => {
    e.stopPropagation();
    onRemove && onRemove(challenge._id);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onImport && onImport(challenge._id);
  };

  return (
    <Card tint={tint} className="challenge-card-wrapper">
      <div className="challenge-card">
        <header className="challenge-header">
          <h3 className="challenge-title">
            {editableMode ? (
              <span className="challenge-title-btn">{challenge.title}</span>
            ) : (
              <button
                type="button"
                className="challenge-title-btn"
                onClick={goToDetail}
                aria-label={`View challenge: ${challenge.title}`}
              >
                {challenge.title}
              </button>
            )}
          </h3>
          {challenge.status && (
            <Badge variant={STATUS_VARIANT[challenge.status] || "default"}>
              {challenge.status}
            </Badge>
          )}
          <div className="challenge-creator">
            {challenge.creator?.profileImageURL && !creatorImgError ? (
              <img
                src={challenge.creator.profileImageURL}
                alt=""
                aria-hidden="true"
                className="ci-card-avatar-img"
                onError={() => setCreatorImgError(true)}
              />
            ) : (
              <div
                className={`ci-card-avatar ci-card-avatar-${avatarVariant}`}
                aria-hidden="true"
              >
                {creatorInitials}
              </div>
            )}
            <span className="challenge-creator-name">
              <span className="sr-only">Created by </span>
              {challenge.creator?.username || "Anonymous"}
            </span>
          </div>
        </header>

        {challenge.description && (
          <p className="challenge-desc">{challenge.description}</p>
        )}

        <div className="challenge-tags">
          <Badge variant="primary">{challenge.category}</Badge>
          <Badge variant="gold">{challenge.neighborhood}</Badge>
          <Badge variant="default">{challenge.timeWindow}</Badge>
        </div>

        <div className="challenge-brushstroke" aria-hidden="true" />

        {editableMode && (
          <button
            type="button"
            className="challenge-continue-cta"
            onClick={goToDetail}
            aria-label={`Open ${challenge.title} to complete steps`}
          >
            {challenge.status === "Completed"
              ? "✓ View completed steps"
              : "Continue steps →"}
          </button>
        )}

        <footer className="challenge-footer">
          <span className="challenge-likes" aria-live="polite" aria-atomic="true">{likesCount} likes</span>
          <div className="challenge-actions">
            <Button
              variant={liked ? "info" : "ghost-info"}
              size="sm"
              onClick={handleLike}
              aria-label={liked ? "Unlike challenge" : "Like challenge"}
              aria-pressed={liked}
            >
              {liked ? "♥ Liked" : "♡ Like"}
            </Button>

            {!editableMode && (
              <Button
                variant={challenge?.saved ? "terra" : "ghost-terra"}
                size="sm"
                onClick={challenge?.saved ? handleUnsave : handleSave}
                aria-label={challenge?.saved ? "Remove from saved" : "Save challenge"}
                aria-pressed={!!challenge?.saved}
              >
                {challenge?.saved ? "✿ Saved" : "✿ Save"}
              </Button>
            )}

            {isOwner && !confirmDelete && (
              <Button
                variant="ghost-terra"
                size="sm"
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                aria-label="Delete this challenge"
              >
                Delete
              </Button>
            )}

            {isOwner && confirmDelete && (
              <>
                <Button
                  variant="error"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete && onDelete(challenge._id);
                  }}
                  aria-label="Confirm delete challenge"
                >
                  Yes, delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                  aria-label="Cancel delete"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </footer>
      </div>
    </Card>
  );
}

ChallengeCard.propTypes = {
  challenge: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    neighborhood: PropTypes.string,
    timeWindow: PropTypes.string,
    status: PropTypes.string,
    liked: PropTypes.bool,
    saved: PropTypes.bool,
    createdBy: PropTypes.string,
    creator: PropTypes.shape({
      username: PropTypes.string,
      profileImageURL: PropTypes.string,
    }),
    stats: PropTypes.shape({
      likes: PropTypes.number,
    }),
  }).isRequired,
  onImport: PropTypes.func,
  onRemove: PropTypes.func,
  onDelete: PropTypes.func,
  editableMode: PropTypes.bool,
};
