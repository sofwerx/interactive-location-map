// src/pages/index.js
import Head from "next/head";
import Layout from "@components/Layout";
import Map from "@components/Map";
import Menu from "@components/Menu";
import { useState, useRef, useEffect, useMemo } from "react";
import DynamicMarkerCluster from "@components/MarkerCluster/DynamicMarkerCluster";
import { FaBars, FaTimes } from "react-icons/fa";
import { dummyUsers } from "../dummyData";

// Default map center - Replace with your desired default coordinates
const DEFAULT_CENTER = [39.8283, -98.5795]; // Center of the US

/**
 * Main page component
 */
export default function Home({ userData }) {
  const unfilteredUsers = userData;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(unfilteredUsers);
  const [selectedDepartments, setSelectedDepartments] = useState(new Set());
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [zoomedInIndex, setZoomedInIndex] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filterAccordionButtonRef = useRef(null);

  const closeFilterAccordion = () => {
    const filterButton = document.querySelector(
      '[data-bs-target="#collapseTwo"]'
    );
    if (filterButton && !filterButton.classList.contains("collapsed")) {
      filterButton.click();
    }
  };

  // Extract all unique categories from user data
  const allCategories = useMemo(() => {
    const categoriesSet = new Set();

    userData.forEach((user) => {
      // Using Category as the property name - adjust based on your actual data structure
      if (user.attributes.Category && user.attributes.Category.trim() !== "") {
        categoriesSet.add(user.attributes.Category.trim());
      }
    });

    return Array.from(categoriesSet).sort();
  }, [userData]);

  // Handle responsive behavior
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 992px)");

    const handleMediaQueryChange = (e) => {
      if (e.matches) {
        setIsMenuOpen(false); // Set isMenuOpen to false on large screens
      }
    };

    if (mediaQuery.matches) {
      setIsMenuOpen(false);
    }

    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  // CUSTOMIZE: Define your departments/groups here
  const userDepartments = [
    "Department A",
    "Department B",
    "Department C",
    "Department D",
    "Department E",
    "Department F",
    "Department G",
    "Department H",
  ];

  // CUSTOMIZE: Define your marker color mapping here
  const departmentColorMap = {
    "Department A": "#ed6622",
    "Department B": "#dc31f3",
    "Department C": "#3460ed",
    "Department D": "#ed2222",
    "Department E": "#34c761",
    "Department F": "#2ee6e1",
    "Department G": "#e6e62e",
    "Department H": "#6c757d",
  };

  const mapRef = useRef();
  const accordionRef = useRef([]);
  const markersRef = useRef([]);

  // Update markersRef when filteredUsers changes
  useEffect(() => {
    markersRef.current = Array(filteredUsers.length).fill(null);
  }, [filteredUsers.length]);

  /**
   * Handles the change event of a department checkbox
   */
  const handleCheckboxChange = (department) => {
    setSelectedDepartments((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(department)) {
        newSelected.delete(department);
      } else {
        newSelected.add(department);
      }
      return newSelected;
    });
  };

  // Handle filtering based on search, departments, and categories
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let searchResults = unfilteredUsers.filter((item) =>
        item.attributes.Name.toLowerCase().includes(searchValue.toLowerCase())
      );

      // Filter based on selected departments if any are selected
      if (selectedDepartments.size > 0) {
        searchResults = searchResults.filter((item) =>
          item.attributes.Departments.some((dept) =>
            selectedDepartments.has(dept)
          )
        );
      }

      // Filter based on selected categories if any are selected
      if (selectedCategories.size > 0) {
        searchResults = searchResults.filter(
          (item) =>
            item.attributes.Category &&
            selectedCategories.has(item.attributes.Category.trim())
        );
      }

      setFilteredUsers(searchResults);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, selectedDepartments, selectedCategories, unfilteredUsers]);

  return (
    <Layout>
      <Head>
        <title>Interactive Map</title>
        <meta
          name="description"
          content="An interactive map displaying location information."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Mobile Menu Toggle Button */}
      <div
        className="d-lg-none"
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          width: "auto",
          display: "inline-block",
        }}
      >
        <button
          className="btn btn-light"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          style={{
            padding: "8px 10px",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <Menu
        users={unfilteredUsers}
        filteredUsers={filteredUsers}
        setFilteredUsers={setFilteredUsers}
        userDepartments={userDepartments}
        departmentColorMap={departmentColorMap}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        mapRef={mapRef}
        markersRef={markersRef}
        selectedDepartments={selectedDepartments}
        handleCheckboxChange={handleCheckboxChange}
        setSelectedDepartments={setSelectedDepartments}
        allCategories={allCategories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        zoomedInIndex={zoomedInIndex}
        setZoomedInIndex={setZoomedInIndex}
        accordionRef={accordionRef}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        filterAccordionButtonRef={filterAccordionButtonRef}
      />

      <Map
        id="map-container"
        className="h-100 w-100"
        center={DEFAULT_CENTER}
        zoom={5}
        dataparam={{ center: DEFAULT_CENTER, zoom: 5 }}
        mapRef={mapRef}
      >
        {({ TileLayer, Marker, Popup }, Leaflet, departmentIcon) => (
          <>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <DynamicMarkerCluster
              zoomedInIndex={zoomedInIndex}
              setZoomedInIndex={setZoomedInIndex}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              accordionRef={accordionRef}
              isMenuOpen={isMenuOpen}
              DEFAULT_CENTER={DEFAULT_CENTER}
              markersRef={markersRef}
              closeFilterAccordion={closeFilterAccordion}
            >
              {filteredUsers.map((item, index) => {
                const department = item.attributes.Departments[0];
                const icon = departmentIcon[department] || Leaflet.Icon.Default;

                return (
                  <Marker
                    key={index}
                    position={[
                      item.attributes.Latitude,
                      item.attributes.Longitude,
                    ]}
                    icon={icon}
                    item={item}
                  ></Marker>
                );
              })}
            </DynamicMarkerCluster>
          </>
        )}
      </Map>
    </Layout>
  );
}

/**
 * Get static props - Replace with your own data fetching logic
 */
export async function getStaticProps() {
  try {
    // Use local dummy data
    const userData = dummyUsers;

    // Uncomment to use API instead
    /*
    const res = await fetch(
      "https://your-api-endpoint.com/api/users?populate=*&sort[0]=Name",
      {
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch data:", res.statusText);
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const userData = await res.json();
    */

    // Process data
    userData.data.forEach((item) => {
      // Process as needed...
    });

    return {
      props: {
        userData: userData.data,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      props: { userData: [] },
    };
  }
}
