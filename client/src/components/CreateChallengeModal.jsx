import { useState, useEffect } from "react";
import Modal from "./ui/Modal/Modal";
import Button from "./ui/Button/Button";
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


  const addStep = () => {
    setSteps([...steps, { title: "", points: 10 }]);
  };

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

  // preview object
  const preview = {
    _id: "preview",
    title: title || "Your challenge title",
    description: description || "Describe your challenge...",
    category,
    neighborhood,
    timeWindow,
    steps,
    stats: { likes: 0 },
    creator: {
      username: "You",
    },
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <Modal
      title="Create Challenge"
      onClose={onClose}
      footer={<Button onClick={submit}>Create</Button>}
    >
      <div className="create-layout">
        {/* LEFT BUILDER */}
        <div className="builder">
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="row">
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              className="input"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            >
              {neighborhoods.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

            <select
              className="input"
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
            >
              {timeWindows.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="steps-builder">
            <div className="d-flex justify-content-around">
              <h4>Steps</h4>
              <h4>Experience</h4>
            </div>

            {steps.map((s, i) => (
              <div key={i} className="step-row">
                <input
                  className="input"
                  placeholder={`Step ${i + 1}`}
                  value={s.title}
                  onChange={(e) => updateStep(i, "title", e.target.value)}
                />

                <input
                  type="number"
                  className="input xp"
                  value={s.points}
                  onChange={(e) => updateStep(i, "points", e.target.value)}
                />

                <Button variant="ghost" onClick={() => removeStep(i)}>
                  ×
                </Button>
              </div>
            ))}

            <Button variant="soft" onClick={addStep}>
              + Add Step
            </Button>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="preview">
          <ChallengeCard challenge={preview} onImport={() => { }} />
        </div>
      </div>
    </Modal>
  );
}

CreateChallengeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func,
};
