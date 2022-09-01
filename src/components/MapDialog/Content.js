import { useContext, useMemo, useState, useEffect } from "react";
import L from "leaflet";
import {
  ArrowForwardIos as ArrowForwardIosIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  PersonPinCircle as PersonPinCircleIcon,
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
} from "react-leaflet";
import { getCoByStopObj } from "../../Utils/Utils";
import { companyColor } from "../../constants/Constants";
import { EtaContext } from "../../context/EtaContext";
import { mtrLineColor } from "../../constants/Mtr";
import { DbContext } from "../../context/DbContext";
import { useLocation } from "../../hooks/Location";

const currentLocationIcon = require("../../assets/icons/currentLocation.png");
const markerIcon = require("../../assets/icons/marker-icon-2x.png");

export const Content = () => {
  const { location: currentLocation } = useLocation({ time: 1000 });
  const {
    currRoute,
    nearestStopId,
    mapStopIdx,
    mapLocation,
    updateMapStopIdx,
  } = useContext(EtaContext);
  const { gStopList } = useContext(DbContext);
  const [navBtnType, setNavBtnType] = useState("normal");

  const currRouteStopIdList = useMemo(
    () => currRoute.stops && currRoute.stops[Object.keys(currRoute.stops)[0]],
    [currRoute]
  );

  const nearestStopIdx = currRouteStopIdList?.findIndex(
    (e) => e === nearestStopId
  );

  useEffect(() => {
    if (!mapLocation) {
      updateMapStopIdx(nearestStopIdx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currRouteStopList = useMemo(
    () => currRouteStopIdList?.map((e) => gStopList[e]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currRoute]
  );

  const location = mapLocation || currRouteStopList[nearestStopIdx].location;

  const routeLine = currRouteStopList?.map((e) => [
    e.location.lat,
    e.location.lng,
  ]);

  const currLocationIcon = new L.Icon({
    iconUrl: currentLocationIcon,
    iconRetinaUrl: currentLocationIcon,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 20),
    className: "currLocationMarker",
  });

  const CustomMarker = ({ stop, i }) => {
    const stopIcon = useMemo(
      () =>
        new L.Icon({
          iconUrl: markerIcon,
          iconRetinaUrl: markerIcon,
          iconAnchor: [20, 40],
          popupAnchor: null,
          shadowUrl: null,
          shadowSize: null,
          shadowAnchor: null,
          iconSize: new L.Point(40, 40),
          className: `currStopMarker ${i === mapStopIdx && "selected"} ${
            mapStopIdx > -1 && i > mapStopIdx && "forward"
          }`,
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    const map = useMap();

    const eventHandlers = useMemo(
      () => ({
        click: () => {
          updateMapStopIdx(i);
          map.panTo([stop.location.lat, stop.location.lng], {
            animate: true,
            duration: 0.5,
          });
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    return (
      <Marker
        key={i}
        position={[stop.location.lat, stop.location.lng]}
        eventHandlers={eventHandlers}
        icon={stopIcon}
      />
    );
  };

  const PrevStopBtn = () => {
    const map = useMap();

    const handleIconOnClick = () => {
      const prevStop = currRouteStopList[mapStopIdx - 1];
      map.panTo([prevStop.location.lat, prevStop.location.lng], {
        animate: true,
        duration: 0.5,
      });
      updateMapStopIdx(mapStopIdx - 1);
      setNavBtnType("normal");
    };

    return (
      <Avatar className={`prevBtnAvatar ${mapStopIdx === 0 ? "disabled" : ""}`}>
        <IconButton disabled={mapStopIdx === 0} onClick={handleIconOnClick}>
          <ArrowBackIosNewIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Avatar>
    );
  };

  const NextStopBtn = () => {
    const map = useMap();

    const handleIconOnClick = () => {
      const nextStop = currRouteStopList[mapStopIdx + 1];
      map.panTo([nextStop.location.lat, nextStop.location.lng], {
        animate: true,
        duration: 0.5,
      });
      updateMapStopIdx(mapStopIdx + 1);
      setNavBtnType("normal");
    };

    return (
      <Avatar
        className={`nextBtnAvatar ${
          mapStopIdx === currRouteStopIdList.length - 1 ? "disabled" : ""
        }`}
      >
        <IconButton
          disabled={mapStopIdx === currRouteStopIdList.length - 1}
          onClick={handleIconOnClick}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Avatar>
    );
  };

  const RouteBoundBtn = () => {
    const map = useMap();

    const handleIconOnClick = () => {
      map.fitBounds(routeLine);
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

  const NearestStopBtn = () => {
    const map = useMap();

    const handleIconOnClick = () => {
      const nearestStop = currRouteStopList[nearestStopIdx];
      map.panTo([nearestStop.location.lat, nearestStop.location.lng], {
        animate: true,
        duration: 0.5,
      });
      updateMapStopIdx(nearestStopIdx);
      setNavBtnType("normal");
    };

    return (
      <Avatar className="nearestStopBtnAvatar">
        <IconButton onClick={handleIconOnClick}>
          <PersonPinCircleIcon />
        </IconButton>
      </Avatar>
    );
  };

  const NavBtn = () => {
    const map = useMap();

    map.on("drag", () => {
      setNavBtnType("normal");
    });

    if (navBtnType === "navigation") {
      map.panTo([currentLocation.lat, currentLocation.lng], {
        animate: true,
        duration: 0.5,
      });
    }

    const handleIconOnClick = () => {
      map.flyTo([currentLocation.lat, currentLocation.lng], 18, {
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
      center={[location.lat, location.lng]}
      zoom={18}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {currRoute.stops &&
        currRouteStopIdList.map((e, i) => {
          const stop = gStopList[e];
          return <CustomMarker stop={stop} key={i} i={i} />;
        })}

      <Marker
        position={[currentLocation.lat, currentLocation.lng]}
        icon={currLocationIcon}
      />

      <Polyline
        pathOptions={{
          className: `${
            currRoute.co[0] === "mtr"
              ? currRoute.route
              : getCoByStopObj(currRoute)[0]
          }`,
          opacity: "0.75",
        }}
        positions={routeLine}
      />

      <PrevStopBtn />
      <NextStopBtn />
      <RouteBoundBtn />
      <NearestStopBtn />
      <NavBtn />
    </MapContainerRoot>
  );
};

const MapContainerRoot = styled(MapContainer)({
  height: "100%",
  ".leaflet-control-container": {
    ".leaflet-top, .leaflet-bottom": {
      willChange: "transform",
      transform: "translate3d(0px, 0px, 0px)",
    },
  },
  ".leaflet-map-pane": {
    ".leaflet-overlay-pane": {
      ...companyColor,
      ...mtrLineColor,
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
      right: "10px",
      bottom: "140px",
    },
    "&.nearestStopBtnAvatar": {
      right: "10px",
      bottom: "90px",
    },
    "&.navBtnAvatar,": {
      right: "10px",
      bottom: "40px",
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
      "&.forward": {
        filter: "opacity(0.5)",
      },
    },
  },
});
