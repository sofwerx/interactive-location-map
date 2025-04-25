import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

/**
 * MobileNav component that displays a hamburger menu icon on mobile devices
 * to toggle the visibility of the menu.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isMenuOpen - Flag indicating whether the menu is open or not.
 * @param {function} props.setIsMenuOpen - Function to toggle the menu open state.
 * @returns {JSX.Element} The rendered MobileNav component.
 */
const MobileNav = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <div
      className="d-lg-none"
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 1000,
        backgroundColor: "white",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        padding: "10px",
      }}
    >
      <button
        className="btn btn-light"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
    </div>
  );
};

export default MobileNav;
