import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import PropTypes from "prop-types";

import Card from "../Card/Card";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import Avatar from "../Avatar/Avatar";
import { useUser } from "../../../context/UserContext";

import "./ChallengeCard.css";

export default function ChallengeCard({
  challenge,
  onImport,
  editableMode = false,
  onRemove,
  onUnsave,
}) {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(challenge.liked || false);
  const [likesCount, setLikesCount] = useState(challenge.stats?.likes || 0);
  const { user } = useUser();
  const isOwner = user && challenge.createdBy === user._id;
  const [status, setStatus] = useState(challenge.completed)

  const goToDetail = () => {
    navigate(`/challenge/${challenge._id}`, {
      state: { editable: editableMode },
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to unsave challenge?")) {
      onRemove && onRemove(challenge._id);
    }
  }

  return (
    <Card interactive
      tabIndex={0}
      className={"challenge-card-wrapper"}
    >

      <div className="challenge-card">
        <div className="challenge-header">
          <h3
            className="challenge-title"
          ><span className="clickable-title"
            title={challenge.title}
            onClick={goToDetail}
          >
              {challenge.title?.length > 30
                ? challenge.title.slice(0, 30) + "..."
                : challenge.title}
            </span>
          </h3>
          {challenge.status && (
            <span className={`status-pill ${challenge.status.toLowerCase().replace(" ", "-")}`}>
              {challenge.status}
            </span>
          )}

          <div className="challenge-creator">
            <Avatar
              src={challenge.creator?.profileImageURL}
              username={challenge.creator?.username || "??"}
              size={28}
            />
            <span>{challenge.creator?.username || "Anonymous"}</span>
          </div>
        </div>

        <p className="challenge-desc" title={challenge.description}>
          {challenge.description?.length > 40
            ? challenge.description.slice(0, 40) + "..."
            : challenge.description}
        </p>

        <div className="challenge-tags">
          <Badge variant="primary">{challenge.category}</Badge>
          <Badge variant="soft">{challenge.neighborhood}</Badge>
          <Badge variant="soft">{challenge.timeWindow}</Badge>
        </div>

        <div className="challenge-footer">
          <span>{likesCount} likes</span>

          <div className="challenge-actions">

            <Button
              variant={liked ? "primary" : "soft"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setLiked((prev) => !prev);
                setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
              }}
            >
              {liked ? "Liked" : "Like"}
            </Button>

            {!editableMode && (
              <Button
                variant={challenge?.saved ? "primary" : "secondary"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();

                  if (challenge?.saved) {
                    onRemove && onRemove(challenge._id);
                  } else {
                    onImport && onImport(challenge._id);
                  }
                }}
              >
                {challenge?.saved ? "Saved" : "Save"}
              </Button>
            )}

            {isOwner ||
              (editableMode && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  Unsave
                </Button>
              ))}
          </div>
        </div>
      </div>
    </Card >
  );
}

ChallengeCard.propTypes = {
  challenge: PropTypes.obj,
  onImport: PropTypes.func,
  onRemove: PropTypes.func,
  editableMode: PropTypes.bool,
};
