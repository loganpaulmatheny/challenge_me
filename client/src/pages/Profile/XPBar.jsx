import "./XPBar.css";

export default function XPBar({ xp, level }) {
  const currentLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;

  const progress =
    ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="xp-container">
      <div className="xp-header">
        <span>Level {level}</span>
        <span>{xp} XP</span>
      </div>

      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}