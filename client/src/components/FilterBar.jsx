const FILTERS = [
  ["", "All"],
  ["to_apply", "To apply"],
  ["applied", "Applied"],
  ["interview", "Interview"],
  ["offer", "Offer"],
  ["rejected", "Rejected"],
  ["no_answer", "No answer"],
];

export default function FilterBar({ current, onChange, stats }) {
  return (
    <div className="filters">
      {FILTERS.map(([value, label]) => {
        const count = value === "" ? stats?.total : stats?.byStatus[value];
        return (
          <button
            key={value}
            className={current === value ? "filter active" : "filter"}
            onClick={() => onChange(value)}
          >
            {label}
            {count != null && <span className="count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
