import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ToastProvider } from "./context/ToastContext";

import Feed from "./pages/Feed/Feed.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import ChallengeDetail from "./pages/ChallengeDetail/ChallengeDetail.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Index from "./pages/Index.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import PublicLayout from "./components/layout/PublicLayout";
import PrivateLayout from "./components/layout/PrivateLayout";

import "./index.css";
import "./theme/tokens.css";
import "./theme/base.css";
import "./theme/utilities.css";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <Index />
          </PublicLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateLayout>
            <Dashboard />
          </PrivateLayout>
        }
      />

      <Route
        path="/feed"
        element={
          <PrivateLayout>
            <Feed />
          </PrivateLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateLayout>
            <Profile />
          </PrivateLayout>
        }
      />

      <Route
        path="/challenge/:id"
        element={
          <PrivateLayout>
            <ChallengeDetail />
          </PrivateLayout>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateLayout>
            <Admin />
          </PrivateLayout>
        }
      />
    </Routes>
  );
}

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
