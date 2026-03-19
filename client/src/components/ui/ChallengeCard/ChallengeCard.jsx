import { useNavigate } from "react-router-dom";

import Card from "../ui/Card/Card";
import Badge from "../ui/Badge/Badge";
import Button from "../ui/Button/Button";
import Avatar from "../ui/Avatar/Avatar";

import "./ChallengeCard.css";

export default function ChallengeCard({ challenge, onImport }) {
  const navigate = useNavigate();

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
            <p className="challenge-desc">
              {challenge.description}
            </p>
          </div>

          {/* CREATOR */}
          <Avatar username={challenge.createdBy} />
        </div>

        {/* TAGS */}
        <div className="challenge-tags">

          <Badge variant="primary">
            {challenge.category}
          </Badge>

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

          {challenge.stats?.likes > 20 && (
            <Badge variant="success">Trending</Badge>
          )}

        </div>

      </div>

      {/* FOOTER */}
      <div className="challenge-footer">

        <div className="challenge-stats">
          ❤️ {challenge.stats?.likes || 0}
        </div>

        <div className="challenge-actions">

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