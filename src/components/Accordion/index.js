// src/components/Accordion/index.js
import React from "react";

/**
 * Accordion component for displaying a list of user information.
 */
const Accordion = ({
  filteredUsers,
  mapRef,
  markersRef,
  activeIndex,
  setActiveIndex,
  zoomedInIndex,
  setZoomedInIndex,
  accordionRef,
  closeFilterAccordion,
}) => {
  return (
    <div className="accordion" id="userList">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((item, index) => {
          return (
            <div
              className="accordion-item bg-transparent list-unstyled"
              id={"userTab" + index}
              key={index}
              ref={(el) => (accordionRef.current[index] = el)}
            >
              <h2 className="accordion-header bg-transparent">
                <button
                  className={`accordion-button fw-bold ${
                    index === activeIndex ? "" : "collapsed"
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={"#listUser" + index}
                  aria-expanded={index === activeIndex ? "true" : "false"}
                  aria-controls={"listUser" + index}
                  style={{
                    backgroundColor: "#ffffff",
                  }}
                  onClick={(e) => {
                    // Close the filter accordion when a user name is clicked
                    closeFilterAccordion();
                  }}
                >
                  {item.attributes.Name}
                </button>
              </h2>
              <div
                id={"listUser" + index}
                className={`accordion-collapse ${
                  index === activeIndex ? "collapse show" : "collapse"
                }`}
                data-bs-parent="#userList"
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-md-8 col-sm-12">
                      {/* CUSTOMIZE: Display your user attributes here */}
                      <b>Category: </b> {item.attributes.Category || "N/A"}
                      <br />
                      {item.attributes.Role && (
                        <>
                          <b>Role: </b> {item.attributes.Role}
                          <br />
                        </>
                      )}
                      <b>Department: </b>{" "}
                      {item.attributes.Departments.join(", ")}
                      <br />
                      <b>Company: </b>
                      {item.attributes.Company || "N/A"}
                      <br />
                      <b>Location:</b> {item.attributes.Location || "N/A"}
                      <br />
                      {/* Add additional user details as needed */}
                      {item.attributes.ProfileLink && (
                        <>
                          <b>Profile: </b>
                          <a
                            href={item.attributes.ProfileLink}
                            target="_blank"
                            rel="noreferrer noopener"
                            style={{
                              color: "#0d6efd",
                              textDecoration: "underline",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.color = "#0056b3")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.color = "#0d6efd")
                            }
                          >
                            View Profile
                          </a>
                          <br />
                        </>
                      )}
                    </div>
                    <div className="col-md-4 col-sm-12 mt-2 mt-md-0">
                      {/* User Image */}
                      {item.attributes.Image && item.attributes.Image.data && (
                        <img
                          src={item.attributes.Image.data.attributes.url}
                          className="img-fluid rounded mx-auto d-block"
                          alt={`Photo of ${item.attributes.Name}`}
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            maxHeight: "150px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center p-4">
          <p>No users match your search criteria.</p>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default Accordion;
