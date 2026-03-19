import { useEffect, useState } from "react";
import Button from "../Button/Button";
import "./StepProgress.css";

export default function StepProgress({ steps, challengeId }) {
  const [expanded, setExpanded] = useState(null);
  const [progress, setProgress] = useState([]);
  const [proof, setProof] = useState({});
  const [animating, setAnimating] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile", {
        credentials: "include",
      });

      const data = await res.json();

      const saved = data.savedChallenges?.find(
        (c) => c.challengeId === challengeId
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
    setExpanded(expanded === id ? null : id);
  };

  const completeStep = async (stepId) => {
    setAnimating(stepId);

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
      prev.map((p) =>
        p.stepId === stepId
          ? { ...p, completed: true }
          : p
      )
    );

    setTimeout(() => setAnimating(null), 400);
  };

  return (
    <div className="steps">
      {steps.map((step, i) => {
        const done = isCompleted(step.id);

        return (
          <div key={step.id} className="step-row">
            <div className="step-left">
              <div
                className={`step-dot ${done ? "done" : ""} ${animating === step.id ? "pulse" : ""
                  }`}
              >
                {done ? "✓" : i + 1}
              </div>

              {i < steps.length - 1 && (
                <div
                  className={`step-connector ${isCompleted(steps[i].id) ? "done" : ""
                    }`}
                />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div
                className="step-title"
                onClick={() => toggle(step.id)}
              >
                {step.title} (+{step.points} XP)
              </div>

              {expanded === step.id && (
                <div className="step-expand">
                  <input
                    placeholder="Proof link"
                    value={proof[step.id] || ""}
                    onChange={(e) =>
                      setProof({
                        ...proof,
                        [step.id]: e.target.value,
                      })
                    }
                    className="input"
                  />

                  <div style={{ marginTop: 10 }}>
                    <Button onClick={() => completeStep(step.id)}>
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