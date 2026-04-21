import { useState, useEffect } from "react";
import Modal from "./ui/Modal/Modal";
import Button from "./ui/Button/Button";
import Input from "./ui/Input/Input";
import ChallengeCard from "./ui/ChallengeCard/ChallengeCard";
import PropTypes from "prop-types";

import {
  categories,
  neighborhoods,
  timeWindows,
} from "../constants/challengeOptions";

import "./CreateChallengeModal.css";

export default function CreateChallengeModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [neighborhood, setNeighborhood] = useState(neighborhoods[0]);
  const [timeWindow, setTimeWindow] = useState(timeWindows[0]);
  const [steps, setSteps] = useState([{ title: "", points: 10 }]);

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

  const submit = async () => {
    await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        description,
        category,
        neighborhood,
        timeWindow,
        steps: steps.map((s) => ({
          id: crypto.randomUUID(),
          title: s.title,
          points: Number(s.points) || 10,
        })),
      }),
    });
    if (onCreated) onCreated();
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const preview = {
    _id: "preview",
    title: title || "Your challenge title",
    description: description || "Describe your challenge...",
    category,
    neighborhood,
    timeWindow,
    steps,
    stats: { likes: 0 },
    creator: { username: "You" },
  };

  const footer = (
    <Button variant="primary" onClick={submit}>
      Create
    </Button>
  );

  return (
    <Modal title="Create Challenge" onClose={onClose} footer={footer}>
      <div className="create-layout">
        <div className="create-builder">
          <Input
            id="create-title"
            label="Title"
            placeholder="Name your challenge"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="create-field-wrap">
            <label className="create-label" htmlFor="create-desc">
              Description
            </label>
            <textarea
              id="create-desc"
              className="create-textarea"
              placeholder="Describe your challenge..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="create-selects">
            <div className="create-field-wrap">
              <label className="create-label" htmlFor="create-category">Category</label>
              <select id="create-category" className="create-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="create-field-wrap">
              <label className="create-label" htmlFor="create-neighborhood">Neighborhood</label>
              <select id="create-neighborhood" className="create-select" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>
                {neighborhoods.map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="create-field-wrap">
              <label className="create-label" htmlFor="create-timewindow">Timeframe</label>
              <select id="create-timewindow" className="create-select" value={timeWindow} onChange={(e) => setTimeWindow(e.target.value)}>
                {timeWindows.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="create-steps">
            <div className="create-steps-header">
              <span>Steps</span>
              <span>XP</span>
            </div>
            {steps.map((s, i) => (
              <div key={i} className="create-step-row">
                <input
                  className="create-step-input"
                  placeholder={`Step ${i + 1}`}
                  value={s.title}
                  aria-label={`Step ${i + 1} title`}
                  onChange={(e) => updateStep(i, "title", e.target.value)}
                />
                <input
                  type="number"
                  className="create-step-xp"
                  value={s.points}
                  aria-label={`Step ${i + 1} XP`}
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
            <Button variant="soft" size="sm" onClick={addStep}>
              + Add Step
            </Button>
          </div>
        </div>

        <div className="create-preview">
          <ChallengeCard challenge={preview} onImport={() => {}} />
        </div>
      </div>
    </Modal>
  );
}

CreateChallengeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func,
};
