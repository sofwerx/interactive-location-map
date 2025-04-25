import { useState, useRef, useEffect } from "react";

/**
 * SchoolFilter component that allows users to search for and select multiple schools.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.allSchools - Array of all available schools.
 * @param {Set} props.selectedSchools - Set of currently selected schools.
 * @param {function} props.setSelectedSchools - Function to update the selected schools.
 * @returns {JSX.Element} - The rendered SchoolFilter component.
 */
const SchoolFilter = ({ allSchools, selectedSchools, setSelectedSchools }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter schools based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSchools([]);
      return;
    }

    const filtered = allSchools.filter(
      (school) => 
        school.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !selectedSchools.has(school)
    );
    setFilteredSchools(filtered.slice(0, 10)); // Limit to first 10 results for performance
  }, [searchTerm, allSchools, selectedSchools]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add a school to the selected schools
  const handleSelectSchool = (school) => {
    const newSelectedSchools = new Set(selectedSchools);
    newSelectedSchools.add(school);
    setSelectedSchools(newSelectedSchools);
    setSearchTerm("");
    setShowDropdown(false);
    inputRef.current.focus();
  };

  // Remove a school from the selected schools
  const handleRemoveSchool = (school) => {
    const newSelectedSchools = new Set(selectedSchools);
    newSelectedSchools.delete(school);
    setSelectedSchools(newSelectedSchools);
  };

  return (
    <div className="school-filter">
      {/* Display selected schools as chips/tags */}
      <div className="selected-schools mb-2">
        {Array.from(selectedSchools).map((school) => (
          <span 
            key={school} 
            className="badge bg-secondary me-1 mb-1 d-inline-flex align-items-center"
            style={{ 
              maxWidth: "calc(100% - 10px)",
              overflow: "hidden"
            }}
            title={school} // Show full name on hover
          >
            <span className="text-truncate" style={{ maxWidth: "calc(100% - 25px)" }}>
              {school}
            </span>
            <button 
              type="button" 
              className="btn-close btn-close-white ms-2 flex-shrink-0" 
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleRemoveSchool(school)}
              aria-label={`Remove ${school}`}
            ></button>
          </span>
        ))}
      </div>
      
      {/* Search input */}
      <div className="position-relative">
        <input
          ref={inputRef}
          type="text"
          className="form-control text-dark"
          placeholder="Search for schools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          aria-label="Search for schools"
          style={{
            borderColor: "rgba(0,0,0,.45)",
            borderWidth: 1.75,
          }}
        />
        
        {/* Dropdown for search results */}
        {showDropdown && filteredSchools.length > 0 && (
          <div 
            ref={dropdownRef}
            className="position-absolute w-100 mt-1 border rounded shadow-sm bg-white z-index-dropdown"
            style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1000 }}
          >
            {filteredSchools.map((school) => (
              <button
                key={school}
                className="dropdown-item text-start w-100 py-1 px-2"
                onClick={() => handleSelectSchool(school)}
                title={school}
              >
                {school}
              </button>
            ))}
          </div>
        )}
        
        {showDropdown && searchTerm.trim() !== "" && filteredSchools.length === 0 && (
          <div 
            className="position-absolute w-100 mt-1 border rounded shadow-sm bg-white p-2 text-center"
            style={{ zIndex: 1000 }}
          >
            No matching schools found
          </div>
        )}
      </div>
      
      {/* Small helper text */}
      <small className="text-muted d-block mt-1">
        Search and select schools to filter
      </small>
    </div>
  );
};

export default SchoolFilter;