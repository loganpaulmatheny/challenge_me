import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card/Card";
import Badge from "../../components/ui/Badge/Badge";
import Avatar from "../../components/ui/Avatar/Avatar";
import StepProgress from "../../components/ui/StepProgress/StepProgress";
import "./ChallengeDetail.css";

export default function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isEditable = location.state?.editable || false;

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`/api/challenges/${id}`, {
          credentials: "include",
        });
        if (!res.ok) { setChallenge(null); return; }
        setChallenge(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchChallenge();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") navigate(-1); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  if (!challenge) {
    return <div className="challenge-loading">Loading challenge...</div>;
  }

  return (
    <main className="challenge-detail">
      <Card>
        <div className="challenge-top">
          <h2>{challenge.title}</h2>

          <div className="challenge-creator-row">
            <Avatar
              src={challenge.creator?.profileImageURL}
              username={challenge.creator?.username}
              size={40}
            />
            <span className="challenge-creator-name">
              {challenge.creator?.username}
            </span>
          </div>

          {challenge.description && (
            <p className="challenge-desc">{challenge.description}</p>
          )}

          <div className="challenge-tags">
            <Badge variant="primary">{challenge.category}</Badge>
            <Badge variant="gold">{challenge.neighborhood}</Badge>
            <Badge variant="default">{challenge.timeWindow}</Badge>
          </div>
        </div>

        <section className="challenge-steps">
          <h4>Steps</h4>
          <StepProgress
            steps={challenge.steps || []}
            challengeId={id}
            isEditable={isEditable}
          />
        </section>
      </Card>
    </main>
  );
}
