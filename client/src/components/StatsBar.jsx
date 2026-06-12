export default function StatsBar({ stats }) {
  const items = [
    { label: "Total", value: stats.total },
    { label: "Applied", value: stats.byStatus.applied },
    { label: "Interviews", value: stats.byStatus.interview },
    { label: "Offers", value: stats.byStatus.offer },
    { label: "Rejected", value: stats.byStatus.rejected },
    { label: "Response rate", value: stats.responseRate + "%" },
  ];
  return (
    <div className="stats">
      {items.map((item) => (
        <div className="stat" key={item.label}>
          <span className="stat-value">{item.value}</span>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
