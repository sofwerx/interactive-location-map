// src/components/Map/DynamicMap.js
import { useEffect } from "react";
import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";

const { MapContainer } = ReactLeaflet;
const { Icon } = Leaflet;

/**
 * Map component that renders a Leaflet map with custom icons.
 */
const Map = ({ children, mapRef, ...rest }) => {
  useEffect(() => {
    (async function init() {
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
        iconUrl: "leaflet/images/marker-icon.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
      });
    })();
  }, []);

  // CUSTOMIZE: Define your custom icons for different departments
  const blueIcon = new Icon({
    iconUrl: "/images/blue-pin.png",
    iconSize: [25, 35],
    iconAnchor: [12, 35],
  });

  const redIcon = new Icon({
    iconUrl: "/images/red-pin.png",
    iconSize: [25, 35],
    iconAnchor: [12, 35],
  });

  const greenIcon = new Icon({
    iconUrl: "/images/green-pin.png",
    iconSize: [25, 35],
    iconAnchor: [12, 35],
  });

  const yellowIcon = new Icon({
    iconUrl: "/images/yellow-pin.png",
    iconSize: [25, 35],
    iconAnchor: [12, 35],
  });

  const orangeIcon = new Icon({
    iconUrl: "/images/orange-pin.png",
    iconSize: [25, 35],
    iconAnchor: [12, 35],
  });

  const purpleIcon = new Icon({
    iconUrl: "/images/purple-pin.png",
    iconSize: [25, 35],
    iconAnchor: [12, 35],
  });

  const lightBlueIcon = new Icon({
    iconUrl: "/images/light-blue-pin.png",
    iconSize: [25, 35],
    iconAnchor: [12, 35],
  });

  const greyIcon = new Icon({
    iconUrl: "/images/grey-pin.png",
    iconSize: [25, 35],
    iconAnchor: [12, 35],
  });

  // Map departments to icons - CUSTOMIZE with your own departments
  const departmentIcon = {
    "Department A": orangeIcon,
    "Department B": purpleIcon,
    "Department C": blueIcon,
    "Department D": redIcon,
    "Department E": greenIcon,
    "Department F": lightBlueIcon,
    "Department G": yellowIcon,
    "Department H": greyIcon,
  };

  return (
    <MapContainer className="m-100 w-100" ref={mapRef} {...rest}>
      {children(ReactLeaflet, Leaflet, departmentIcon)}
    </MapContainer>
  );
};

export default Map;
