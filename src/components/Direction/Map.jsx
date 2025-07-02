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
import { getFirstCoByRouteObj } from "../../Utils/Utils";
import { companyColor } from "../../constants/Constants";
import { mtrLineColor } from "../../constants/Mtr";
import { DbContext } from "../../context/DbContext";
import { useLocation } from "../../hooks/Location";
import { Eta } from "../Search/RouteList/Eta";
import { DirectionContext } from "../../context/DirectionContext";
import currLocationIconPath from "../../assets/icons/currentLocation.png";
import stopIconPath from "../../assets/icons/stop.png";
import startIconPath from "../../assets/icons/start.png";
import endIconPath from "../../assets/icons/end.png";
import transitIconPath from "../../assets/icons/transit.png";

export const Map = ({ mapCollapse }) => {
  const {
    currRoute,
    origin,
    destination,
    expanded,
    fitBoundMode,
    updateFitBoundMode,
  } = useContext(DirectionContext);

  const { gStopList } = useContext(DbContext);
  const { location: currentLocation } = useLocation({ interval: 60000 });
  const [navBtnType, setNavBtnType] = useState("normal");
  const [map, setMap] = useState(null);

  const { routeObj: origRouteObj, stopSeq: origStopSeq } =
    currRoute.origin || {};

  const { routeObj: destRouteObj, stopSeq: destStopSeq } =
    currRoute.destination || {};

  const {
    stopSeqOrig: commonStopSeqOrig,
    stopSeqDest: commonStopSeqDest,
    stopId: commonStopId,
  } = currRoute.common || {};

  const startLocation = origin?.location;
  const endLocation = destination?.location;
  const commonLocation = gStopList[commonStopId]?.location;

  const isMultiRoute =
    !!currRoute && currRoute.common && Object.keys(currRoute.common).length > 0;

  const currRouteAStopIdList = useMemo(() => {
    const endSeq = isMultiRoute ? commonStopSeqOrig : destStopSeq;
    return (
      origRouteObj?.stops &&
      origRouteObj?.stops[getFirstCoByRouteObj(origRouteObj)].slice(
        origStopSeq - 1,
        endSeq
      )
    );
  }, [origRouteObj, origStopSeq, commonStopSeqOrig, destStopSeq]);

  const currRouteAStopList = useMemo(
    () => currRouteAStopIdList?.map((e) => gStopList[e]),
    [currRouteAStopIdList]
  );

  const routeALine = useMemo(
    () => currRouteAStopList?.map((e) => [e.location.lat, e.location.lng]),
    [currRouteAStopList]
  );

  // ==============================

  const currRouteBStopIdList = useMemo(
    () =>
      destRouteObj?.stops &&
      destRouteObj?.stops[getFirstCoByRouteObj(destRouteObj)].slice(
        commonStopSeqDest - 1,
        destStopSeq
      ),
    [destRouteObj, commonStopSeqDest, destStopSeq]
  );

  const currRouteBStopList = useMemo(
    () => currRouteBStopIdList?.map((e) => gStopList[e]),
    [currRouteBStopIdList]
  );

  const routeBLine = useMemo(
    () => currRouteBStopList?.map((e) => [e.location.lat, e.location.lng]),
    [currRouteBStopList]
  );

  // ===============================

  const routeLineWithStartEnd = useMemo(() => {
    if (map && routeALine && startLocation && endLocation) {
      if (isMultiRoute && routeBLine) {
        return [
          [startLocation.lat, startLocation.lng],
          ...routeALine,
          ...routeBLine,
          [endLocation.lat, endLocation.lng],
        ];
      } 
        return [
          [startLocation.lat, startLocation.lng],
          ...routeALine,
          [endLocation.lat, endLocation.lng],
        ];
      
    }
  }, [routeALine, routeBLine, startLocation, endLocation]);

  const startWalkLine = useMemo(
    () =>
      map &&
      routeALine &&
      startLocation && [[startLocation.lat, startLocation.lng], routeALine[0]],
    [routeALine, startLocation]
  );

  const endWalkLine = useMemo(
    () =>
      map &&
      routeBLine &&
      endLocation && [
        routeBLine[routeBLine.length - 1],
        [endLocation.lat, endLocation.lng],
      ],
    [routeBLine, endLocation]
  );

  useEffect(() => {
    if (map && routeLineWithStartEnd) {
      map.fitBounds(routeLineWithStartEnd);
    }
  }, [origRouteObj, destRouteObj]);

  useEffect(() => {
    if (
      map &&
      startLocation &&
      startLocation.lat !== 0 &&
      startLocation.lng !== 0 &&
      endLocation
    ) {
      map.fitBounds([
        [startLocation.lat, startLocation.lng],
        [endLocation.lat, endLocation.lng],
      ]);
    }
  }, [startLocation, destination]);

  useEffect(() => {
    if (map) {
      if (fitBoundMode === "startWalk" && startWalkLine) {
        map.flyToBounds(startWalkLine, { duration: 1, padding: [15, 15] });
        setTimeout(() => {
          updateFitBoundMode("");
        }, 1500);
      }
      if (fitBoundMode === "endWalk" && endWalkLine) {
        map.flyToBounds(endWalkLine, { duration: 1, padding: [15, 15] });
        setTimeout(() => {
          updateFitBoundMode("");
        }, 1500);
      }
    }
  }, [fitBoundMode]);

  const currLocationIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: currLocationIconPath,
        iconRetinaUrl: currLocationIconPath,
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(20, 20),
      }),
    []
  );

  const startIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: startIconPath,
        iconRetinaUrl: startIconPath,
        iconAnchor: null,
        popupAnchor: [0, 0],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(15, 15),
      }),
    []
  );

  const endIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: endIconPath,
        iconRetinaUrl: endIconPath,
        iconAnchor: null,
        popupAnchor: [0, 0],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(15, 15),
      }),
    []
  );

  const transitIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: transitIconPath,
        iconRetinaUrl: transitIconPath,
        iconAnchor: null,
        popupAnchor: [0, 0],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(15, 15),
        className: "transitMarker",
      }),
    []
  );

  const CustomMarker = ({
    stop,
    i,
    routeObj,
    currRouteStopIdList,
    currRouteStopList,
  }) => {
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

    const stopList = routeObj.stops[getFirstCoByRouteObj(routeObj)];
    const stopId = currRouteStopIdList[i];
    const stopIdx = stopList.findIndex((e) => e === stopId);

    return (
      <Marker
        key={i}
        position={[stop.location.lat, stop.location.lng]}
        icon={stopIcon}
      >
        <Popup>
          <div className="title">{currRouteStopList[i].name.zh}</div>
          <div className="eta">
            <Eta seq={stopIdx + 1} routeObj={routeObj} slice={3} />
          </div>
        </Popup>
      </Marker>
    );
  };

  const RouteBoundBtn = () => {
    const _map = useMap();

    const handleIconOnClick = () => {
      if (routeLineWithStartEnd) {
        _map.flyToBounds(routeLineWithStartEnd, {
          duration: 1,
          padding: [15, 15],
        });
        setNavBtnType("normal");
      }
    };

    return (
      <Avatar className="routeBoundBtnAvatar">
        <IconButton onClick={handleIconOnClick}>
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
    <MapRoot mapCollapse={mapCollapse}>
      <MapContainerRoot
        center={[22.382263, 114.11465]}
        zoom={9}
        ref={setMap}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        whenCreated={setMap} // Store map instance
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {startLocation &&
          startLocation.lat !== 0 &&
          startLocation.lng !== 0 && (
            /* Start Point Marker */
            <Marker
              position={[startLocation.lat, startLocation.lng]}
              icon={startIcon}
            >
              <Popup>{origin.label}</Popup>
            </Marker>
          )}
        {destination && (
          <>
            {/* End Point Marker */}
            <Marker
              position={[endLocation.lat, endLocation.lng]}
              icon={endIcon}
            >
              <Popup>{destination.label}</Popup>
            </Marker>
          </>
        )}
        {isMultiRoute && (
          <>
            {/* Common Point Marker */}
            <Marker
              position={[commonLocation.lat, commonLocation.lng]}
              icon={transitIcon}
             />
          </>
        )}
        {startLocation &&
          destination &&
          origRouteObj?.stops &&
          // destRouteObj?.stops &&
          expanded && (
            <>
              {/* Transport A Stop Marker */}
              {currRouteAStopIdList.map((e, i) => {
                const stop = gStopList[e];
                return (
                  <CustomMarker
                    stop={stop}
                    key={i}
                    i={i}
                    routeObj={origRouteObj}
                    currRouteStopIdList={currRouteAStopIdList}
                    currRouteStopList={currRouteAStopList}
                  />
                );
              })}

              {/* Transport B Stop Marker */}
              {isMultiRoute &&
                currRouteBStopIdList.map((e, i) => {
                  const stop = gStopList[e];
                  return (
                    <CustomMarker
                      stop={stop}
                      key={i}
                      i={i}
                      routeObj={destRouteObj}
                      currRouteStopIdList={currRouteBStopIdList}
                      currRouteStopList={currRouteBStopList}
                    />
                  );
                })}

              {/* Line of Transport A*/}
              <Polyline
                pathOptions={{
                  color: `${
                    origRouteObj.co[0] === "mtr"
                      ? mtrLineColor["." + origRouteObj.route].color
                      : companyColor["." + getFirstCoByRouteObj(origRouteObj)]
                          .color
                  }`,
                  opacity: "0.75",
                }}
                positions={routeALine}
              />

              {/* Line of Transport B*/}
              {isMultiRoute && (
                <Polyline
                  pathOptions={{
                    color: `${
                      destRouteObj.co[0] === "mtr"
                        ? mtrLineColor["." + destRouteObj.route].color
                        : companyColor["." + getFirstCoByRouteObj(destRouteObj)]
                            .color
                    }`,
                    opacity: "0.75",
                  }}
                  positions={routeBLine}
                />
              )}

              {/* Line of Start Point to First Transport Stop */}
              <Polyline
                pathOptions={{
                  color: "grey",
                  opacity: "0.75",
                }}
                positions={[
                  [startLocation.lat, startLocation.lng],
                  [
                    currRouteAStopList[0].location.lat,
                    currRouteAStopList[0].location.lng,
                  ],
                ]}
              />
              {/* Line of End Point to Last Transport Stop */}

              {isMultiRoute ? (
                <Polyline
                  pathOptions={{
                    color: "grey",
                    opacity: "0.75",
                  }}
                  positions={[
                    [endLocation.lat, endLocation.lng],
                    [
                      currRouteBStopList[currRouteBStopList.length - 1].location
                        .lat,
                      currRouteBStopList[currRouteBStopList.length - 1].location
                        .lng,
                    ],
                  ]}
                />
              ) : (
                <Polyline
                  pathOptions={{
                    color: "grey",
                    opacity: "0.75",
                  }}
                  positions={[
                    [endLocation.lat, endLocation.lng],
                    [
                      currRouteAStopList[currRouteAStopList.length - 1].location
                        .lat,
                      currRouteAStopList[currRouteAStopList.length - 1].location
                        .lng,
                    ],
                  ]}
                />
              )}
            </>
          )}
        {
          /* Current Location Marker */
          currentLocation.lat !== 0 && currentLocation.lng !== 0 && (
            <Marker
              position={[currentLocation.lat, currentLocation.lng]}
              icon={currLocationIcon}
            />
          )
        }
        <RouteBoundBtn />
        <NavBtn />
      </MapContainerRoot>
    </MapRoot>
  );
};

const MapRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "mapCollapse",
})(({ mapCollapse }) => ({
  flex: mapCollapse ? 1 : 4,
  transition: "flex 0.3s ease",
  zIndex: 0,
}));

const MapContainerRoot = styled(MapContainer)({
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
    ".leaflet-marker-pane": {
      ".transitMarker": {
        zIndex: "9999 !important",
      },
    },
    ".leaflet-popup-pane": {
      ".title": {
        fontWeight: 900,
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
});
