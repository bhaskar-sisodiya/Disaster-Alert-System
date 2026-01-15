// utils/emailTemplates/alertEmailTemplate.js
export const buildAlertEmailTemplate = ({ alert, viewAlertsLink }) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px;">
      <h2 style="color:#dc2626;">🚨 New Disaster Alert</h2>

      <p>
        A new <b>${alert.type}</b> alert has been detected in
        <b>${alert.location}</b>.
      </p>

      <p style="margin-top:10px;">
        Please visit our website to view full details and stay updated.
      </p>

      <a href="${viewAlertsLink}"
        style="
          display:inline-block;
          margin-top:12px;
          padding:10px 16px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:8px;
          font-weight:600;
        ">
        View Active Alerts →
      </a>

      ${
        alert.imageUrl
          ? `<div style="margin-top:18px;">
              <p><b>Image Preview:</b></p>
              <img src="${alert.imageUrl}"
                  alt="Alert Image"
                  style="max-width:100%; border-radius:10px; border:1px solid #ddd;" />
            </div>`
          : ""
      }

      <p style="margin-top:18px; color:#6b7280; font-size:0.9rem;">
        Stay safe,<br/>
        Disaster Alert System
      </p>
    </div>
  `;
};
