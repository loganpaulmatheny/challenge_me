import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // CORE: fetch everything AFTER confirming user
  const refreshUser = async () => {
    try {
      const userRes = await fetch("/api/auth/user", {
        credentials: "include",
      });
      console.log('got response:', userRes.status)

      if (!userRes.ok) {
        setUser(null);
        setProfile(null);
        setLikedIds([]);
        return false;
      }

      const u = await userRes.json();
      setUser(u.user);

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

      return true;
    } catch (err) {
      console.error(err);
      setUser(null);
      return false;
    }
  };

  // INITIAL LOAD (delayed to avoid early 401 spam)
  useEffect(() => {
    const init = async () => {
      console.log('init started')
      await refreshUser();
      console.log('refreshUser done')
      setLoading(false);
      console.log('loading set to false')
    };

    // small delay avoids race with login/navigation
    const t = setTimeout(init, 50);
    return () => clearTimeout(t);
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }

    setUser(null);
    setProfile(null);
    setLikedIds([]);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        likedIds,
        refreshUser,
        logout,
        loading,
        setProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
