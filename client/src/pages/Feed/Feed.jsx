import { useEffect, useState } from "react";
import ChallengeCard from "../../components/ui/ChallengeCard/ChallengeCard";
import Chip from "../../components/ui/Chip/Chip";
import Button from "../../components/ui/Button/Button";
import CreateChallengeModal from "../../components/CreateChallengeModal";

import { useUser } from "../../context/UserContext";

export default function Feed() {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  const { profile, likedIds, setProfile } = useUser();

  useEffect(() => {
    fetch("/api/challenges", { credentials: "include" })
      .then((r) => r.json())
      .then(setChallenges);
  }, []);

  const filtered = challenges.filter((c) => {
    const matchCategory = filter === "All" || c.category === filter;

    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const importChallenge = async (id) => {
    const alreadySaved = profile?.savedChallenges?.some(
      (c) => c.challengeId.toString() === id
    );

    if (alreadySaved) return;

    await fetch(`/api/profile/import/${id}`, {
      method: "POST",
      credentials: "include",
    });

    // update local profile state
    const newEntry = {
      challengeId: id,
      status: "Not Started",
      progress: [],
    };

    setProfile((prev) => ({
      ...prev,
      savedChallenges: [...(prev.savedChallenges || []), newEntry],
    }));
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/challenges/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setChallenges((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="feed-page">
      <input
        className="search-input"
        placeholder="Search challenges..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      <div className="filter-bar-container">
        <div className="filter-bar">
          {["All", "food", "movies", "explore"].map((f) => (
            <Chip
              key={f}
              label={f}
              active={filter === f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
            />
          ))}
        </div>
        <Button size="sm" variant="primary" onClick={() => setShowCreate(true)}>
          Create
        </Button>
      </div>

      {showCreate && (
        <CreateChallengeModal onClose={() => setShowCreate(false)} />
      )}

      <div className="feed-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">No challenges match your filter.</div>
        ) : (
          paginated.map((c) => {
            const saved = profile?.savedChallenges?.some(
              (sc) => sc.challengeId.toString() === c._id
            );

            const liked = likedIds.includes(c._id);

            return (
              <ChallengeCard
                key={c._id}
                challenge={{ ...c, saved, liked }}
                onImport={importChallenge}
                onRemove={handleDelete}
              />
            );
          })
        )}
      </div>

      <div className="pagination">
        <Button
          variant="soft"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span>
          {page} / {totalPages || 1}
        </span>

        <Button
          variant="soft"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
