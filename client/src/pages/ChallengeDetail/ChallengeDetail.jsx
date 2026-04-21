import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import Card from "../../components/ui/Card/Card";
import Badge from "../../components/ui/Badge/Badge";
import Avatar from "../../components/ui/Avatar/Avatar";
import Button from "../../components/ui/Button/Button";
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

  useEffect(() => {
    if (challenge?.title) {
      document.title = `${challenge.title} — ChallengeMe`;
    } else {
      document.title = "Challenge — ChallengeMe";
    }
  }, [challenge]);

  if (!challenge) {
    return (
      <div className="challenge-loading" role="status" aria-live="polite">
        Loading challenge...
      </div>
    );
  }

  return (
    <main className="challenge-detail">
      <nav className="challenge-detail-nav" aria-label="Page navigation">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          aria-label="Go back to previous page"
          className="challenge-back-btn"
        >
          ← Back
        </Button>
      </nav>

      <Card>
        <div className="challenge-top">
          <h1 className="challenge-title">{challenge.title}</h1>

          <div className="challenge-creator-row">
            <span aria-hidden="true">
              <Avatar
                src={challenge.creator?.profileImageURL}
                username={challenge.creator?.username}
                size={32}
              />
            </span>
            <span className="challenge-creator-name">
              by {challenge.creator?.username}
            </span>
          </div>

          {challenge.description && (
            <p className="challenge-desc">{challenge.description}</p>
          )}

          <div className="challenge-tags" role="list" aria-label="Challenge attributes">
            <Badge variant="primary" role="listitem">{challenge.category}</Badge>
            <Badge variant="gold" role="listitem">{challenge.neighborhood}</Badge>
            <Badge variant="default" role="listitem">{challenge.timeWindow}</Badge>
          </div>
        </div>

        <section className="challenge-steps" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="challenge-steps-heading">Steps</h2>
          {!isEditable && (
            <p className="challenge-steps-hint">
              Import this challenge from the feed to start tracking your progress.
            </p>
          )}
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

ChallengeDetail.propTypes = {};
