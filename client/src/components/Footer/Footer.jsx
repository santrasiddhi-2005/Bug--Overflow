import React from "react";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="global-footer" role="contentinfo">
      <div className="global-footer-inner">
        <p>BugOverflow</p>
        <p>Ask • Learn • Share</p>
        <p>© {year}</p>
      </div>
    </footer>
  );
};

export default Footer;
