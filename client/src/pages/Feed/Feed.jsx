import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ChallengeCard from "../../components/ui/ChallengeCard/ChallengeCard";
import Button from "../../components/ui/Button/Button";
import CreateChallengeModal from "../../components/CreateChallengeModal";
import DropdownFilter from "../../components/ui/DropdownFilter/DropdownFilter";
import { useUser } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";
import "./Feed.css";

import {
  categories,
  neighborhoods,
  timeWindows,
} from "../../constants/challengeOptions";

const WELCOME_KEY = "cm_welcome_dismissed";

function WelcomeBanner({ onDismiss }) {
  return (
    <aside className="welcome-banner" role="note" aria-label="Welcome to Challenge Me">
      <div className="welcome-banner-content">
        <span className="welcome-banner-icon" aria-hidden="true">🗺️</span>
        <div className="welcome-banner-text">
          <strong>Welcome to Challenge Me!</strong>
          <p>
            Discover community challenges around Boston, import ones you want to try,
            and complete steps to earn XP and level up. Hit <strong>Create</strong> to design your own.
          </p>
        </div>
        <button
          type="button"
          className="welcome-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss welcome message"
        >
          ×
        </button>
      </div>
    </aside>
  );
}

WelcomeBanner.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};

function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const around = new Set(
    [1, current - 1, current, current + 1, total].filter((p) => p >= 1 && p <= total)
  );
  const sorted = [...around].sort((a, b) => a - b);
  const items = [];
  for (let i = 0; i < sorted.length; i++) {
    items.push(sorted[i]);
    if (i + 1 < sorted.length && sorted[i + 1] - sorted[i] > 1) items.push("…");
  }
  return items;
}

export default function Feed() {
  const [challenges, setChallenges] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [neighborhood, setNeighborhood] = useState("All");
  const [time, setTime] = useState("All");
  const [page, setPage] = useState(1);
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem(WELCOME_KEY)
  );

  useEffect(() => { document.title = "Challenges Feed — ChallengeMe"; }, []);

  const PAGE_SIZE = 9;
  const { profile, likedIds, refreshUser } = useUser();
  const toast = useToast();

  useEffect(() => {
    fetch("/api/challenges", { credentials: "include" })
      .then((r) => r.json())
      .then(setChallenges);
  }, []);

  const dismissWelcome = () => {
    localStorage.setItem(WELCOME_KEY, "1");
    setShowWelcome(false);
  };

  const filtered = challenges.filter((c) => {
    const matchCategory    = category === "All" || c.category === category;
    const matchNeighborhood = neighborhood === "All" || c.neighborhood === neighborhood;
    const matchTime        = time === "All" || c.timeWindow === time;
    const matchSearch      = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchNeighborhood && matchTime && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const importChallenge = async (id) => {
    const alreadySaved = profile?.savedChallenges?.some(
      (c) => c.challengeId.toString() === id
    );
    if (alreadySaved) { toast.neutral("Already in your dashboard"); return; }
    try {
      const res = await fetch(`/api/profile/import/${id}`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error();
      await refreshUser();
      toast.success("Challenge saved to your dashboard!");
    } catch {
      toast.error("Could not save challenge. Try again.");
    }
  };

  const removeFromProfile = async (id) => {
    try {
      await fetch(`/api/profile/challenge/${id}`, { method: "DELETE", credentials: "include" });
      await refreshUser();
      toast.neutral("Removed from your dashboard");
    } catch {
      toast.error("Could not remove challenge.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/challenges/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      setChallenges((prev) => prev.filter((c) => c._id !== id));
      toast.success("Challenge deleted");
    } catch {
      toast.error("Could not delete challenge.");
    }
  };

  return (
    <main className="feed-page">
      <h1 className="sr-only">Challenges Feed</h1>
      {showWelcome && <WelcomeBanner onDismiss={dismissWelcome} />}

      <div className="feed-search-wrap">
        <label htmlFor="feed-search" className="sr-only">Search challenges by title</label>
        <input
          id="feed-search"
          className="search-input"
          type="search"
          placeholder="Search challenges by title…"
          value={search}
          aria-label="Search challenges by title"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="filter-bar-container" role="toolbar" aria-label="Filter challenges">
        <DropdownFilter
          label="Category"
          options={categories}
          value={category}
          onChange={(v) => { setCategory(v); setPage(1); }}
        />
        <DropdownFilter
          label="Neighborhood"
          options={neighborhoods}
          value={neighborhood}
          onChange={(v) => { setNeighborhood(v); setPage(1); }}
        />
        <DropdownFilter
          label="Timeframe"
          options={timeWindows}
          value={time}
          onChange={(v) => { setTime(v); setPage(1); }}
        />
        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowCreate(true)}
          aria-label="Create a new challenge"
        >
          + Create
        </Button>
      </div>

      {showCreate && (
        <CreateChallengeModal
          onClose={() => setShowCreate(false)}
          onCreated={async () => {
            const res = await fetch("/api/challenges", { credentials: "include" });
            const data = await res.json();
            setChallenges(data.reverse());
            toast.success("Your challenge is live in the feed!", "Challenge Created");
          }}
        />
      )}

      <section aria-labelledby="challenges-list-heading" aria-live="polite" aria-atomic="false">
        <h2 id="challenges-list-heading" className="sr-only">Browse Challenges</h2>
        {filtered.length === 0 ? (
          <div className="empty-state" role="status">
            <span aria-hidden="true">🔍</span>
            <p>No challenges match your filters.</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setCategory("All"); setNeighborhood("All"); setTime("All"); setSearch(""); }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="feed-grid">
            {paginated.map((c) => {
              const saved = profile?.savedChallenges?.some(
                (sc) => sc.challengeId.toString() === c._id
              );
              const liked = likedIds.includes(c._id);
              return (
                <ChallengeCard
                  key={c._id}
                  challenge={{ ...c, saved, liked }}
                  onImport={importChallenge}
                  onRemove={removeFromProfile}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          <button
            className="pag-btn pag-arrow"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            ←
          </button>

          {buildPageRange(page, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="pag-ellipsis" aria-hidden="true">…</span>
            ) : (
              <button
                key={p}
                className={`pag-btn${p === page ? " active" : ""}`}
                onClick={() => setPage(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}

          <button
            className="pag-btn pag-arrow"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            →
          </button>
        </nav>
      )}
    </main>
  );
}

Feed.propTypes = {};
