import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

/**
 * MapControls component adds custom zoom controls to the map
 *
 * @param {Object} props - Component props
 * @param {string} props.position - Position of the controls (topleft, topright, bottomleft, bottomright)
 * @returns {null} This component doesn't render any visible elements directly
 */
const MapControls = ({ position = "topleft" }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Create custom zoom control with improved mobile styling
    const zoomControl = L.control.zoom({
      position: position,
      zoomInTitle: "Zoom in",
      zoomOutTitle: "Zoom out",
    });

    // Add zoom control to map
    map.addControl(zoomControl);

    // Add custom CSS for better touch targets on mobile
    const style = document.createElement("style");
    style.textContent = `
      .leaflet-touch .leaflet-control-zoom a {
        width: 40px !important;
        height: 40px !important;
        line-height: 40px !important;
        font-size: 18px !important;
      }
      
      .leaflet-control-zoom {
        box-shadow: 0 1px 5px rgba(0,0,0,0.25) !important;
        border-radius: 5px !important;
      }
      
      @media (max-width: 768px) {
        .leaflet-control-zoom {
          margin-top: 70px !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Clean up on unmount
    return () => {
      map.removeControl(zoomControl);
      document.head.removeChild(style);
    };
  }, [map, position]);

  return null;
};

export default MapControls;
