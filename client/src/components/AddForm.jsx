import { useState } from "react";

const EMPTY = {
  company: "",
  role: "",
  contract: "alternance",
  status: "to_apply",
  applied_on: "",
  link: "",
  location: "",
  notes: "",
};

export default function AddForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      setForm(EMPTY);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="row">
        <input placeholder="Company *" value={form.company} onChange={set("company")} required />
        <input placeholder="Role *" value={form.role} onChange={set("role")} required />
      </div>
      <div className="row">
        <select value={form.contract} onChange={set("contract")}>
          <option value="alternance">Alternance</option>
          <option value="stage">Stage</option>
          <option value="cdi">CDI</option>
        </select>
        <select value={form.status} onChange={set("status")}>
          <option value="to_apply">To apply</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
        </select>
        <input type="date" value={form.applied_on} onChange={set("applied_on")} />
      </div>
      <div className="row">
        <input placeholder="Job posting link" value={form.link} onChange={set("link")} />
        <input placeholder="Location" value={form.location} onChange={set("location")} />
      </div>
      <textarea placeholder="Notes (contact name, salary, stack...)" value={form.notes} onChange={set("notes")} rows={2} />
      <button className="primary" type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
