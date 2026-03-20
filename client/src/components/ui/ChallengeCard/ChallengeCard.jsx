import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
}) {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(challenge.liked || false);
  const [likesCount, setLikesCount] = useState(challenge.stats?.likes || 0);
  const { user } = useUser();
  const isOwner = user && challenge.createdBy === user._id;

  const goToDetail = () => {
    navigate(`/challenge/${challenge._id}`, {
      state: { editable: editableMode },
    });
  };

  return (
    <Card interactive>
      <div className="challenge-card">
        <div className="challenge-header">
          <h3 className="challenge-title clickable-title" onClick={goToDetail}>
            {challenge.title}
          </h3>

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
          {challenge.description?.length > 20
            ? challenge.description.slice(0, 20) + "..."
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
              variant="soft"
              onClick={(e) => {
                e.stopPropagation();
                setLiked((prev) => !prev);
                setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
              }}
            >
              Like
            </Button>

            <Button
              variant="soft"
              onClick={(e) => {
                e.stopPropagation();
                onImport && onImport(challenge._id);
              }}
            >
              Save
            </Button>

            {isOwner && (
              <Button
                variant="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove && onRemove(challenge._id);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
