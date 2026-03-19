import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router";

import Feed from "./pages/Feed/Feed.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import ChallengeDetail from "./pages/ChallengeDetail";
import Admin from "./pages/Admin";



import Index from "./pages/Index.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
// import BaseTemplate from "./pages/BaseTemplate.jsx";
// import LoginPage from "./pages/LoginPage.jsx";
// import RegisterPage from "./pages/RegisterPage.jsx";

import "./index.css";
import "./theme/tokens.css";
import "./theme/base.css";
import "./theme/utilities.css";

const container = document.getElementById("root");
const root = createRoot(container);
console.log("INDEX LOADED");
root.render(
  <StrictMode>
    {/* <BaseTemplate> */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/challenge/:id" element={<ChallengeDetail/>}/>
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
    </BrowserRouter>
    {/* </BaseTemplate> */}
  </StrictMode>
);

