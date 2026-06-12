const STATUS_LABELS = {
  to_apply: "To apply",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  no_answer: "No answer",
};

// after 2 weeks with no news, it's time to follow up
const FOLLOW_UP_DAYS = 14;

function needsFollowUp(app) {
  if (app.status !== "applied" || !app.applied_on) return false;
  const days = (Date.now() - new Date(app.applied_on)) / 86400000;
  return days > FOLLOW_UP_DAYS;
}

export default function ApplicationCard({ app, onStatusChange, onDelete }) {
  return (
    <div className={`card status-${app.status}`}>
      <div className="card-main">
        <div>
          <strong>{app.company}</strong>
          <span className="role"> — {app.role}</span>
          {app.location && <span className="location"> · {app.location}</span>}
        </div>
        <div className="card-meta">
          <span className="contract">{app.contract}</span>
          {app.applied_on && <span>applied {app.applied_on}</span>}
          {needsFollowUp(app) && <span className="follow-up">follow up?</span>}
          {app.link && (
            <a href={app.link} target="_blank" rel="noreferrer">
              posting
            </a>
          )}
        </div>
        {app.notes && <p className="notes">{app.notes}</p>}
      </div>
      <div className="card-actions">
        <select value={app.status} onChange={(e) => onStatusChange(app.id, e.target.value)}>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button className="delete" onClick={() => onDelete(app.id)} title="Delete">
          ×
        </button>
      </div>
    </div>
  );
}
