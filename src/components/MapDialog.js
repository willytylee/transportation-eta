import { useContext, useMemo, useState } from "react";
import L from "leaflet";
import {
  Close as CloseIcon,
  MyLocation as MyLocationIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  PersonPinCircle as PersonPinCircleIcon,
  Route as RouteIcon,
} from "@mui/icons-material";
import {
  DialogTitle,
  Grid,
  IconButton,
  Dialog,
  styled,
  Avatar,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import { AppContext } from "../context/AppContext";
import {
  etaTimeConverter,
  getCoByStopObj,
  getLocalStorage,
  parseMtrEtas,
} from "../Utils";
import { companyMap, companyColor } from "../constants/Constants";
import { useEtas } from "../hooks/Etas";
import { useCorrectBound } from "../hooks/Bound";
import { EtaContext } from "../context/EtaContext";
import { stationMap } from "../constants/Mtr";

export const MapDialog = ({
  mapDialogOpen,
  handleMapDialogOnClose,
  fullWidth,
}) => {
  const { dbVersion, location: currentLocation } = useContext(AppContext);
  const { currRoute, nearestStopId } = useContext(EtaContext);
  const [selectedStopIdx, setSelectedStopIdx] = useState(-1);
  const [navBtnType, setNavBtnType] = useState("myLocation");
  const { correctBound, isBoundLoading } = useCorrectBound({ currRoute });
  const { eta, isEtaLoading } = useEtas({
    seq: selectedStopIdx + 1,
    routeObj: currRoute,
    bound: correctBound,
    isBoundLoading,
  });

  const handleDialogOnClose = () => {
    setSelectedStopIdx(-1);
    handleMapDialogOnClose();
  };

  const gStopList = useMemo(() => getLocalStorage("stopList"), [dbVersion]);

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

  const PrevStopBtn = () => {
    const map = useMap();

    const handleIconOnClick = () => {
      const idx = selectedStopIdx === -1 ? nearestStopIdx + 1 : selectedStopIdx;
      const prevStop = currRouteStopList[idx - 1];
      map.flyTo([prevStop.location.lat, prevStop.location.lng], 18);
      setSelectedStopIdx(idx - 1);
    };

    return (
      <Avatar
        className={`prevBtnAvatar ${selectedStopIdx === 0 ? "disabled" : ""}`}
      >
        <IconButton
          disabled={selectedStopIdx === 0}
          onClick={handleIconOnClick}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Avatar>
    );
  };

  const NextStopBtn = () => {
    const map = useMap();

    const handleIconOnClick = () => {
      const idx = selectedStopIdx === -1 ? nearestStopIdx - 1 : selectedStopIdx;
      const nextStop = currRouteStopList[idx + 1];
      map.flyTo([nextStop.location.lat, nextStop.location.lng], 18);
      setSelectedStopIdx(idx + 1);
    };

    return (
      <Avatar
        className={`nextBtnAvatar ${
          selectedStopIdx === currRouteStopIdList.length - 1 ? "disabled" : ""
        }`}
      >
        <IconButton
          disabled={selectedStopIdx === currRouteStopIdList.length - 1}
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
    };

    return (
      <Avatar
        className={`routeBoundBtnAvatar ${
          selectedStopIdx === 0 ? "disabled" : ""
        }`}
      >
        <IconButton
          disabled={selectedStopIdx === 0}
          onClick={handleIconOnClick}
        >
          <RouteIcon />
        </IconButton>
      </Avatar>
    );
  };

  const NavBtn = () => {
    const map = useMap();

    map.on("drag", () => {
      setNavBtnType("normal");
    });

    map.on("unload", () => {
      setNavBtnType("myLocation");
    });

    if (navBtnType === "myLocation") {
      const handleIconOnClick = () => {
        const nearestStop = currRouteStopList[nearestStopIdx];
        map.flyTo([nearestStop.location.lat, nearestStop.location.lng], 18);
        setSelectedStopIdx(nearestStopIdx);
        setNavBtnType("nearestStop");
      };

      return (
        <Avatar className="navBtnAvatar">
          <IconButton onClick={handleIconOnClick}>
            <MyLocationIcon />
          </IconButton>
        </Avatar>
      );
    } else if (navBtnType === "nearestStop") {
      const handleIconOnClick = () => {
        map.flyTo([currentLocation.lat, currentLocation.lng], 18);
        setNavBtnType("myLocation");
      };

      return (
        <Avatar className="nearestStopBtnAvatar">
          <IconButton onClick={handleIconOnClick}>
            <PersonPinCircleIcon />
          </IconButton>
        </Avatar>
      );
    }
    const handleIconOnClick = () => {
      map.flyTo([currentLocation.lat, currentLocation.lng], 18);
      setNavBtnType("myLocation");
    };

    return (
      <Avatar className="navBtnAvatar normal">
        <IconButton onClick={handleIconOnClick}>
          <MyLocationIcon />
        </IconButton>
      </Avatar>
    );
  };

  return (
    <DialogRoot
      onClose={handleDialogOnClose}
      open={mapDialogOpen}
      fullWidth={fullWidth}
      className="dialogRoot"
    >
      {Object.keys(currRoute).length !== 0 && (
        <>
          <DialogTitle className="dialogTitle">
            <Grid>
              <div className="headerWrapper">
                <div className="coRoute">
                  {getCoByStopObj(currRoute)
                    .map((e, i) => {
                      return (
                        <span key={i}>
                          <span className={e}>
                            {companyMap[e]}
                            <span className={`${currRoute.route}`}>
                              {" "}
                              {stationMap[currRoute.route]}
                            </span>
                          </span>
                        </span>
                      );
                    })
                    .reduce((a, b) => [a, " + ", b])}{" "}
                </div>
                <div className="destSpecial">
                  {currRoute.orig?.zh} →{" "}
                  <span className="dest">{currRoute.dest?.zh}</span>{" "}
                  <span className="special">
                    {" "}
                    {parseInt(currRoute.serviceType, 10) !== 1 && "特別班次"}
                  </span>
                </div>
                {selectedStopIdx !== -1 && (
                  <div className="stopDetail">
                    <div className="stopName">
                      {selectedStopIdx + 1}.{" "}
                      {currRouteStopList[selectedStopIdx]?.name.zh}
                    </div>
                    <div className="etas">
                      {isEtaLoading || isBoundLoading ? (
                        <div className="eta">載入中</div>
                      ) : eta.length !== 0 ? (
                        eta.map((e, i) =>
                          e.co === "mtr" ? (
                            <div key={i} className="eta" title={e.seq}>
                              {parseMtrEtas(e)}
                            </div>
                          ) : (
                            <div key={i} className="eta" title={e.seq}>
                              {etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr}
                            </div>
                          )
                        )
                      ) : (
                        <div>沒有班次</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <IconButton className="closeBtn" onClick={handleDialogOnClose}>
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
              currRouteStopIdList.map((e, i) => {
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
            ></Marker>

            <Polyline
              pathOptions={{ color: "#2f305c", opacity: 0.3 }}
              positions={routeLine}
            />

            <PrevStopBtn />
            <NextStopBtn />
            <RouteBoundBtn />
            <NavBtn />
            {/* <NearestStopBtn />
            <NavigationBtn /> */}
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
      padding: "4px 8px",
      ".MuiGrid-root": {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        fontSize: "14px",
        ".closeBtn": {
          position: "absolute",
          right: 0,
        },
        ".headerWrapper": {
          width: "100%",
          ".coRoute": {
            ...companyColor,
            ".route": {
              fontWeight: "900",
            },
          },
          ".destSpecial": {
            ".dest": {
              fontWeight: 900,
            },
            ".special": {
              fontSize: "12px",
            },
          },
          ".stopDetail": {
            display: "flex",
            width: "100%",
            alignItem: "center",
            ".etas": {
              display: "inline-flex",
              flexWrap: "wrap",
              gap: "12px",
              flexGrow: "1",
              justifyContent: "flex-end",
            },
          },
        },
      },
    },
    ".mapContainer": {
      height: "100%",
      ".leaflet-control-container": {
        ".leaflet-top, .leaflet-bottom": {
          willChange: "transform",
          transform: "translate3d(0px, 0px, 0px)",
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
        "&.navBtnAvatar, &.nearestStopBtnAvatar": {
          right: "10px",
          bottom: "40px",
          "&.normal button": {
            color: "#777777",
          },
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
          bottom: "90px",
        },
      },
      ".currLocationMarker": {
        border: "none",
        background: "none",
      },
    },
  },
});
