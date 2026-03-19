import Button from "../../components/ui/Button/Button";
import Card from "../../components/ui/Card/Card";

export default function Admin() {
  const seedChallenges = async () => {
    const res = await fetch("/api/seed", {
      method: "POST",
      credentials: "include",
    });
  
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  };

  const linkUsers = async () => {
    const res = await fetch("/api/seed-users", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <Card>
        <h2>Admin Panel</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <Button onClick={seedChallenges}>
            Seed Challenges
          </Button>

          <Button variant="secondary" onClick={linkUsers}>
            Link Users → Profiles + Interactions
          </Button>
        </div>
      </Card>
    </div>
  );
}