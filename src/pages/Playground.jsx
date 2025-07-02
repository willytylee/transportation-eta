import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Styled component for the map container
const MapWrapper = styled("div")(({ isCollapsed }) => ({
  height: isCollapsed ? "200px" : "500px",
  width: "100%", // Ensure map takes full width
  transition: "height 0.3s ease", // Smooth height transition
}));

export const Playground = () => {
  const [mapCollapse, setMapCollapse] = useState(false);
  const [map, setMap] = useState(null); // Store map instance for resizing

  const handleToggleCollapse = () => {
    setMapCollapse((prev) => !prev); // Toggle mapCollapse state
  };

  // Resize map when mapCollapse changes
  useEffect(() => {
    if (map) map.invalidateSize(); // Ensure map resizes properly
  }, [mapCollapse, map]);

  return (
    <div>
      <Button variant="contained" onClick={handleToggleCollapse}>
        {mapCollapse ? "Expand Map" : "Collapse Map"}
      </Button>
      <MapWrapper isCollapsed={mapCollapse}>
        <LeafletMap
          center={[51.505, -0.09]} // Example coordinates (e.g., London)
          zoom={13}
          style={{ height: "100%", width: "100%" }} // Ensure map fills container
          whenCreated={setMap} // Store map instance
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LeafletMap>
      </MapWrapper>
    </div>
  );
};
