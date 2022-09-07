import { useContext, useMemo, useState, useEffect } from "react";
import L from "leaflet";
import {
  Route as RouteIcon,
  Navigation as NavigationIcon,
} from "@mui/icons-material";
import { IconButton, styled, Avatar } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Polyline,
  Popup,
} from "react-leaflet";
import { getCoByStopObj } from "../../Utils/Utils";
import { companyColor } from "../../constants/Constants";
import { EtaContext } from "../../context/EtaContext";
import { mtrLineColor } from "../../constants/Mtr";
import { DbContext } from "../../context/DbContext";
import { useLocation } from "../../hooks/Location";

const currLocationIconPath = require("../../assets/icons/currentLocation.png");
const stopIconPath = require("../../assets/icons/stop.png");
const startIconPath = require("../../assets/icons/start.png");
const endIconPath = require("../../assets/icons/end.png");

export const Map = ({ destination, expanded }) => {
  const { currRoute, mapStopIdx } = useContext(EtaContext);
  const { location: currentLocation } = useLocation({ interval: 10000 });
  const { gStopList } = useContext(DbContext);
  const [navBtnType, setNavBtnType] = useState("normal");
  const [map, setMap] = useState(null);

  const currRouteStopIdList = useMemo(
    () =>
      currRoute.stops &&
      currRoute.stops[Object.keys(currRoute.stops)[0]].slice(
        currRoute.nearbyOrigStopSeq - 1,
        currRoute.nearbyDestStopSeq
      ),
    [currRoute]
  );

  const currRouteStopList = useMemo(
    () => currRouteStopIdList?.map((e) => gStopList[e]),
    [currRoute]
  );

  const routeLine = currRouteStopList?.map((e) => [
    e.location.lat,
    e.location.lng,
  ]);

  useEffect(() => {
    map && routeLine && map.fitBounds(routeLine);
  }, [currRoute]);

  // const nearestStopIdx = currRouteStopIdList?.findIndex(
  //   (e) => e === nearestStopId
  // );

  // useEffect(() => {
  //   if (!mapLocation) {
  //     updateMapStopIdx(nearestStopIdx);
  //   }
  // }, []);

  // let location = {};

  // if (mapLocation) {
  //   location = mapLocation;
  // } else if (currRouteStopList[nearestStopIdx]) {
  //   location = currRouteStopList[nearestStopIdx].location;
  // } else {
  // location = { lat: 0, lng: 0 };
  // }

  const currLocationIcon = new L.Icon({
    iconUrl: currLocationIconPath,
    iconRetinaUrl: currLocationIconPath,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 20),
    className: "currLocationMarker",
  });

  const startIcon = new L.Icon({
    iconUrl: startIconPath,
    iconRetinaUrl: startIconPath,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(15, 15),
    className: "currLocationMarker",
  });

  const endIcon = new L.Icon({
    iconUrl: endIconPath,
    iconRetinaUrl: endIconPath,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(15, 15),
    className: "currLocationMarker",
  });

  const CustomMarker = ({ stop, i }) => {
    const stopIcon = new L.Icon({
      iconUrl: stopIconPath,
      iconRetinaUrl: stopIconPath,
      iconAnchor: null,
      popupAnchor: [0, 0],
      shadowUrl: null,
      shadowSize: null,
      shadowAnchor: null,
      iconSize: new L.Point(10, 10),
      className: "stopMarker",
    });

    return (
      <Marker
        key={i}
        position={[stop.location.lat, stop.location.lng]}
        icon={stopIcon}
      >
        <Popup>{currRouteStopList[i].name.zh}</Popup>
      </Marker>
    );
  };

  const RouteBoundBtn = () => {
    const _map = useMap();

    const handleIconOnClick = () => {
      _map.fitBounds(routeLine);
      setNavBtnType("normal");
    };

    return (
      <Avatar
        className={`routeBoundBtnAvatar ${mapStopIdx === 0 ? "disabled" : ""}`}
      >
        <IconButton disabled={mapStopIdx === 0} onClick={handleIconOnClick}>
          <RouteIcon />
        </IconButton>
      </Avatar>
    );
  };

  const NavBtn = () => {
    const _map = useMap();

    _map.on("drag", () => {
      setNavBtnType("normal");
    });

    if (navBtnType === "navigation") {
      _map.panTo([currentLocation.lat, currentLocation.lng], {
        animate: true,
        duration: 0.5,
      });
    }

    const handleIconOnClick = () => {
      _map.flyTo([currentLocation.lat, currentLocation.lng], 18, {
        animate: true,
        duration: 0.5,
      });
      setNavBtnType("navigation");
    };

    return (
      <Avatar className={`navBtnAvatar ${navBtnType === "normal" && "normal"}`}>
        <IconButton onClick={handleIconOnClick}>
          <NavigationIcon />
        </IconButton>
      </Avatar>
    );
  };

  return (
    <MapContainerRoot
      center={[22.382263, 114.11465]}
      zoom={9}
      ref={setMap}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[currentLocation.lat, currentLocation.lng]}
        icon={currLocationIcon}
      />

      {destination &&
        Object.keys(currRoute).length > 0 &&
        currRoute.stops &&
        expanded && (
          <>
            <Marker
              position={[currentLocation.lat, currentLocation.lng]}
              icon={startIcon}
            />
            <Marker
              position={[destination.location.lat, destination.location.lng]}
              icon={endIcon}
            />
            <Polyline
              pathOptions={{
                color: `${
                  companyColor["." + getCoByStopObj(currRoute)[0]].color
                }`,
                opacity: "0.75",
              }}
              positions={routeLine}
            />
            {currRouteStopIdList.map((e, i) => {
              const stop = gStopList[e];
              return <CustomMarker stop={stop} key={i} i={i} />;
            })}
          </>
        )}

      <RouteBoundBtn />
      <NavBtn />
    </MapContainerRoot>
  );
};

