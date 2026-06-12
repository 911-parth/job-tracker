import { useEffect, useState, useCallback } from "react";
import * as api from "./api.js";
import StatsBar from "./components/StatsBar.jsx";
import AddForm from "./components/AddForm.jsx";
import FilterBar from "./components/FilterBar.jsx";
import ApplicationCard from "./components/ApplicationCard.jsx";

export default function App() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [apps, s] = await Promise.all([api.getApplications(filter), api.getStats()]);
      setApplications(apps);
      setStats(s);
      setError("");
    } catch (e) {
      setError("Can't reach the API. Is the server running? (npm start in server/)");
    }
  }, [filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleAdd(data) {
    await api.createApplication(data);
    setShowForm(false);
    refresh();
  }

  async function handleStatusChange(id, status) {
    await api.updateApplication(id, { status });
    refresh();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this application?")) return;
    await api.deleteApplication(id);
    refresh();
  }

  return (
    <div className="container">
      <header>
        <h1>Job Tracker</h1>
        <button className="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "+ Add application"}
        </button>
      </header>

      {import.meta.env.VITE_DEMO === "1" && (
        <div className="demo-note">
          Live demo — data is stored in your browser only. Source on{" "}
          <a href="https://github.com/911-parth/job-tracker">GitHub</a>.
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {stats && <StatsBar stats={stats} />}
      {showForm && <AddForm onSubmit={handleAdd} />}

      <FilterBar current={filter} onChange={setFilter} stats={stats} />

      <div className="list">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
        {applications.length === 0 && !error && (
          <p className="empty">
            {filter ? "Nothing with this status." : "No applications yet. Courage, the first one is the hardest."}
          </p>
        )}
      </div>
    </div>
  );
}
