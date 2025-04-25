// src/components/MarkerCluster/MarkerCluster.js
import React, { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import "leaflet.markercluster";

const DEFAULT_ZOOM_LEVEL = 5;

// Function to create popup content - CUSTOMIZE with your own template and fields
const createPopupContent = (item) => `
  <div style="display: flex; flex-direction: row; padding: 1px; min-width: 250px;">
    <div style="margin-right: 12px;">
      ${
        item.attributes.Image && item.attributes.Image.data
          ? `<img
          src="${item.attributes.Image.data.attributes.url}" 
          style="height: 80px; width: 80px; object-fit: cover; border-radius: 5px;"
          alt="User Photo"
        />`
          : `<div style="height: 80px; width: 80px; background-color: #f0f0f0; border-radius: 5px; display: flex; align-items: center; justify-content: center;">
          <span>No Image</span>
        </div>`
      }
    </div>
    <div style="display: flex; flex-direction: column; justify-content: flex-start;">
      <p style="font-size: 16px; font-weight: bold; margin: 0 0 5px 0;">
        ${item.attributes.Name}
      </p>
      <p style="margin: 0 0 3px 0; font-size: 12px;"><b>Category:</b> ${
        item.attributes.Category || "N/A"
      }</p>
      ${
        item.attributes.Role
          ? `<p style="margin: 0 0 3px 0; font-size: 12px;"><b>Role:</b> ${item.attributes.Role}</p>`
          : ""
      }
      <p style="margin: 0 0 3px 0; font-size: 12px;"><b>Department:</b> ${item.attributes.Departments.join(
        ", "
      )}</p>
      <p style="margin: 0 0 3px 0; font-size: 12px;"><b>Company:</b> ${
        item.attributes.Company || "N/A"
      }</p>
      <p style="margin: 0 0 3px 0; font-size: 12px;"><b>Location:</b> ${
        item.attributes.Location || "N/A"
      }</p>
      ${
        item.attributes.ProfileLink
          ? `<p style="margin: 0; font-size: 12px;"><b>Profile:</b> <a href="${item.attributes.ProfileLink}" target="_blank" style="color: #0d6efd;">View Profile</a></p>`
          : ""
      }
    </div>
  </div>
`;

const MarkerCluster = ({
  children,
  DEFAULT_CENTER,
  zoomedInIndex,
  setZoomedInIndex,
  setActiveIndex,
  activeIndex,
  accordionRef,
  isMenuOpen,
  markersRef,
  closeFilterAccordion,
}) => {
  const map = useMap();
  const markerClusterGroupRef = useRef(null);
  const [previousZoomLevel, setPreviousZoomLevel] =
    useState(DEFAULT_ZOOM_LEVEL);
  const MAX_ZOOM = 13;
  const markerPositions = useRef([]);

  // Handle zoom out behavior
  const handleZoomOut = (marker) => {
    if (marker) {
      marker._isZoomingOut = true;
      marker.closePopup();
    }

    const currentLatLng = marker ? marker.getLatLng() : map.getCenter();
    const newZoomLevel = previousZoomLevel || DEFAULT_ZOOM_LEVEL;

    map.flyTo(currentLatLng, newZoomLevel, { duration: 0.3 });

    setZoomedInIndex(null);
    setActiveIndex(-1);

    if (marker) {
      setTimeout(() => {
        marker._isZoomingOut = false;
      }, 500);
    }
  };

  // Handle zoom in behavior
  const handleZoomIn = (index, marker) => {
    setPreviousZoomLevel(map.getZoom());

    const exactPosition = markerPositions.current[index];
    const latLng = exactPosition || marker.getLatLng();

    const newLatLng = isMenuOpen
      ? { lat: latLng.lat + 0.0015, lng: latLng.lng }
      : latLng;

    map.setView(newLatLng, map.getZoom(), { animate: false });
    map.flyTo(newLatLng, MAX_ZOOM, { duration: 0.3 });

    setActiveIndex(index);
    setZoomedInIndex(index);

    const accordionItem = accordionRef.current[index];
    if (accordionItem) {
      const scrollContainer = accordionItem.closest(".overflow-scroll");

      if (scrollContainer) {
        scrollContainer.scrollTop =
          accordionItem.offsetTop - scrollContainer.offsetTop;
      } else {
        accordionItem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Handle marker clicks
  const handleMarkerClick = (index, marker) => {
    closeFilterAccordion();
    if (zoomedInIndex === index) {
      handleZoomOut(marker);
    } else {
      handleZoomIn(index, marker);
    }
  };

  // Handle accordion clicks
  const handleAccordionClick = (index) => {
    closeFilterAccordion();
    const marker = markersRef.current[index];

    if (zoomedInIndex === index) {
      handleZoomOut(marker);
    } else {
      handleZoomIn(index, marker);
    }
  };

  useEffect(() => {
    let markerClusterGroup;

    const loadLeaflet = async () => {
      markerClusterGroup = L.markerClusterGroup({
        disableClusteringAtZoom: 10,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true,
        spiderfyDistanceMultiplier: 1.5,
      });

      map.addLayer(markerClusterGroup);
      markerClusterGroupRef.current = markerClusterGroup;

      markerPositions.current = [];

      React.Children.forEach(children, (child, index) => {
        if (child.props && child.props.position && child.props.item) {
          const exactPosition = L.latLng(
            child.props.position[0],
            child.props.position[1]
          );
          markerPositions.current[index] = exactPosition;

          const marker = L.marker(exactPosition, {
            icon: child.props.icon,
          });

          if (markersRef && markersRef.current) {
            markersRef.current[index] = marker;
          }

          const popupContent = createPopupContent(child.props.item);
          const popupOptions = { offset: [0, -25] };
          marker.bindPopup(popupContent, popupOptions);

          marker.on("popupclose", (e) => {
            if (!marker._isZoomingOut && zoomedInIndex === index) {
              marker._isZoomingOut = true;
              setZoomedInIndex(null);
              setActiveIndex(-1);

              const newZoomLevel = previousZoomLevel || DEFAULT_ZOOM_LEVEL;
              map.flyTo(marker.getLatLng(), newZoomLevel, { duration: 0.3 });

              setTimeout(() => {
                marker._isZoomingOut = false;
              }, 500);
            }
          });

          marker.originalPosition = exactPosition;

          marker.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            handleMarkerClick(index, marker);
          });

          markerClusterGroup.addLayer(marker);
        }
      });

      markerClusterGroup.on("clusterclick", function (e) {
        if (map.getZoom() === map.getMaxZoom()) {
          e.layer.spiderfy();
          return false;
        }
      });

      if (zoomedInIndex !== null && markersRef.current[zoomedInIndex]) {
        setTimeout(() => {
          const marker = markersRef.current[zoomedInIndex];
          if (marker && marker.openPopup) {
            const position =
              markerPositions.current[zoomedInIndex] || marker.getLatLng();
            map.setView(position, MAX_ZOOM, { animate: false });
            marker.openPopup();
          }
        }, 500);
      }
    };

    if (typeof window !== "undefined") {
      loadLeaflet();
    }

    return () => {
      if (markerClusterGroup) {
        map.removeLayer(markerClusterGroup);
      }
    };
  }, [
    children,
    map,
    markersRef,
    zoomedInIndex,
    setZoomedInIndex,
    setActiveIndex,
    closeFilterAccordion,
  ]);

  // Handle accordion click events
  useEffect(() => {
    const createClickHandler = (index) => (event) => {
      event.stopPropagation();
      handleAccordionClick(index);
    };

    const clickHandlers = {};

    if (accordionRef && Array.isArray(accordionRef.current)) {
      accordionRef.current.forEach((el, index) => {
        if (el) {
          const button = el.querySelector(".accordion-button");
          if (button) {
            clickHandlers[index] = createClickHandler(index);
            button.removeEventListener("click", clickHandlers[index]);
            button.addEventListener("click", clickHandlers[index]);
          }
        }
      });
    }

    return () => {
      if (accordionRef && Array.isArray(accordionRef.current)) {
        accordionRef.current.forEach((el, index) => {
          if (el) {
            const button = el.querySelector(".accordion-button");
            if (button && clickHandlers[index]) {
              button.removeEventListener("click", clickHandlers[index]);
            }
          }
        });
      }
    };
  }, [
    accordionRef,
    map,
    markersRef,
    zoomedInIndex,
    isMenuOpen,
    closeFilterAccordion,
  ]);

  return null;
};

export default MarkerCluster;
