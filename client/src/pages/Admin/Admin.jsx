import Button from "../../components/ui/Button/Button";
import Card from "../../components/ui/Card/Card";
import "./Admin.css";

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
    <main className="admin-page">
      <Card>
        <h2>Admin Panel</h2>
        <div className="admin-actions">
          <Button variant="primary" onClick={seedChallenges}>
            Seed Challenges
          </Button>
          <Button variant="secondary" onClick={linkUsers}>
            Link Users to Profiles
          </Button>
        </div>
      </Card>
    </main>
  );
}
