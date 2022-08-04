import { useContext, useMemo, useEffect, useState } from "react";
import L from "leaflet";
import {
  Close as CloseIcon,
  MyLocation as MyLocationIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
} from "@mui/icons-material";
import {
  DialogTitle,
  Grid,
  IconButton,
  Dialog,
  styled,
  Avatar,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
  const [selectedStopIdx, setSelectedStopIdx] = useState(-1);

  const handleDialogOnClose = () => {
    setSelectedStopIdx(-1);
    handleMapDialogOnClose();
  };

  const gStopList = useMemo(() => getLocalStorage("stopList"), [dbVersion]);

  const currRouteStopList = useMemo(
    () => currRoute.stops && currRoute.stops[Object.keys(currRoute.stops)[0]],
    [currRoute]
  );
  const closestStopIdx = currRouteStopList?.findIndex(
    (e) => e === closestStopId
  );

  const NavigationButton = () => {
    const map = useMap();

    return (
      <Avatar className="navButtonAvatar">
        <IconButton
          onClick={() => {
            map.flyTo([currentLocation.lat, currentLocation.lng], 18);
          }}
        >
          <MyLocationIcon />
        </IconButton>
      </Avatar>
    );
  };

  const PrevStopButton = () => {
    const map = useMap();

    const handleIconOnClick = () => {
      const idx = selectedStopIdx === -1 ? closestStopIdx + 1 : selectedStopIdx;
      const prevStop = gStopList[currRouteStopList[idx - 1]];
      map.flyTo([prevStop.location.lat, prevStop.location.lng], 18);
      setSelectedStopIdx(idx - 1);
    };

    return (
      <Avatar className="prevButtonAvatar">
        <IconButton
          disabled={selectedStopIdx === 0}
          onClick={() => {
            handleIconOnClick();
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Avatar>
    );
  };

  const NextStopButton = () => {
    const map = useMap();

    const handleIconOnClick = () => {
      const idx = selectedStopIdx === -1 ? closestStopIdx - 1 : selectedStopIdx;
      const nextStop = gStopList[currRouteStopList[idx + 1]];
      map.flyTo([nextStop.location.lat, nextStop.location.lng], 18);
      setSelectedStopIdx(idx + 1);
    };

    return (
      <Avatar className="nextButtonAvatar">
        <IconButton
          disabled={selectedStopIdx === currRouteStopList.length - 1}
          onClick={() => {
            handleIconOnClick();
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Avatar>
    );
  };

  const myIcon = new L.Icon({
    iconUrl: require("../assets/icons/currentLocation.png"),
    iconRetinaUrl: require("../assets/icons/currentLocation.png"),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 20),
    className: "currLocationMarker",
  });

  console.log(selectedStopIdx);

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
            </Grid>
          </DialogTitle>

          <MapContainer
            center={[currentLocation.lat, currentLocation.lng]}
            zoom={18}
            scrollWheelZoom={false}
            className="mapContainer"
          >
            <TileLayer
              attribution=""
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {currRoute.stops &&
              currRouteStopList.map((e, i) => {
                const currStop = gStopList[e];
                return (
                  <Marker
                    key={i}
                    position={[currStop.location.lat, currStop.location.lng]}
                    eventHandlers={{
                      click: () => {
                        setSelectedStopIdx(i);
                      },
                    }}
                  >
                    <Popup>{`${i + 1}. ${currStop.name.zh}`}</Popup>
                  </Marker>
                );
              })}

            <Marker
              position={[currentLocation.lat, currentLocation.lng]}
              icon={myIcon}
            >
              <Popup>You are here</Popup>
            </Marker>

            <PrevStopButton />
            <NextStopButton />
            <NavigationButton />
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
      ".navButtonAvatar": {
        position: "absolute",
        zIndex: "1001",
        right: "10px",
        bottom: "40px",
        backgroundColor: "white",
        border: "2px solid rgba(0,0,0,0.2)",
        ".MuiButtonBase-root": {
          color: "black",
        },
      },
      ".currLocationMarker": {
        border: "none",
        background: "none",
      },
      ".prevButtonAvatar": {
        position: "absolute",
        zIndex: "1001",
        top: "50%",
        width: "35px",
        height: "35px",
        marginTop: "-35px", // equal to width and height
        backgroundColor: "white",
        border: "2px solid rgba(0,0,0,0.2)",
        left: "10px",
        ".MuiButtonBase-root": {
          color: "black",
        },
      },
      ".nextButtonAvatar": {
        position: "absolute",
        zIndex: "1001",
        top: "50%",
        width: "35px",
        height: "35px",
        marginTop: "-35px", // equal to width and height
        right: "0",
        backgroundColor: "white",
        border: "2px solid rgba(0,0,0,0.2)",
        right: "10px",
        ".MuiButtonBase-root": {
          color: "black",
        },
      },
    },
  },
});
