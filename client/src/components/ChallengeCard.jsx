import Card from "../ui/Card/Card";
import Badge from "../ui/Badge/Badge";
import Button from "../ui/Button/Button";
import "./ChallengeCard.css";

export default function ChallengeCard({ challenge, onImport }) {
  return (
    <Card>

      <div className="challenge-header">
        <h3>{challenge.title}</h3>

        <div className="challenge-tags">
          <Badge variant="primary">{challenge.category}</Badge>
          {challenge.tags?.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>

      <p className="challenge-desc">{challenge.description}</p>

      <div className="challenge-footer">
        <div className="challenge-stats">
          ❤️ {challenge.stats.likes}
        </div>

        <Button variant="secondary" onClick={() => onImport(challenge._id)}>
          Save
        </Button>
      </div>

    </Card>
  );
}