import { useState } from "react";
import Modal from "./ui/Modal/Modal";
import Button from "./ui/Button/Button";
import Input from "./ui/Input/Input";
import PropTypes from "prop-types";

import {
  categories,
  neighborhoods,
  timeWindows,
} from "../constants/challengeOptions";

import "./CreateChallengeModal.css";

const STEPS = [
  { id: "intro",    title: "What is a Challenge?" },
  { id: "basics",   title: "Name Your Challenge" },
  { id: "location", title: "Category & Location" },
  { id: "tasks",    title: "Define the Steps" },
  { id: "review",   title: "Review & Publish" },
];

export default function CreateChallengeModal({ onClose, onCreated }) {
  const [wizardStep, setWizardStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [neighborhood, setNeighborhood] = useState(neighborhoods[0]);
  const [timeWindow, setTimeWindow] = useState(timeWindows[0]);
  const [steps, setSteps] = useState([{ title: "", points: 10 }]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const addStep = () => setSteps([...steps, { title: "", points: 10 }]);

  const updateStep = (i, field, value) => {
    const copy = [...steps];
    copy[i][field] = value;
    setSteps(copy);
  };

  const removeStep = (i) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, idx) => idx !== i));
  };

  const validateStep = () => {
    const errs = {};
    if (wizardStep === 1) {
      if (!title.trim()) errs.title = "A title is required.";
      else if (title.trim().length < 5) errs.title = "Title must be at least 5 characters.";
      if (!description.trim()) errs.description = "Please describe your challenge.";
    }
    if (wizardStep === 3) {
      const hasEmpty = steps.some((s) => !s.title.trim());
      if (hasEmpty) errs.steps = "Every step needs a title.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setWizardStep((s) => s + 1);
  };

  const back = () => setWizardStep((s) => s - 1);

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          neighborhood,
          timeWindow,
          steps: steps.map((s) => ({
            id: crypto.randomUUID(),
            title: s.title.trim(),
            points: Number(s.points) || 10,
          })),
        }),
      });
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isLast = wizardStep === STEPS.length - 1;
  const isFirst = wizardStep === 0;

  const footer = (
    <div className="wizard-footer">
      {!isFirst && (
        <Button variant="ghost" type="button" onClick={back} disabled={submitting} aria-label="Back to previous step">
          <span aria-hidden="true">←</span> Back
        </Button>
      )}
      <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>
        Cancel
      </Button>
      {isLast ? (
        <Button variant="primary" type="button" onClick={submit} loading={submitting}>
          Publish Challenge
        </Button>
      ) : (
        <Button
          variant="primary"
          type="button"
          onClick={next}
          aria-label={wizardStep === 0 ? "Get started" : "Next step"}
        >
          {wizardStep === 0 ? <>Get Started <span aria-hidden="true">→</span></> : <>Next <span aria-hidden="true">→</span></>}
        </Button>
      )}
    </div>
  );

  return (
    <Modal
      title={STEPS[wizardStep].title}
      onClose={onClose}
      footer={footer}
      size="lg"
    >
      <div className="wizard-progress" role="progressbar"
           aria-valuenow={wizardStep + 1} aria-valuemin={1} aria-valuemax={STEPS.length}
           aria-label={`Step ${wizardStep + 1} of ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={[
              "wizard-pip",
              i < wizardStep ? "wizard-pip-done" : "",
              i === wizardStep ? "wizard-pip-active" : "",
            ].filter(Boolean).join(" ")}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="wizard-step-label" aria-live="polite">
        Step {wizardStep + 1} of {STEPS.length} — {STEPS[wizardStep].title}
      </div>

      {wizardStep === 0 && <StepIntro />}
      {wizardStep === 1 && (
        <StepBasics
          title={title} setTitle={setTitle}
          description={description} setDescription={setDescription}
          errors={errors}
        />
      )}
      {wizardStep === 2 && (
        <StepLocation
          category={category} setCategory={setCategory}
          neighborhood={neighborhood} setNeighborhood={setNeighborhood}
          timeWindow={timeWindow} setTimeWindow={setTimeWindow}
        />
      )}
      {wizardStep === 3 && (
        <StepTasks steps={steps} addStep={addStep} updateStep={updateStep} removeStep={removeStep} errors={errors} />
      )}
      {wizardStep === 4 && (
        <StepReview
          title={title} description={description}
          category={category} neighborhood={neighborhood}
          timeWindow={timeWindow} steps={steps}
        />
      )}
    </Modal>
  );
}

/* ── Step sub-components ── */

function StepIntro() {
  return (
    <div className="wizard-intro">
      <div className="wizard-intro-icon" aria-hidden="true">🗺️</div>
      <h3 className="wizard-intro-heading">Create a Challenge for Boston</h3>
      <p className="wizard-intro-body">
        A <strong>Challenge</strong> is a structured activity you design for
        yourself or others — like visiting every coffee shop in Cambridge,
        running 5 different trails, or trying 10 new restaurants.
      </p>
      <div className="wizard-intro-cards">
        <div className="wizard-intro-card">
          <span className="wizard-intro-card-icon" aria-hidden="true">📋</span>
          <div>
            <strong>Break it into Steps</strong>
            <p>Each step is a specific task with XP points. Complete them one by one to track progress.</p>
          </div>
        </div>
        <div className="wizard-intro-card">
          <span className="wizard-intro-card-icon" aria-hidden="true">📍</span>
          <div>
            <strong>Tag a Neighborhood</strong>
            <p>Challenges are tied to Boston-area neighborhoods so others can find local adventures.</p>
          </div>
        </div>
        <div className="wizard-intro-card">
          <span className="wizard-intro-card-icon" aria-hidden="true">⭐</span>
          <div>
            <strong>Earn XP</strong>
            <p>Each step you complete earns you XP. Level up and collect badges as you progress.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepBasics({ title, setTitle, description, setDescription, errors }) {
  return (
    <div className="wizard-section">
      <p className="wizard-section-hint">
        Give your challenge a clear, catchy name and explain what it involves.
        Good titles are specific: <em>"Visit all 12 Arnold Arboretum trails"</em> beats <em>"Outdoor stuff"</em>.
      </p>

      <div className="create-field-wrap">
        <label className="create-label" htmlFor="create-title">
          Challenge Title <span className="required-star" aria-hidden="true">*</span>
        </label>
        <input
          id="create-title"
          className={`create-step-input create-title-input${errors.title ? " input-error" : ""}`}
          placeholder="e.g. Coffee Shop Tour: All of Cambridge"
          value={title}
          required
          aria-required="true"
          aria-describedby={errors.title ? "title-error" : "title-hint"}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title
          ? <span id="title-error" className="field-error" role="alert">{errors.title}</span>
          : <span id="title-hint" className="field-hint">5–80 characters. Be specific and enticing.</span>
        }
      </div>

      <div className="create-field-wrap">
        <label className="create-label" htmlFor="create-desc">
          Description <span className="required-star" aria-hidden="true">*</span>
        </label>
        <textarea
          id="create-desc"
          className={`create-textarea${errors.description ? " input-error" : ""}`}
          placeholder="Describe what this challenge is about, who it's for, and what makes it fun…"
          value={description}
          required
          aria-required="true"
          aria-describedby={errors.description ? "desc-error" : "desc-hint"}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description
          ? <span id="desc-error" className="field-error" role="alert">{errors.description}</span>
          : <span id="desc-hint" className="field-hint">A few sentences is plenty. Think of it as your challenge's pitch.</span>
        }
      </div>
    </div>
  );
}

function StepLocation({ category, setCategory, neighborhood, setNeighborhood, timeWindow, setTimeWindow }) {
  return (
    <div className="wizard-section">
      <p className="wizard-section-hint">
        Tagging your challenge helps others discover it. Pick the most fitting options.
      </p>

      <div className="create-field-wrap">
        <label className="create-label" htmlFor="create-category">Category</label>
        <span className="field-hint" id="cat-hint">What type of activity is this?</span>
        <select
          id="create-category"
          className="create-select"
          value={category}
          aria-describedby="cat-hint"
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="create-field-wrap">
        <label className="create-label" htmlFor="create-neighborhood">Neighborhood</label>
        <span className="field-hint" id="nb-hint">Where in Boston does this take place?</span>
        <select
          id="create-neighborhood"
          className="create-select"
          value={neighborhood}
          aria-describedby="nb-hint"
          onChange={(e) => setNeighborhood(e.target.value)}
        >
          {neighborhoods.map((n) => <option key={n}>{n}</option>)}
        </select>
      </div>

      <div className="create-field-wrap">
        <label className="create-label" htmlFor="create-timewindow">Timeframe</label>
        <span className="field-hint" id="tw-hint">How long does this challenge typically take?</span>
        <select
          id="create-timewindow"
          className="create-select"
          value={timeWindow}
          aria-describedby="tw-hint"
          onChange={(e) => setTimeWindow(e.target.value)}
        >
          {timeWindows.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
    </div>
  );
}

function StepTasks({ steps, addStep, updateStep, removeStep, errors }) {
  return (
    <div className="wizard-section">
      <p className="wizard-section-hint">
        Break your challenge into concrete, achievable steps. Each step earns the person XP when completed.
        Aim for <strong>3–8 steps</strong> — specific enough to be actionable, but not overwhelming.
      </p>

      {errors.steps && (
        <span className="field-error" role="alert">{errors.steps}</span>
      )}

      <div className="create-steps">
        <div className="create-steps-header">
          <span>Step description</span>
          <span>XP earned</span>
          <span aria-hidden="true" />
        </div>
        {steps.map((s, i) => (
          <div key={i} className="create-step-row">
            <input
              className={`create-step-input${!s.title.trim() && errors.steps ? " input-error" : ""}`}
              placeholder={`Step ${i + 1} — e.g. Visit Blue Bottle Coffee`}
              value={s.title}
              aria-label={`Step ${i + 1} description`}
              aria-required="true"
              onChange={(e) => updateStep(i, "title", e.target.value)}
            />
            <input
              type="number"
              className="create-step-xp"
              value={s.points}
              min={1}
              max={100}
              aria-label={`Step ${i + 1} XP reward`}
              onChange={(e) => updateStep(i, "points", e.target.value)}
            />
            <Button
              variant="ghost-terra"
              size="sm"
              onClick={() => removeStep(i)}
              aria-label={`Remove step ${i + 1}`}
              disabled={steps.length === 1}
            >
              ×
            </Button>
          </div>
        ))}
        <Button variant="soft" size="sm" onClick={addStep} type="button">
          + Add another step
        </Button>
      </div>
    </div>
  );
}

function StepReview({ title, description, category, neighborhood, timeWindow, steps }) {
  const totalXP = steps.reduce((sum, s) => sum + (Number(s.points) || 0), 0);
  return (
    <div className="wizard-review">
      <p className="wizard-section-hint">
        Everything look good? Hit <strong>Publish Challenge</strong> to share it with the community.
      </p>

      <div className="review-card">
        <h3 className="review-title">{title || <em className="review-empty">No title yet</em>}</h3>
        <p className="review-desc">{description || <em className="review-empty">No description yet</em>}</p>

        <div className="review-tags">
          <span className="review-tag review-tag-primary">{category}</span>
          <span className="review-tag review-tag-gold">{neighborhood}</span>
          <span className="review-tag review-tag-default">{timeWindow}</span>
        </div>

        <div className="review-steps-heading">
          {steps.length} {steps.length === 1 ? "step" : "steps"} · {totalXP} XP total
        </div>
        <ol className="review-steps-list">
          {steps.map((s, i) => (
            <li key={i} className="review-step">
              <span className="review-step-title">{s.title || <em>Untitled step</em>}</span>
              <span className="review-step-xp">+{s.points} XP</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

CreateChallengeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func,
};

StepIntro.propTypes = {};

StepBasics.propTypes = {
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  setDescription: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

StepLocation.propTypes = {
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  neighborhood: PropTypes.string.isRequired,
  setNeighborhood: PropTypes.func.isRequired,
  timeWindow: PropTypes.string.isRequired,
  setTimeWindow: PropTypes.func.isRequired,
};

StepTasks.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    points: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })).isRequired,
  addStep: PropTypes.func.isRequired,
  updateStep: PropTypes.func.isRequired,
  removeStep: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

StepReview.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  neighborhood: PropTypes.string.isRequired,
  timeWindow: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
};
