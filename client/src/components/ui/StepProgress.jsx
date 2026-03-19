import { useState } from "react";
import "./StepProgress.css";
import Button from "../ui/Button/Button";

export default function StepProgress({ steps, onComplete }) {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="step-progress-vertical">
      {steps.map((step, index) => {
        const isActive = activeStep === index;

        return (
          <div key={step.id} className="step-item">

            {/* LEFT SIDE (circle + line) */}
            <div className="step-indicator">
              <div
                className={`step-circle ${step.completed ? "done" : ""}`}
                onClick={() => setActiveStep(isActive ? null : index)}
              >
                {step.completed ? "✓" : index + 1}
              </div>

              {index !== steps.length - 1 && (
                <div className={`step-line ${step.completed ? "done" : ""}`} />
              )}
            </div>

            {/* RIGHT SIDE (content) */}
            <div className="step-content">

              <div
                className="step-title"
                onClick={() => setActiveStep(isActive ? null : index)}
              >
                {step.title}
              </div>

              {isActive && (
                <div className="step-expanded">

                  {step.link && (
                    <a href={step.link} target="_blank">
                      Open Link
                    </a>
                  )}

                  {step.image && (
                    <img src={step.image} className="step-image" />
                  )}

                  <div className="step-actions">
                    <Button
                      variant="primary"
                      onClick={() => onComplete(step.id)}
                    >
                      Mark Complete
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