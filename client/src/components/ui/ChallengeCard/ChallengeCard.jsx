import { useNavigate } from "react-router-dom";

import Card from "../Card/Card";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import Avatar from "../Avatar/Avatar";
import { useState } from "react";

import "./ChallengeCard.css";

export default function ChallengeCard({ challenge, onImport }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(challenge.liked);

  const goToDetail = () => {
    navigate(`/challenge/${challenge._id}`);
  };

  return (
    <Card interactive>
      {/* CLICKABLE CONTENT */}
      <div className="challenge-click" onClick={goToDetail}>
        {/* HEADER */}
        <div className="challenge-header">
          <div className="challenge-title-block">
            <h3>{challenge.title}</h3>
            <div style={{ fontSize: 12, color: "var(--color-muted)" }}>
  {challenge.creator?.username || "Anonymous"}
</div>
            <p className="challenge-desc">{challenge.description}</p>
          </div>

          {/* CREATOR */}
          <Avatar
  src={challenge.creator?.profileImageURL}
  username={challenge.creator?.username || "??"}
/>
        </div>

        {/* TAGS */}
        <div className="challenge-tags">
          <Badge variant="primary">{challenge.category}</Badge>

          {challenge.tags?.map((t) => (
            <Badge key={t} variant="soft">
              {t}
            </Badge>
          ))}

          {challenge.tags?.map((t) => (
            <Badge key={t} variant="soft">
              {t}
            </Badge>
          ))}

          {challenge.saved && <Badge variant="success">Saved</Badge>}

          {challenge.stats?.likes > 20 && (
            <Badge variant="success">Trending</Badge>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="challenge-footer">
        <div className="challenge-stats">❤️ {challenge.stats?.likes || 0}</div>

        <div className="challenge-actions">
          <Button
            variant={liked ? "primary" : "soft"}
            onClick={async (e) => {
              e.stopPropagation();

              const res = await fetch(`/api/challenges/like/${challenge._id}`, {
                method: "POST",
                credentials: "include",
              });

              const data = await res.json();

              setLiked(data.liked);
            }}
          >
            ❤️
          </Button>

          <Button
            variant="soft"
            onClick={(e) => {
              e.stopPropagation(); // prevent card click
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
