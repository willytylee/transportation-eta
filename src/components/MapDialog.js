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
import { getCoByStopObj, getLocalStorage } from "../Utils";
import { companyMap, companyColor } from "../constants/Constants";
import { useEtas } from "../hooks/Etas";
import { useCorrectBound } from "../hooks/Bound";
import { EtaContext } from "../context/EtaContext";
import { etaExcluded, routeMap } from "../constants/Mtr";
import { StopEta } from "./Search/StopEta";
import { MtrStopEta } from "./Search/MtrStopEta";

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

  const CustomMarker = ({ currStop, i }) => {
    const map = useMap();

    const eventHandlers = useMemo(
      () => ({
        click: () => {
          setSelectedStopIdx(i);
          map.flyTo([currStop.location.lat, currStop.location.lng], 16, {
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
      const idx = selectedStopIdx === -1 ? nearestStopIdx + 1 : selectedStopIdx;
      const prevStop = currRouteStopList[idx - 1];
      map.flyTo([prevStop.location.lat, prevStop.location.lng], 16, {
        animate: true,
        duration: 0.5,
      });
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
      map.flyTo([nextStop.location.lat, nextStop.location.lng], 16, {
        animate: true,
        duration: 0.5,
      });
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
        map.flyTo([nearestStop.location.lat, nearestStop.location.lng], 16, {
          animate: true,
          duration: 0.5,
        });
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
        map.flyTo([currentLocation.lat, currentLocation.lng], 18, {
          animate: true,
          duration: 0.5,
        });
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
      map.flyTo([currentLocation.lat, currentLocation.lng], 18, {
        animate: true,
        duration: 0.5,
      });
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
                              {routeMap[currRoute.route]}
                            </span>
                          </span>
                        </span>
                      );
                    })
                    .reduce((a, b) => [a, " + ", b])}{" "}
                </div>
                <div className="destSpecial">
                  {currRoute.orig?.zh}{" "}
                  {currRoute.co[0] === "mtr" ? (
                    <> ←→ {currRoute.dest?.zh}</>
                  ) : (
                    <>
                      → <span className="dest">{currRoute.dest?.zh}</span>
                    </>
                  )}
                  {etaExcluded.includes(currRoute.route) && (
                    <span className="star">沒有相關班次資料</span>
                  )}
                  <span className="special">
                    {" "}
                    {parseInt(currRoute.serviceType, 10) !== 1 && "特別班次"}
                  </span>
                </div>
                {selectedStopIdx !== -1 &&
                  (currRoute.co[0] === "mtr" ? (
                    <div className="mtrStopEtaWrapper">
                      <div className="seq">{selectedStopIdx + 1}.</div>
                      <div className="stop">
                        {currRouteStopList[selectedStopIdx]?.name.zh}
                      </div>
                      {etaExcluded.includes(currRoute.route) ? (
                        <div className="noEta">沒有相關班次資料</div>
                      ) : (
                        <MtrStopEta
                          seq={selectedStopIdx + 1}
                          routeObj={currRoute}
                          stopObj={currRouteStopList[selectedStopIdx]}
                          MtrStopEtaRoot={MtrStopEtaRoot}
                        />
                      )}
                    </div>
                  ) : (
                    <StopEta
                      seq={selectedStopIdx + 1}
                      routeObj={currRoute}
                      stopObj={currRouteStopList[selectedStopIdx]}
                      bound={correctBound}
                      isBoundLoading={isBoundLoading}
                      StopEtaRoot={StopEtaRoot}
                    />
                  ))}
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
              letterSpacing: "-0.5px",
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
          ".mtrStopEtaWrapper": {
            display: "flex",
            width: "100%",
            alignItems: "center",
            margin: 0,
            ".seq": {
              width: "5%",
            },
            ".stop": {
              paddingRight: "8px",
            },
            ".noEta": {
              textAlign: "center",
              width: "80%",
              padding: "4px 0",
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

const MtrStopEtaRoot = styled("div")({
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  ".etaWrapper": {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    ".arriveText": {
      width: "25%",
    },
    ".ttntWrapper": {
      width: "65%",
      display: "flex",
      flexDirection: "row",
      ".ttnt": {
        width: "33.33%",
      },
    },
  },
});

const StopEtaRoot = styled("div")({
  display: "flex",
  padding: "4px 0",
  width: "100%",
  ".seq": {
    width: "8%",
  },
  ".stop": {
    display: "flex",
    flexGrow: "1",
  },
  ".etas": {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    ".eta": {
      width: "33.33%",
    },
  },
});
