import { useEffect, useState } from "react";
import Button from "../Button/Button";
import "./StepProgress.css";

export default function StepProgress({ steps, challengeId, isEditable }) {
  const [expanded, setExpanded] = useState(null);
  const [progress, setProgress] = useState([]);
  const [proof, setProof] = useState({});
  const [animating, setAnimating] = useState(null);
  const [xpGain, setXpGain] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile", {
        credentials: "include",
      });

      const data = await res.json();

      const saved = data.savedChallenges?.find(
        (c) => c.challengeId.toString() === challengeId
      );

      if (saved) {
        setProgress(saved.progress);
      }
    };

    loadProfile();
  }, [challengeId]);

  const isCompleted = (stepId) => {
    return progress.find((p) => p.stepId === stepId)?.completed;
  };

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
      body: JSON.stringify({
        stepId,
        proofUrl: proof[stepId] || "",
      }),
    });

    setProgress((prev) =>
      prev.map((p) => (p.stepId === stepId ? { ...p, completed: true } : p))
    );

    setXpGain({ stepId, points: step.points });
    window.dispatchEvent(new Event("xpUpdated"));

    setTimeout(() => setAnimating(null), 400);
    setTimeout(() => setXpGain(null), 1000);
  };

  return (
    <div className="steps">
      {!isEditable && (
        <div className="steps-locked">
          Import this challenge to start tracking progress
        </div>
      )}

      {steps.map((step, i) => {
        const done = isCompleted(step.id);

        return (
          <div key={step.id} className="step-row">
            {/* LEFT TIMELINE */}
            <div className="step-left">
              <div
                className={`step-dot 
                  ${done ? "done" : ""} 
                  ${animating === step.id ? "pulse" : ""}`}
              >
                {done ? "✓" : i + 1}
              </div>

              {xpGain?.stepId === step.id && (
                <div className="xp-float">+{xpGain.points} XP</div>
              )}

              {i < steps.length - 1 && (
                <div
                  className={`step-connector ${
                    isCompleted(step.id) ? "done" : ""
                  }`}
                />
              )}
            </div>

            {/* CONTENT */}
            <div className="step-content">
              <div
                className={`step-title ${!isEditable ? "disabled" : ""}`}
                onClick={() => toggle(step.id)}
              >
                {step.title}
                <span className="xp">+{step.points} XP</span>
              </div>

              {expanded === step.id && isEditable && (
                <div className="step-expand">
                  <input
                    placeholder="Add proof link (optional)"
                    value={proof[step.id] || ""}
                    onChange={(e) =>
                      setProof({
                        ...proof,
                        [step.id]: e.target.value,
                      })
                    }
                    className="input"
                  />

                  <div className="step-actions">
                    <Button
                      variant="primary"
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
