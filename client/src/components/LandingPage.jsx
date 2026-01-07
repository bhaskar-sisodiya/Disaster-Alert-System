import "./../styles/landing.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-card">
        <h1>Disaster Alert System</h1>
        <p>Real-time monitoring and alerts for critical situations</p>

        <div className="landing-buttons">
          <Link to="/register" className="btn primary">
            Get Started
          </Link>
          <Link to="/login" className="btn secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
