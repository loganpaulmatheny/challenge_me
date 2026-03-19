import Navbar from "../ui/Navbar/Navbar";

export default function AppLayout({ children, user }) {
  return (
    <>
      <Navbar user={user} />
      <div className="container py-4">
        {children}
      </div>
    </>
  );
}