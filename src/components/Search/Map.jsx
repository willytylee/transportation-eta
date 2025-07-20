import { useContext, useMemo, useState, useEffect } from "react";
import _ from "lodash";
import { useParams, useNavigate } from "react-router-dom";
import L from "leaflet";
import {
  PersonPinCircle as PersonPinCircleIcon,
  Polyline as PolylineIcon,
  Navigation as NavigationIcon,
  OpenInFull as OpenInFullIcon,
  CloseFullscreen as CloseFullscreenIcon,
} from "@mui/icons-material";
import { IconButton, styled, Avatar } from "@mui/material";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { getFirstCoByRouteObj } from "../../utils/Utils";
import { companyColor } from "../../constants/Constants";
import { EtaContext } from "../../context/EtaContext";
import { mtrLineColor } from "../../constants/Mtr";
import { DbContext } from "../../context/DbContext";
import { useLocation } from "../../hooks/Location";
import stopIconPath from "../../assets/icons/stop.png";
import currentLocationIcon from "../../assets/icons/currentLocation.png";

export const Map = () => {
  const { routeKey, stopId } = useParams();
  const navigate = useNavigate();
  const { location: currentLocation } = useLocation();
  const { nearestStopId, mapStopIdx, mapLocation, updateMapStopIdx } =
    useContext(EtaContext);
  const { gRouteList, gStopList } = useContext(DbContext);
  const [navBtnType, setNavBtnType] = useState("normal");
  const [mapExpanded, setMapExpanded] = useState(false);
  const [map, setMap] = useState(null);

  const routeData = routeKey ? gRouteList[routeKey] : [];

  const isMtr = routeData.co[0] === "mtr";
  const isLrt = routeData.co[0] === "lightRail";
  const polylineColor = isMtr
    ? mtrLineColor["&." + routeData.route].color
    : isLrt
    ? mtrLineColor["&.L" + routeData.route].color
    : companyColor["." + getFirstCoByRouteObj(routeData)]?.color;

  const currRouteStopIdList = useMemo(
    () => routeData.stops && routeData.stops[getFirstCoByRouteObj(routeData)],
    [routeKey]
  );

  const nearestStopIdx = currRouteStopIdList?.indexOf(nearestStopId);

  const currRouteStopList = useMemo(
    () => currRouteStopIdList?.map((e) => gStopList[e]),
    [routeKey]
  );

  let location = {};

  if (!_.isEmpty(mapLocation)) {
    location = mapLocation;
  } else if (currRouteStopList && currRouteStopList[nearestStopIdx]) {
    location = currRouteStopList[nearestStopIdx].location;
  } else {
    location = { lat: 0, lng: 0 };
  }

  useEffect(() => {
    if (map && location) {
      map.panTo([location.lat, location.lng]);
    }
  }, [location]);

  const routeLine = currRouteStopList?.map((e) => [
    e.location.lat,
    e.location.lng,
  ]);

  useEffect(() => {
    setNavBtnType("normal");
  }, [stopId]);

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

  const CustomMarker = ({ stop, _stopId, i }) => {
    const stopIcon = useMemo(
      () =>
        new L.divIcon({
          html: `<div class="markerText" style="background: url(${stopIconPath}) no-repeat center; background-size: contain">${
            isMtr ? (i === mapStopIdx ? "★" : "") : i + 1
          }</div>`,
          iconAnchor: [10, 10],
          popupAnchor: [0, -10],
          className: `currStopMarker ${i === mapStopIdx ? "selected" : ""}`,
          iconSize: [20, 20],
        }),
      [i]
    );

    // const map = useMap();

    const eventHandlers = useMemo(
      () => ({
        click: () => {
          updateMapStopIdx(i);
          navigate("/search/" + routeKey + "/" + _stopId, {
            replace: true,
          });
          map.panTo([stop.location.lat, stop.location.lng], {
            animate: true,
            duration: 0.5,
          });
        },
      }),
      [i, _stopId, routeKey]
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

  const RouteBoundBtn = () => {
    // const map = useMap();

    const handleIconOnClick = () => {
      map.flyToBounds(routeLine, { duration: 1 });
      setNavBtnType("normal");
    };

    return (
      <Avatar className="polylineBtn">
        <IconButton onClick={handleIconOnClick}>
          <PolylineIcon />
        </IconButton>
      </Avatar>
    );
  };

  const NearestStopBtn = () => {
    // const map = useMap();

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
      <Avatar className="nearestStopBtn">
        <IconButton onClick={handleIconOnClick}>
          <PersonPinCircleIcon />
        </IconButton>
      </Avatar>
    );
  };

  const NavBtn = () => {
    map?.on("drag", () => {
      setNavBtnType("normal");
    });

    if (navBtnType === "navigation") {
      map?.panTo([currentLocation.lat, currentLocation.lng], {
        animate: true,
        duration: 0.5,
      });
    }

    const handleIconOnClick = () => {
      map?.flyTo([currentLocation.lat, currentLocation.lng], 18, {
        animate: true,
        duration: 0.5,
      });
      setNavBtnType("navigation");
    };

    return (
      <Avatar className={`navBtn ${navBtnType === "normal" && "normal"}`}>
        <IconButton onClick={handleIconOnClick}>
          <NavigationIcon />
        </IconButton>
      </Avatar>
    );
  };

  const SizeBtn = () => {
    const handleIconOnClick = () => {
      setMapExpanded(!mapExpanded);
    };

    return (
      <Avatar className="sizeBtn">
        <IconButton onClick={handleIconOnClick}>
          {mapExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
        </IconButton>
      </Avatar>
    );
  };

  const handleOnTransitionEnd = (e) => {
    if (e.propertyName === "height" && map && mapLocation) {
      // Re-render the map as the height as been changed
      map.invalidateSize();
    }
  };

  return (
    <MapRoot
      mapExpanded={mapExpanded}
      onTransitionEnd={(e) => handleOnTransitionEnd(e)}
    >
      <MapContainerRoot
        center={[location.lat, location.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        ref={setMap}
        whenCreated={setMap} // Store map instance
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {routeData.stops &&
          currRouteStopIdList?.map((e, i) => {
            const stop = gStopList[e];
            return <CustomMarker stop={stop} _stopId={e} key={i} i={i} />;
          })}

        <Marker
          position={[currentLocation.lat, currentLocation.lng]}
          icon={currLocationIcon}
        />

        <Polyline
          pathOptions={{
            color: polylineColor,
            opacity: "0.75",
          }}
          positions={routeLine}
        />

        <RouteBoundBtn />
        <NearestStopBtn />
        <NavBtn />
        <SizeBtn />
      </MapContainerRoot>
    </MapRoot>
  );
};

const MapRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "mapExpanded",
})(({ mapExpanded }) => ({
  height: mapExpanded ? "50vh" : "25vh",
  transition: "height 0.3s ease",
  zIndex: 0,
}));

const MapContainerRoot = styled(MapContainer)({
  width: "100%",
  ".leaflet-control-container": {
    ".leaflet-top, .leaflet-bottom": {
      willChange: "transform",
      transform: "translate3d(0px, 0px, 0px)",
    },
  },
  ".leaflet-map-pane": {
    ".leaflet-overlay-pane": {
      ...companyColor,
      ".route": {
        ...mtrLineColor,
      },
    },
    ".leaflet-marker-pane": {
      ".currStopMarker": {
        color: "black",
        fontWeight: "bold",
        fontSize: "11px",
        "&.selected": {
          color: "red",
          zIndex: "300 !important",
        },
        ".markerText": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "20px",
          height: "20px",
        },
      },
      ".currLocationMarker": {
        border: "none",
        background: "none",
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
  },
  ".polylineBtn": {
    right: "110px",
    bottom: "20px",
  },
  ".nearestStopBtn": {
    right: "60px",
    bottom: "20px",
  },
  ".navBtn": {
    right: "10px",
    bottom: "20px",
    ".normal button": {
      color: "#777777",
    },
  },
  ".sizeBtn": {
    right: "10px",
    top: "10px",
    "&.normal button": {
      color: "#777777",
    },
  },
});
