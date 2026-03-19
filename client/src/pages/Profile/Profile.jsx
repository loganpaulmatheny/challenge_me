import { useEffect, useState } from "react";
import Card from "../../components/ui/Card/Card";
import Badge from "../../components/ui/Badge/Badge";
import XPBar from "./XPBar";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then((r) => r.json())
      .then(setProfile);
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <Card>
        <h2>Level {profile.level}</h2>
        <XPBar xp={profile.xp} level={profile.level} />

        <div style={{ display: "flex", gap: 6 }}>
          {profile.badges?.map((b) => (
            <Badge key={b} variant="success">
              {b}
            </Badge>
          ))}
        </div>
      </Card>

      <div style={{ marginTop: 20 }}>
        <h3>Saved Challenges</h3>

        {!profile.savedChallenges?.length && (
          <p>No challenges yet. Go explore </p>
        )}
        {profile.savedChallenges?.map((c, i) => (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{c.status}</div>

              <Badge
                variant={
                  c.status === "Completed"
                    ? "complete"
                    : c.status === "In Progress"
                      ? "progress"
                      : "default"
                }
              >
                {c.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
