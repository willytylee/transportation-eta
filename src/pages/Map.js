import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRef } from "react";
const MAP_CENTER = [52.52, 13.405];
const MARKER_POSITION = [52.49913882549316, 13.418318969833383];

export const Map = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onClickShowMarker = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    map.flyTo(MARKER_POSITION, 13);
    const marker = markerRef.current;
    if (marker) {
      marker.openPopup();
    }
  };
  return (
    <div className="App">
      <MapContainer
        whenCreated={(map) => {
          mapRef.current = map;
        }}
        style={{ width: 500, height: 500 }}
        center={MAP_CENTER}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker ref={markerRef} position={MARKER_POSITION}>
          <Popup>Hello I'm a popup!</Popup>
        </Marker>
      </MapContainer>
      <button onClick={onClickShowMarker}>Show marker</button>
    </div>
  );
};
