// src/components/CategoryFilter/index.js
import { useState, useRef, useEffect } from "react";

/**
 * CategoryFilter component that allows users to search for and select multiple categories.
 */
const CategoryFilter = ({
  allCategories,
  selectedCategories,
  setSelectedCategories,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories([]);
      return;
    }

    const filtered = allCategories.filter(
      (category) =>
        category.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedCategories.has(category)
    );
    setFilteredCategories(filtered.slice(0, 10)); // Limit to first 10 results for performance
  }, [searchTerm, allCategories, selectedCategories]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add a category to the selected categories
  const handleSelectCategory = (category) => {
    const newSelectedCategories = new Set(selectedCategories);
    newSelectedCategories.add(category);
    setSelectedCategories(newSelectedCategories);
    setSearchTerm("");
    setShowDropdown(false);
    inputRef.current.focus();
  };

  // Remove a category from the selected categories
  const handleRemoveCategory = (category) => {
    const newSelectedCategories = new Set(selectedCategories);
    newSelectedCategories.delete(category);
    setSelectedCategories(newSelectedCategories);
  };

  return (
    <div className="category-filter">
      {/* Display selected categories as chips/tags */}
      <div className="selected-categories mb-2">
        {Array.from(selectedCategories).map((category) => (
          <span
            key={category}
            className="badge bg-secondary me-1 mb-1 d-inline-flex align-items-center"
            style={{
              maxWidth: "calc(100% - 10px)",
              overflow: "hidden",
            }}
            title={category} // Show full name on hover
          >
            <span
              className="text-truncate"
              style={{ maxWidth: "calc(100% - 25px)" }}
            >
              {category}
            </span>
            <button
              type="button"
              className="btn-close btn-close-white ms-2 flex-shrink-0"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleRemoveCategory(category)}
              aria-label={`Remove ${category}`}
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
          placeholder="Search for categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          aria-label="Search for categories"
          style={{
            borderColor: "rgba(0,0,0,.45)",
            borderWidth: 1.75,
          }}
        />

        {/* Dropdown for search results */}
        {showDropdown && filteredCategories.length > 0 && (
          <div
            ref={dropdownRef}
            className="position-absolute w-100 mt-1 border rounded shadow-sm bg-white z-index-dropdown"
            style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1000 }}
          >
            {filteredCategories.map((category) => (
              <button
                key={category}
                className="dropdown-item text-start w-100 py-1 px-2"
                onClick={() => handleSelectCategory(category)}
                title={category}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {showDropdown &&
          searchTerm.trim() !== "" &&
          filteredCategories.length === 0 && (
            <div
              className="position-absolute w-100 mt-1 border rounded shadow-sm bg-white p-2 text-center"
              style={{ zIndex: 1000 }}
            >
              No matching categories found
            </div>
          )}
      </div>

      {/* Small helper text */}
      <small className="text-muted d-block mt-1">
        Search and select categories to filter
      </small>
    </div>
  );
};

export default CategoryFilter;
