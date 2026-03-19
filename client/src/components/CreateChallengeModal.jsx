import { useState } from "react";
import Modal from "./ui/Modal/Modal";
import Button from "./ui/Button/Button";

export default function CreateChallengeModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [steps, setSteps] = useState([{ title: "" }]);

  const addStep = () => {
    setSteps([...steps, { title: "" }]);
  };

  const submit = async () => {
    await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        category,
        neighborhood: "Boston",
        timeWindow: "weekend",
        steps: steps.map((s) => ({
          id: crypto.randomUUID(),
          title: s.title,
          type: "visit",
          points: 10,
        })),
      }),
    });

    onClose();
  };

  return (
    <Modal
      title="Create Challenge"
      onClose={onClose}
      footer={
        <Button onClick={submit}>
          Create
        </Button>
      }
    >
      <input
        className="input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="input"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {steps.map((s, i) => (
        <input
          key={i}
          className="input"
          placeholder={`Step ${i + 1}`}
          value={s.title}
          onChange={(e) => {
            const copy = [...steps];
            copy[i].title = e.target.value;
            setSteps(copy);
          }}
        />
      ))}

      <Button variant="soft" onClick={addStep}>
        Add Step
      </Button>
    </Modal>
  );
}