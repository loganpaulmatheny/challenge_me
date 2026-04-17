import { useEffect, useState } from "react";
import Card from "../../components/ui/Card/Card";
import Badge from "../../components/ui/Badge/Badge";
import XPBar from "./XPBar";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.json()
      })
      .then(setProfile)
      .catch((err) => console.error("Profile fetch failed:", err))
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <Card>
        <div className="profile-header">
          <h2>Level {profile.level}</h2>
          <XPBar xp={profile.xp} level={profile.level} />
        </div>

        <div className="profile-badges">
          {profile.badges?.map((b) => (
            <Badge key={b} variant="success">
              {b}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