const MapContainerRoot = styled(MapContainer)({
  flexBasis: "60%",
  maxHeight: "30%",
  zIndex: 0,
  ".leaflet-control-container": {
    ".leaflet-top, .leaflet-bottom": {
      willChange: "transform",
      transform: "translate3d(0px, 0px, 0px)",
    },
  },
  ".leaflet-map-pane": {
    ".leaflet-overlay-pane": {
      ".leaflet-interactive": {
        ...companyColor,
        ...mtrLineColor,
      },
    },
  },
  ".MuiAvatar-root": {
    position: "absolute",
    zIndex: "1001",
    backgroundColor: "white",
    border: "2px solid rgba(0,0,0,0.2)",
    willChange: "transform",
    transform: "translate3d(0px, 0px, 0px)",
    "&.disabled": {
      backgroundColor: "#f4f4f4",
      ".MuiButtonBase-root": {
        color: "#bbb",
      },
    },
    ".MuiButtonBase-root": {
      color: "black",
    },
    "&.prevBtnAvatar": {
      top: "50%",
      width: "35px",
      height: "35px",
      marginTop: "-35px", // equal to width and height
      left: "10px",
    },
    "&.nextBtnAvatar": {
      top: "50%",
      width: "35px",
      height: "35px",
      marginTop: "-35px", // equal to width and height
      right: "10px",
    },
    "&.routeBoundBtnAvatar": {
      right: "55px",
      bottom: "20px",
    },
    "&.navBtnAvatar,": {
      right: "10px",
      bottom: "20px",
      "&.normal button": {
        color: "#777777",
      },
    },
  },
  ".leaflet-marker-pane": {
    ".currLocationMarker": {
      border: "none",
      background: "none",
    },
    ".currStopMarker": {
      "&.selected": {
        filter: "hue-rotate(150deg)",
      },
    },
  },
});
