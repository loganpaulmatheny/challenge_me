import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Card from "../../components/ui/Card/Card";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";

import StepProgress from "../../components/ui/StepProgress/StepProgress";

export default function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    fetch(`/api/challenges/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then(setChallenge);
  }, [id]);

  if (!challenge) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <Card>

        <h2>{challenge.title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  <Avatar
    src={challenge.creator?.profileImageURL}
    username={challenge.creator?.username}
    size={40}
  />
  <div>{challenge.creator?.username}</div>
</div>

        <p>{challenge.description}</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Badge variant="primary">{challenge.category}</Badge>
          <Badge variant="soft">{challenge.neighborhood}</Badge>
          <Badge variant="soft">{challenge.timeWindow}</Badge>
        </div>

        <div style={{ marginTop: 20 }}>
          <h4>Steps</h4>

          <StepProgress steps={challenge.steps} challengeId={id} />
        </div>

      </Card>
    </div>
  );
}