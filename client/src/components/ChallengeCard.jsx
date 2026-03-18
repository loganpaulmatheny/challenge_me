export default function ChallengeCard({ challenge, onImport }) {
    return (
      <div className="card">
        <h3>{challenge.title}</h3>
        <p>{challenge.category}</p>
  
        <button onClick={() => onImport(challenge._id)}>
          Save
        </button>
      </div>
    );
  }