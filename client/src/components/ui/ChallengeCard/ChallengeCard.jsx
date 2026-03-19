import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Card from "../Card/Card";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import Avatar from "../Avatar/Avatar";

import "./ChallengeCard.css";

export default function ChallengeCard({ challenge, onImport }) {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(challenge.liked || false);
  const [likesCount, setLikesCount] = useState(
    challenge.stats?.likes || 0
  );

  const goToDetail = () => {
    navigate(`/challenge/${challenge._id}`);
  };

  return (
    <Card interactive onClick={goToDetail}>
      
      <div className="challenge-header">
        <div className="challenge-title-block">
          <h3>{challenge.title}</h3>
  
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Avatar
              src={challenge.creator?.profileImageURL}
              username={challenge.creator?.username || "??"}
              size={28}
            />
            <span style={{ fontSize: 12 }}>
              {challenge.creator?.username || "Anonymous"}
            </span>
          </div>
  
          <p className="challenge-desc">
            {challenge.description}
          </p>
        </div>
      </div>
  
      <div className="challenge-tags">
        <Badge variant="primary">{challenge.category}</Badge>
        <Badge variant="soft">{challenge.neighborhood}</Badge>
        <Badge variant="soft">{challenge.timeWindow}</Badge>
  
        {challenge.saved && (
          <Badge variant="success">Saved</Badge>
        )}
  
        {likesCount > 20 && (
          <Badge variant="success">Trending</Badge>
        )}
      </div>
  
      {/* progress */}
      {challenge.progress && (
        <div style={{ fontSize: 12, marginTop: 6 }}>
          {
            challenge.progress.filter((p) => p.completed).length
          } / {challenge.progress.length} steps
        </div>
      )}
  
      {/* status */}
      {challenge.status && (
        <span style={{ fontSize: 12, color: "#6BAA8E" }}>
          {challenge.status}
        </span>
      )}
  
      <div className="challenge-footer">
        <div className="challenge-stats">
          {likesCount} likes
        </div>
  
        <div className="challenge-actions">
          <Button
            variant={liked ? "primary" : "soft"}
            onClick={async (e) => {
              e.stopPropagation();
  
              const next = !liked;
              setLiked(next);
              setLikesCount((c) => (next ? c + 1 : c - 1));
  
              try {
                await fetch(`/api/challenges/like/${challenge._id}`, {
                  method: "POST",
                  credentials: "include",
                });
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Like
          </Button>
  
          <Button
            variant="soft"
            onClick={(e) => {
              e.stopPropagation();
              onImport(challenge._id);
            }}
          >
            Save
          </Button>
        </div>
      </div>
  
    </Card>
  );
}