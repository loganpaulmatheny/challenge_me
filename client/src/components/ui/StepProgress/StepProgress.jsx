import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import Button from "../Button/Button";
import Input from "../Input/Input";
import "./StepProgress.css";
import PropTypes from "prop-types";

export default function StepProgress({ steps, challengeId, isEditable }) {
  const [expanded, setExpanded] = useState(null);
  const [progress, setProgress] = useState([]);
  const [proof, setProof] = useState({});
  const [animating, setAnimating] = useState(null);
  const [xpGain, setXpGain] = useState(null);
  const { refreshUser } = useUser();

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile", { credentials: "include" });
      const data = await res.json();
      const saved = data.savedChallenges?.find(
        (c) => c.challengeId.toString() === challengeId
      );
      if (saved) setProgress(saved.progress);
    };
    loadProfile();
  }, [challengeId]);

  const isCompleted = (stepId) =>
    progress.find((p) => p.stepId === stepId)?.completed;

  const toggle = (id) => {
    if (!isEditable) return;
    setExpanded(expanded === id ? null : id);
  };

  const completeStep = async (stepId) => {
    if (!isEditable) return;
    setAnimating(stepId);
    const step = steps.find((s) => s.id === stepId);

    await fetch(`/api/profile/complete-step/${challengeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ stepId, proofUrl: proof[stepId] || "" }),
    });

    setProgress((prev) =>
      prev.map((p) => (p.stepId === stepId ? { ...p, completed: true } : p))
    );
    setXpGain({ stepId, points: step.points });
    await refreshUser();
    setTimeout(() => setAnimating(null), 400);
    setTimeout(() => setXpGain(null), 1000);
  };

  return (
    <div className="steps">
      {!isEditable && (
        <p className="steps-locked">
          Import this challenge to start tracking progress
        </p>
      )}

      {steps.map((step, i) => {
        const done = isCompleted(step.id);
        const isExpanded = expanded === step.id;

        return (
          <div key={step.id} className="step-row">
            <div className="step-left" aria-hidden="true">
              <div
                className={[
                  "step-dot",
                  done ? "done" : "",
                  animating === step.id ? "pulse" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {done ? "✓" : i + 1}
              </div>
              {xpGain?.stepId === step.id && (
                <div className="xp-float" aria-live="polite">
                  +{xpGain.points} XP
                </div>
              )}
              {i < steps.length - 1 && (
                <div className={`step-connector${done ? " done" : ""}`} />
              )}
            </div>

            <div className="step-content">
              <div className="step-header">
                <div className="step-title-row">
                  <span className={`step-title${!isEditable ? " disabled" : ""}`}>
                    {step.title}
                  </span>
                  <span className="xp-badge" aria-label={`${step.points} XP`}>
                    +{step.points} XP
                  </span>
                </div>
                {isEditable && (
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={() => toggle(step.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`step-expand-${step.id}`}
                  >
                    {isExpanded ? "Collapse" : "Expand"}
                  </Button>
                )}
              </div>

              {isExpanded && isEditable && (
                <div
                  className="step-expand"
                  id={`step-expand-${step.id}`}
                >
                  <Input
                    id={`proof-${step.id}`}
                    label="Proof link (optional)"
                    placeholder="https://..."
                    value={proof[step.id] || ""}
                    onChange={(e) =>
                      setProof({ ...proof, [step.id]: e.target.value })
                    }
                  />
                  <div className="step-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => completeStep(step.id)}
                    >
                      Complete Step
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

StepProgress.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      points: PropTypes.number,
    })
  ).isRequired,
  challengeId: PropTypes.string.isRequired,
  isEditable: PropTypes.bool,
};
