import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Input from "../components/ui/Input/Input";
import Button from "../components/ui/Button/Button";
import "./Index.css";

export default function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerUser, setRegisterUser] = useState({
    username: "",
    name: "",
    profileImageUrl: "",
    email: "",
    password: "",
    city: "",
    state: "",
  });
  const { refreshUser } = useUser();

  useEffect(() => { document.title = "ChallengeMe — Sign in or create account"; }, []);

  const handleChange = (e) =>
    setRegisterUser({ ...registerUser, [e.target.name]: e.target.value });

  const loginUser = async (loginEmail, loginPassword) => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    if (res.ok) {
      await refreshUser();
      navigate("/feed");
    } else {
      const { message } = await res.json();
      setError(message);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginUser(email, password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerUser),
    });
    if (res.ok) {
      await loginUser(registerUser.email, registerUser.password);
    } else {
      const { message } = await res.json();
      setError(message);
      setLoading(false);
    }
  };

  return (
    <main className="index-page" aria-label="Welcome to ChallengeMe">
      <div className="index-card">
        <h1 className="index-logo">ChallengeMe</h1>
        <p className="index-tagline">Discover and complete local challenges</p>

        <div className="index-tabs" role="tablist" aria-label="Authentication">
          <button
            id="tab-login"
            role="tab"
            aria-selected={activeTab === "login"}
            aria-controls="panel-login"
            tabIndex={activeTab === "login" ? 0 : -1}
            className={`index-tab${activeTab === "login" ? " index-tab-active" : ""}`}
            onClick={() => { setActiveTab("login"); setError(""); }}
          >
            Log in
          </button>
          <button
            id="tab-register"
            role="tab"
            aria-selected={activeTab === "register"}
            aria-controls="panel-register"
            tabIndex={activeTab === "register" ? 0 : -1}
            className={`index-tab${activeTab === "register" ? " index-tab-active" : ""}`}
            onClick={() => { setActiveTab("register"); setError(""); }}
          >
            Sign up
          </button>
        </div>

        {error && (
          <p className="index-error" role="alert">{error}</p>
        )}

        {activeTab === "login" ? (
          <form
            id="panel-login"
            role="tabpanel"
            aria-labelledby="tab-login"
            className="index-form"
            onSubmit={handleLogin}
          >
            <Input
              id="login-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button variant="primary" type="submit" loading={loading} className="index-submit">
              Log in
            </Button>
          </form>
        ) : (
          <form
            id="panel-register"
            role="tabpanel"
            aria-labelledby="tab-register"
            className="index-form"
            onSubmit={handleRegister}
          >
            <Input id="reg-username" label="Username" type="text" name="username" value={registerUser.username} onChange={handleChange} required autoComplete="username" />
            <Input id="reg-name" label="Name" type="text" name="name" value={registerUser.name} onChange={handleChange} required autoComplete="name" />
            <Input id="reg-email" label="Email" type="email" name="email" value={registerUser.email} onChange={handleChange} required autoComplete="email" />
            <Input id="reg-password" label="Password" type="password" name="password" value={registerUser.password} onChange={handleChange} required autoComplete="new-password" />
            <Input id="reg-image" label="Profile Image URL (optional)" type="url" name="profileImageUrl" value={registerUser.profileImageUrl} onChange={handleChange} />
            <div className="index-row">
              <Input id="reg-city" label="City" type="text" name="city" value={registerUser.city} onChange={handleChange} autoComplete="address-level2" />
              <Input id="reg-state" label="State" type="text" name="state" value={registerUser.state} onChange={handleChange} maxLength={2} placeholder="MA" autoComplete="address-level1" />
            </div>
            <Button variant="primary" type="submit" loading={loading} className="index-submit">
              Create account
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
