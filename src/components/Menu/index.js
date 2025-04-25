// src/components/Menu/index.js
import { useState, useEffect, useRef } from "react";
import Accordion from "@components/Accordion";
import CategoryFilter from "@components/CategoryFilter";

/**
 * Menu component displays a menu with filters and search functionality
 */
const Menu = ({ ...props }) => {
  const {
    filteredUsers,
    setFilteredUsers,
    userDepartments,
    departmentColorMap,
    searchValue,
    setSearchValue,
    selectedDepartments,
    handleCheckboxChange,
    mapRef,
    markersRef,
    activeIndex,
    setActiveIndex,
    setSelectedDepartments,
    allCategories,
    selectedCategories,
    setSelectedCategories,
    zoomedInIndex,
    setZoomedInIndex,
    accordionRef,
    isMenuOpen,
    setIsMenuOpen,
  } = props;

  // Reference to the filter accordion button to control its state
  const filterAccordionButtonRef = useRef(null);
  // Flag to track if a department/category filter change is in progress
  const filterChangeInProgressRef = useRef(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMenuOpen(false);
    }
  };

  // Function to close the filter accordion
  const closeFilterAccordion = () => {
    if (filterAccordionButtonRef.current) {
      const button = filterAccordionButtonRef.current;
      if (!button.classList.contains("collapsed")) {
        button.click();
      }
    } else {
      // Fallback method if ref isn't available
      const filterButton = document.querySelector(
        '[data-bs-target="#collapseTwo"]'
      );
      if (filterButton && !filterButton.classList.contains("collapsed")) {
        filterButton.click();
      }
    }
  };

  // Function to handle department checkbox changes
  const handleDepartmentCheckboxChange = (department) => {
    // Set flag to prevent accordion closing
    filterChangeInProgressRef.current = true;
    // Call the original checkbox change handler
    handleCheckboxChange(department);
    // Reset flag after a short delay to ensure event processing is complete
    setTimeout(() => {
      filterChangeInProgressRef.current = false;
    }, 100);
  };

  // Create a wrapper for setSelectedCategories that sets our flag
  const handleSetSelectedCategories = (newSelectedCategories) => {
    // Set flag to prevent accordion closing
    filterChangeInProgressRef.current = true;
    // Call the original setter
    setSelectedCategories(newSelectedCategories);
    // Reset flag after a short delay
    setTimeout(() => {
      filterChangeInProgressRef.current = false;
    }, 100);
  };

  return (
    <>
      {/* Overlay background that appears when menu is open on mobile */}
      {isMenuOpen && (
        <div
          className="d-lg-none"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 980,
          }}
          onClick={handleOverlayClick}
        ></div>
      )}

      <div
        className={`col-lg-3 ${isMenuOpen ? "d-block" : "d-none"} d-lg-block`}
        style={{
          position: isMenuOpen ? "fixed" : "static",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 990,
          backgroundColor: "white",
          boxShadow: isMenuOpen ? "2px 0 5px rgba(0,0,0,0.2)" : "none",
          overflowY: "auto",
          width: isMenuOpen ? "85%" : "25%",
        }}
      >
        <div className="d-flex flex-column h-100">
          {/* Logo Section - CUSTOMIZE */}
          <div className="my-3 border-bottom">
            <a href="/" className="d-block py-2 px-3">
              <img
                priority="true"
                src="/your-logo.png"
                alt="Company logo"
                style={{ width: "100%", maxWidth: "100%", height: "auto" }}
              />
            </a>
          </div>

          {/* Search & Filters */}
          <div>
            {/* Search Bar */}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search Users"
                aria-label="User Search Bar"
                aria-describedby="user-count"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <span
                className="input-group-text"
                id="user-count"
                style={{
                  backgroundColor: "#f8f9fa",
                  fontWeight: "600",
                }}
              >
                {filteredUsers.length}
              </span>
            </div>

            {/* Filters Accordion */}
            <div className="accordion mb-3" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                    style={{
                      backgroundColor: "#f8f9fa",
                      fontWeight: "600",
                    }}
                    ref={filterAccordionButtonRef}
                  >
                    Filter Options
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body p-3">
                    {/* Department Filters */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0 fw-bold">Filter by Department</h6>
                        {selectedDepartments.size > 0 && (
                          <button
                            type="button"
                            className="btn btn-sm p-1 text-white"
                            style={{
                              fontSize: "0.8rem",
                              backgroundColor: "#007bff",
                              fontWeight: "600",
                            }} // CUSTOMIZE: Color
                            onClick={() => {
                              filterChangeInProgressRef.current = true;
                              setSelectedDepartments(new Set());
                              setTimeout(() => {
                                filterChangeInProgressRef.current = false;
                              }, 100);
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <div className="department-filters">
                        {userDepartments.map((department, index) => {
                          const isSelected =
                            selectedDepartments.has(department);
                          return (
                            <div key={index} className="form-check mb-1">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`${department}_filter`}
                                checked={isSelected}
                                onChange={() =>
                                  handleDepartmentCheckboxChange(department)
                                }
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`${department}_filter`}
                                style={{
                                  cursor: "pointer",
                                  color: departmentColorMap[department],
                                  textShadow: "black 1px 1px 1px",
                                }}
                              >
                                {department}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <hr className="my-3" />

                    {/* Category Filter */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0 fw-bold">Filter by Category</h6>
                        {selectedCategories.size > 0 && (
                          <button
                            type="button"
                            className="btn btn-sm p-1 text-white"
                            style={{
                              fontSize: "0.8rem",
                              backgroundColor: "#007bff",
                              fontWeight: "600",
                            }} // CUSTOMIZE: Color
                            onClick={() => {
                              filterChangeInProgressRef.current = true;
                              setSelectedCategories(new Set());
                              setTimeout(() => {
                                filterChangeInProgressRef.current = false;
                              }, 100);
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <CategoryFilter
                        allCategories={allCategories}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={handleSetSelectedCategories}
                      />
                    </div>

                    {/* Reset All Filters Button */}
                    {(selectedDepartments.size > 0 ||
                      selectedCategories.size > 0) && (
                      <button
                        type="button"
                        className="btn btn-sm w-100 mt-2"
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          fontWeight: "600",
                        }} // CUSTOMIZE: Color
                        onClick={() => {
                          filterChangeInProgressRef.current = true;
                          setSelectedDepartments(new Set());
                          setSelectedCategories(new Set());
                          setTimeout(() => {
                            filterChangeInProgressRef.current = false;
                          }, 100);
                        }}
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User List */}
          <div
            className="flex-grow-1 overflow-scroll"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            <Accordion
              filteredUsers={filteredUsers}
              mapRef={mapRef}
              markersRef={markersRef}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              zoomedInIndex={zoomedInIndex}
              setZoomedInIndex={setZoomedInIndex}
              accordionRef={accordionRef}
              closeFilterAccordion={closeFilterAccordion}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
