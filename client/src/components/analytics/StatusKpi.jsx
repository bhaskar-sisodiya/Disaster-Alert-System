export default function StatusKpi({ statusKpi = [] }) {
  const getCount = (key) =>
    statusKpi.find((x) => x._id === key)?.count || 0;

  const noAction = getCount("no_action");
  const inProcess = getCount("in_process");
  const resolved = getCount("resolved");

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <p className="summary-label">No Action</p>
        <h2 className="summary-value">{noAction}</h2>
      </div>

      <div className="summary-card">
        <p className="summary-label">In Process</p>
        <h2 className="summary-value">{inProcess}</h2>
      </div>

      <div className="summary-card">
        <p className="summary-label">Resolved</p>
        <h2 className="summary-value">{resolved}</h2>
      </div>
    </div>
  );
}
