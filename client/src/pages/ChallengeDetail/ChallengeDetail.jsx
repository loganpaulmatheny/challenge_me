import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card/Card";
import Badge from "../../components/ui/Badge/Badge";
import Button from "../../components/ui/Button/Button";
import Avatar from "../../components/ui/Avatar/Avatar";

import StepProgress from "../../components/ui/StepProgress/StepProgress";

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

        if (!res.ok) {
          setChallenge(null);
          return;
        }

        const data = await res.json();
        setChallenge(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChallenge();
  }, [id]);

  // This handles going back using the escape key after clicking on one
  // Can be used as an example for other portions of the app
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);


  if (!challenge) {
    return <div style={{ padding: 20 }}>Loading challenge...</div>;
  }

  return (
    <div className="challenge-detail">
      <Card>
        <div className="challenge-top">
          <h2>{challenge.title}</h2>

          <div className="challenge-creator-row">
            <Avatar
              src={challenge.creator?.profileImageURL}
              username={challenge.creator?.username}
              size={40}
            />
            <span>{challenge.creator?.username}</span>
          </div>

          <p className="challenge-desc">{challenge.description}</p>

          <div className="challenge-tags">
            <Badge variant="primary">{challenge.category}</Badge>
            <Badge variant="soft">{challenge.neighborhood}</Badge>
            <Badge variant="soft">{challenge.timeWindow}</Badge>
          </div>
        </div>

        <div className="challenge-steps">
          <h4>Steps</h4>

          <StepProgress
            steps={challenge.steps || []}
            challengeId={id}
            isEditable={isEditable}
          />
        </div>
      </Card>
    </div>
  );
}
