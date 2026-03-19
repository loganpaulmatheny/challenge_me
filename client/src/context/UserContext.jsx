import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // user
        const userRes = await fetch("/api/auth/user", {
          credentials: "include",
        });
        if (userRes.ok) {
          const u = await userRes.json();
          setUser(u.user);
        }

        // profile
        const profileRes = await fetch("/api/profile", {
          credentials: "include",
        });
        if (profileRes.ok) {
          const p = await profileRes.json();
          setProfile(p);
        }

        // likes
        const likesRes = await fetch("/api/interactions/likes", {
          credentials: "include",
        });
        if (likesRes.ok) {
          const ids = await likesRes.json();
          setLikedIds(ids);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        likedIds,
        setProfile,
        setLikedIds,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
