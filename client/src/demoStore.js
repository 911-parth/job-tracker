// Demo backend for the GitHub Pages build: same interface as api.js but
// everything lives in localStorage. The real app talks to the Express API.

const KEY = "job-tracker-demo";

const SEED = [
  { company: "Datadog", role: "Frontend Engineer (alternance)", contract: "alternance", status: "interview", applied_on: "2026-05-12", location: "Paris", link: "", notes: "Tech interview round 2 next week. Stack: React + Go." },
  { company: "BlaBlaCar", role: "Data Analyst (alternance)", contract: "alternance", status: "applied", applied_on: "2026-05-25", location: "Paris", link: "", notes: "Applied via Welcome to the Jungle." },
  { company: "Doctolib", role: "UI/UX apprentice", contract: "alternance", status: "to_apply", applied_on: "", location: "Levallois", link: "", notes: "Need a small portfolio review first." },
  { company: "Back Market", role: "Frontend alternant", contract: "alternance", status: "rejected", applied_on: "2026-04-30", location: "Paris", link: "", notes: "Rejected after HR screen, asked to reapply next year." },
  { company: "Qonto", role: "Product Data alternant", contract: "alternance", status: "applied", applied_on: "2026-05-02", location: "Paris", link: "", notes: "" },
];

function load() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const seeded = SEED.map((a, i) => ({
    id: i + 1,
    ...a,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  save(seeded);
  return seeded;
}

function save(apps) {
  localStorage.setItem(KEY, JSON.stringify(apps));
}

function nextId(apps) {
  return apps.reduce((m, a) => Math.max(m, a.id), 0) + 1;
}

export async function getApplications(status) {
  const apps = load();
  const filtered = status ? apps.filter(a => a.status === status) : apps;
  return [...filtered].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function createApplication(data) {
  const apps = load();
  const app = {
    id: nextId(apps),
    contract: "alternance",
    status: "to_apply",
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  apps.push(app);
  save(apps);
  return app;
}

export async function updateApplication(id, data) {
  const apps = load();
  const app = apps.find(a => a.id === Number(id));
  if (!app) throw new Error("not found");
  Object.assign(app, data, { updated_at: new Date().toISOString() });
  save(apps);
  return app;
}

export async function deleteApplication(id) {
  save(load().filter(a => a.id !== Number(id)));
  return null;
}

export async function getStats() {
  const apps = load();
  const statuses = ["to_apply", "applied", "interview", "offer", "rejected", "no_answer"];
  const byStatus = Object.fromEntries(statuses.map(s => [s, apps.filter(a => a.status === s).length]));
  const sent = apps.length - byStatus.to_apply;
  const answered = byStatus.interview + byStatus.offer + byStatus.rejected;
  return {
    total: apps.length,
    byStatus,
    responseRate: sent ? Math.round((100 * answered) / sent) : 0,
  };
}
