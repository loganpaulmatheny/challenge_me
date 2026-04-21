import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";

import Card from "../Card/Card";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import Avatar from "../Avatar/Avatar";
import { useUser } from "../../../context/UserContext";

import "./ChallengeCard.css";

const CATEGORY_TINT = {
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
  const { user } = useUser();
  const isOwner = user && challenge.createdBy === user._id;

  const tint = CATEGORY_TINT[challenge.category] || null;

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
    } catch (err) {
      console.error("Failed to toggle like:", err);
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
          <h3 className="challenge-title" onClick={goToDetail}>
            {challenge.title}
          </h3>
          {challenge.status && (
            <Badge variant={STATUS_VARIANT[challenge.status] || "default"}>
              {challenge.status}
            </Badge>
          )}
          <div className="challenge-creator">
            <Avatar
              src={challenge.creator?.profileImageURL}
              username={challenge.creator?.username || "??"}
              size={24}
            />
            <span className="challenge-creator-name">
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

        <footer className="challenge-footer">
          <span className="challenge-likes">{likesCount} likes</span>
          <div className="challenge-actions">
            <Button
              variant={liked ? "primary" : "soft"}
              size="sm"
              onClick={handleLike}
              aria-label={liked ? "Unlike challenge" : "Like challenge"}
              aria-pressed={liked}
            >
              {liked ? "Liked" : "Like"}
            </Button>

            {!editableMode && (
              <Button
                variant={challenge?.saved ? "primary" : "secondary"}
                size="sm"
                onClick={challenge?.saved ? handleUnsave : handleSave}
                aria-label={challenge?.saved ? "Remove from saved" : "Save challenge"}
                aria-pressed={!!challenge?.saved}
              >
                {challenge?.saved ? "Saved" : "Save"}
              </Button>
            )}

            {isOwner && editableMode && (
              <Button
                variant="terra"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove && onRemove(challenge._id);
                }}
              >
                Unsave
              </Button>
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
