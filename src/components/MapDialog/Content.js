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
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import { AppContext } from "../../context/AppContext";
import { getCoByStopObj } from "../../Utils";
import { companyColor } from "../../constants/Constants";
import { EtaContext } from "../../context/EtaContext";
import { mtrLineColor } from "../../constants/Mtr";

export const Content = ({ gStopList }) => {
  const { location: currentLocation } = useContext(AppContext);
  const {
    currRoute,
    nearestStopId,
    mapStopIdx,
    mapLocation,
    updateMapStopIdx,
  } = useContext(EtaContext);
  const [navBtnType, setNavBtnType] = useState("normal");

  const location = mapLocation ? mapLocation : currentLocation;

  const currRouteStopIdList = useMemo(
    () => currRoute.stops && currRoute.stops[Object.keys(currRoute.stops)[0]],
    [currRoute]
  );
  const nearestStopIdx = currRouteStopIdList?.findIndex(
    (e) => e === nearestStopId
  );
  const currRouteStopList = useMemo(
    () => currRouteStopIdList?.map((e) => gStopList[e]),
    [currRoute]
  );

  const routeLine = currRouteStopList?.map((e) => [
    e.location.lat,
    e.location.lng,
  ]);

  const myIcon = new L.Icon({
    iconUrl: require("../../assets/icons/currentLocation.png"),
    iconRetinaUrl: require("../../assets/icons/currentLocation.png"),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 20),
    className: "currLocationMarker",
  });

  const CustomMarker = ({ currStop, i }) => {
    const map = useMap();

    const eventHandlers = useMemo(
      () => ({
        click: () => {
          updateMapStopIdx(i);
          map.panTo([currStop.location.lat, currStop.location.lng], {
            animate: true,
            duration: 0.5,
          });
        },
      }),
      []
    );

    return (
      <Marker
        key={i}
        position={[currStop.location.lat, currStop.location.lng]}
        eventHandlers={eventHandlers}
      >
        <Popup>{`${i + 1}. ${currStop.name.zh}`}</Popup>
      </Marker>
    );
  };

  const PrevStopBtn = () => {
    const map = useMap();

    const handleIconOnClick = () => {
      const idx = mapStopIdx === -1 ? nearestStopIdx + 1 : mapStopIdx;
      const prevStop = currRouteStopList[idx - 1];
      map.panTo([prevStop.location.lat, prevStop.location.lng], {
        animate: true,
        duration: 0.5,
      });
      updateMapStopIdx(idx - 1);
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
      const idx = mapStopIdx === -1 ? nearestStopIdx - 1 : mapStopIdx;
      const nextStop = currRouteStopList[idx + 1];
      map.panTo([nextStop.location.lat, nextStop.location.lng], {
        animate: true,
        duration: 0.5,
      });
      updateMapStopIdx(idx + 1);
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

    useEffect(() => {
      if (navBtnType === "navigation") {
        map.panTo([currentLocation.lat, currentLocation.lng], {
          animate: true,
          duration: 0.5,
        });
      }
    }, [currentLocation.lat, currentLocation.lng, navBtnType]);

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
          const currStop = gStopList[e];
          return <CustomMarker currStop={currStop} key={i} i={i} />;
        })}

      <Marker
        position={[currentLocation.lat, currentLocation.lng]}
        icon={myIcon}
      ></Marker>

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
  ".currLocationMarker": {
    border: "none",
    background: "none",
  },
});
