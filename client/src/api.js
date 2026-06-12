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

export const getApplications = (status) =>
  request(`/applications${status ? `?status=${status}` : ""}`);

export const createApplication = (data) =>
  request("/applications", { method: "POST", body: JSON.stringify(data) });

export const updateApplication = (id, data) =>
  request(`/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteApplication = (id) =>
  request(`/applications/${id}`, { method: "DELETE" });

export const getStats = () => request("/stats");
