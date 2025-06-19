import { useContext, useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import {
  ArrowForwardIos as ArrowForwardIosIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  PersonPinCircle as PersonPinCircleIcon,
  Route as RouteIcon,
  Navigation as NavigationIcon,
} from "@mui/icons-material";
import { IconButton, styled, Avatar } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMap, Polyline } from "react-leaflet";
import { getCoPriorityId } from "../../Utils/Utils";
import { companyColor } from "../../constants/Constants";
import { EtaContext } from "../../context/EtaContext";
import { mtrLineColor } from "../../constants/Mtr";
import { DbContext } from "../../context/DbContext";
import { useLocation } from "../../hooks/Location";

const currentLocationIcon = require("../../assets/icons/currentLocation.png");
const markerIcon = require("../../assets/icons/marker-icon-2x.png");

export const Content = () => {
  const { routeKey } = useParams();
  const { location: currentLocation } = useLocation({ interval: 1000 });
  const { nearestStopId, mapStopIdx, mapLocation, updateMapStopIdx } = useContext(EtaContext);
  const { gRouteList, gStopList } = useContext(DbContext);
  const [navBtnType, setNavBtnType] = useState("normal");

  const _currRoute = routeKey ? gRouteList[routeKey] : [];

  const currRouteStopIdList = useMemo(() => _currRoute.stops && _currRoute.stops[Object.keys(_currRoute.stops)[0]], [routeKey]);

  const nearestStopIdx = currRouteStopIdList?.findIndex((e) => e === nearestStopId);

  useEffect(() => {
    if (!mapLocation) {
      updateMapStopIdx(nearestStopIdx);
    }
  }, []);

  const currRouteStopList = useMemo(() => currRouteStopIdList?.map((e) => gStopList[e]), [routeKey]);

  let location = {};

  if (mapLocation) {
    location = mapLocation;
  } else if (currRouteStopList[nearestStopIdx]) {
    location = currRouteStopList[nearestStopIdx].location;
  } else {
    location = { lat: 0, lng: 0 };
  }

  const routeLine = currRouteStopList?.map((e) => [e.location.lat, e.location.lng]);

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
          className: `currStopMarker ${i === mapStopIdx && "selected"} ${mapStopIdx > -1 && i > mapStopIdx && "forward"}`,
        }),
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
      []
    );

    return <Marker key={i} position={[stop.location.lat, stop.location.lng]} eventHandlers={eventHandlers} icon={stopIcon} />;
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
      <Avatar className={`nextBtnAvatar ${mapStopIdx === currRouteStopIdList.length - 1 ? "disabled" : ""}`}>
        <IconButton disabled={mapStopIdx === currRouteStopIdList.length - 1} onClick={handleIconOnClick}>
          <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Avatar>
    );
  };

  const RouteBoundBtn = () => {
    const map = useMap();

    const handleIconOnClick = () => {
      map.flyToBounds(routeLine, { duration: 1 });
      setNavBtnType("normal");
    };

    return (
      <Avatar className="routeBoundBtnAvatar">
        <IconButton onClick={handleIconOnClick}>
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
    <MapContainerRoot center={[location.lat, location.lng]} zoom={18} scrollWheelZoom={false}>
      <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {_currRoute.stops &&
        currRouteStopIdList.map((e, i) => {
          const stop = gStopList[e];
          return <CustomMarker stop={stop} key={i} i={i} />;
        })}

      <Marker position={[currentLocation.lat, currentLocation.lng]} icon={currLocationIcon} />

      <Polyline
        pathOptions={{
          className: `${_currRoute.co[0] === "mtr" ? _currRoute.route : getCoPriorityId(_currRoute)}`,
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
