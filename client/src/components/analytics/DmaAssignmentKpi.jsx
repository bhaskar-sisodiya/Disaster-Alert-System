import { useState } from "react";
import "../../styles/analytics/analyticsCharts.css";

export default function DmaAssignmentKpi({ dmaAssignment }) {
  const [selected, setSelected] = useState(null);

  if (!dmaAssignment) return null;

  const { assignedCount = 0, perDma = [] } = dmaAssignment;

  return (
    <div style={{ marginTop: "2rem" }}>
      <div className="summary-card">
        <p className="summary-label">Alerts Assigned To DMA</p>
        <h2 className="summary-value">{assignedCount}</h2>
      </div>

      <h3 style={{ marginTop: "1.2rem" }}>DMA-wise Assignment</h3>

      {perDma.length === 0 ? (
        <p className="info-text">No DMA assignments found.</p>
      ) : (
        <div className="history-list">
          {perDma.map((item) => (
            <div
              key={item.dmaId}
              className="history-item"
              onClick={() => setSelected(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="history-row">
                <div className="history-main">
                  <h3 className="history-title">{item.dma.username}</h3>
                  <p className="history-time">{item.dma.email}</p>
                </div>

                <div>
                  <b>{item.count}</b> alerts
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Details Modal Section */}
      {selected && (
        <div className="alert-details-card" style={{ marginTop: "1.5rem" }}>
          <h2 className="details-title">DMA Details</h2>
          <p><b>Name:</b> {selected.dma.username}</p>
          <p><b>Email:</b> {selected.dma.email}</p>
          <p><b>Phone:</b> {selected.dma.phone || "—"}</p>
          <p><b>Location:</b> {selected.dma.location || "—"}</p>
          <p><b>Assigned alerts:</b> {selected.count}</p>

          <button className="btn-primary" onClick={() => setSelected(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
