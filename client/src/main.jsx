import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Feed from "./pages/Feed/Feed.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import ChallengeDetail from "./pages/ChallengeDetail/ChallengeDetail.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Index from "./pages/Index.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";

import AppLayout from "./components/layout/AppLayout.jsx";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import "./theme/tokens.css";
import "./theme/base.css";
import "./theme/utilities.css";

function AppRoutes() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/user", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />

      <Route
        path="/dashboard"
        element={
          <AppLayout user={user}>
            <Dashboard />
          </AppLayout>
        }
      />

      <Route
        path="/feed"
        element={
          <AppLayout user={user}>
            <Feed />
          </AppLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <AppLayout user={user}>
            <Profile />
          </AppLayout>
        }
      />

      <Route
        path="/challenge/:id"
        element={
          <AppLayout user={user}>
            <ChallengeDetail />
          </AppLayout>
        }
      />

      <Route
        path="/admin"
        element={
          <AppLayout user={user}>
            <Admin />
          </AppLayout>
        }
      />
    </Routes>
  );
}

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);