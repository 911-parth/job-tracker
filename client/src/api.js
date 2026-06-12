// In demo mode (the hosted GitHub Pages build) we swap the HTTP layer for a
// localStorage store so the demo works without a server.
import * as demo from "./demoStore.js";

const DEMO = import.meta.env.VITE_DEMO === "1";

const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const getApplications = DEMO
  ? demo.getApplications
  : (status) => request(`/applications${status ? `?status=${status}` : ""}`);

export const createApplication = DEMO
  ? demo.createApplication
  : (data) => request("/applications", { method: "POST", body: JSON.stringify(data) });

export const updateApplication = DEMO
  ? demo.updateApplication
  : (id, data) => request(`/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteApplication = DEMO
  ? demo.deleteApplication
  : (id) => request(`/applications/${id}`, { method: "DELETE" });

export const getStats = DEMO ? demo.getStats : () => request("/stats");
