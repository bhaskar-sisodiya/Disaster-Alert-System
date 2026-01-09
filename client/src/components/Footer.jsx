import "./../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Social Icons */}
        <div className="footer-socials">
          <a href="#" aria-label="Facebook">🌐</a>
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="LinkedIn">💼</a>
          <a href="#" aria-label="Instagram">📷</a>
        </div>

        {/* Links */}
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Team</a>
          <a href="#">Contact</a>
        </div>

        {/* Copyright */}
        <p className="footer-copy">
          © {new Date().getFullYear()} Disaster Alert System | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
