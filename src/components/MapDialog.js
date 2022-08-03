import { useContext, useMemo, useEffect, useState } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import { DialogTitle, Grid, IconButton, Dialog, styled } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { AppContext } from "../context/AppContext";
import { getActualCoIds, getLocalStorage } from "../Utils";
import { companyMap } from "../constants/Bus";

export const MapDialog = ({
  mapDialogOpen,
  handleMapDialogOnClose,
  fullWidth,
}) => {
  const {
    dbVersion,
    currRoute,
    closestStopId,
    location: currentLocation,
  } = useContext(AppContext);
  const [map, setMap] = useState(null);

  const handleDialogOnClose = () => {
    handleMapDialogOnClose();
  };

  const gStopList = useMemo(() => {
    return getLocalStorage("stopList");
  }, [dbVersion]);

  const currRouteStopList =
    currRoute.stops && currRoute.stops[Object.keys(currRoute.stops)[0]];
  const closestLocation = gStopList[closestStopId]?.location;

  const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click() {
        map.flyTo([currentLocation.lat, currentLocation.lng]);
      },
    });

    return (
      <Marker position={[currentLocation.lat, currentLocation.lng]}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  // const handleHello = () => {
  //   map.flyTo([currentLocation.lat, currentLocation.lng]);
  // };

  return (
    <DialogRoot
      onClose={() => {
        handleDialogOnClose();
      }}
      open={mapDialogOpen}
      fullWidth={fullWidth}
      className="dialogRoot"
    >
      {Object.keys(currRoute).length !== 0 && (
        <>
          <DialogTitle className="dialogTitle">
            <Grid>
              <div>
                <div className="title">
                  {getActualCoIds(currRoute)
                    .map((e, i) => {
                      return (
                        <span key={i} className={e}>
                          {companyMap[e]}
                        </span>
                      );
                    })
                    .reduce((a, b) => [a, " + ", b])}{" "}
                  <span className="route">{currRoute.route}</span>
                </div>
                <div>
                  {currRoute.orig?.zh} →{" "}
                  <span className="dest">{currRoute.dest?.zh}</span>{" "}
                  <span className="special">
                    {" "}
                    {parseInt(currRoute.serviceType, 10) !== 1 && "特別班次"}
                  </span>
                </div>
              </div>
              <IconButton onClick={() => handleDialogOnClose()}>
                <CloseIcon />
              </IconButton>
              {/* <IconButton onClick={() => handleHello()}>hello</IconButton> */}
            </Grid>
          </DialogTitle>

          <MapContainer
            center={[closestLocation?.lat, closestLocation?.lng]}
            zoom={18}
            scrollWheelZoom={false}
            className="mapContainer"
          >
            <TileLayer
              attribution=""
              url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
            />
            {currRoute.stops &&
              currRouteStopList.map((e, i) => {
                const {
                  location: { lat, lng },
                  name,
                } = gStopList[e];
                const idx = currRouteStopList.findIndex((a) => a === e);
                return (
                  <Marker key={i} position={[lat, lng]}>
                    <Popup>{`${idx + 1}. ${name.zh}`}</Popup>
                  </Marker>
                );
              })}
            <LocationMarker />
          </MapContainer>
        </>
      )}
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiPaper-root": {
    height: "100%",
    maxWidth: "90%",
    width: "calc(100% - 32px)",
    margin: 0,
    ".dialogTitle": {
      padding: "4px 0 4px 8px",
      ".MuiGrid-root": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "14px",
        ".route": {
          fontWeight: "900",
        },
        ".kmb": {
          color: "#DD1E2F",
        },
        ".nwfb": {
          color: "#857700",
        },
        ".ctb": {
          color: "#6A42A7",
        },
        ".dest": {
          fontWeight: 900,
        },
        ".special": {
          fontSize: "12px",
        },
      },
    },
    ".mapContainer": {
      height: "100%",
    },
  },
});
