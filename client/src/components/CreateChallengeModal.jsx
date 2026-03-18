import { useState } from "react";

export default function CreateChallengeModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([{ title: "" }]);

  const addStep = () => {
    setSteps([...steps, { title: "" }]);
  };

  const submit = async () => {
    await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category: "food",
        neighborhood: "Back Bay",
        timeWindow: "weekend",
        steps: steps.map(s => ({
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
    <div className="modal">
      <h2>Create Challenge</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      {steps.map((s, i) => (
        <input
          key={i}
          value={s.title}
          onChange={(e) => {
            const updated = [...steps];
            updated[i].title = e.target.value;
            setSteps(updated);
          }}
        />
      ))}

      <button onClick={addStep}>Add Step</button>
      <button onClick={submit}>Create</button>
    </div>
  );
}