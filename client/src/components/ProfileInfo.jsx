export default function ProfileInfo({ user }) {
  if (!user) return <p>Loading...</p>;
  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <p>{user.email}</p>
    </div>
  );
}
