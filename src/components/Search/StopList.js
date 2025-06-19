/* eslint-disable no-unused-vars  */
import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails, styled, IconButton } from "@mui/material";
import { Directions as DirectionsIcon, Map as MapIcon, BookmarkAdd as BookmarkAddIcon, Streetview as StreetviewIcon } from "@mui/icons-material";
import { getPreciseDistance } from "geolib";
import { getCoPriorityId } from "../../Utils/Utils";
import { EtaContext } from "../../context/EtaContext";
import { MapDialog } from "../MapDialog/MapDialog";
import { DbContext } from "../../context/DbContext";
import { primaryColor } from "../../constants/Constants";
import { useLocation } from "../../hooks/Location";
import { etaExcluded } from "../../constants/Mtr";
import { MtrStopEta } from "./MtrStopEta";
import { StopEta } from "./StopEta";
import { BookmarkDialog } from "./BookmarkDialog";
import { MtrRouteOptionDialog } from "./MtrRouteOptionDialog";

export const StopList = () => {
  const { routeKey, stopId } = useParams();
  const navigate = useNavigate();
  const { gStopList, gRouteList } = useContext(DbContext);
  const { location: currentLocation } = useLocation({ interval: 60000 });
  const [stopList, setStopList] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [mtrRouteOptionDialogOpen, setMtrRouteOptionDialogOpen] = useState(false);
  const [bookmarkDialogMode, setBookmarkDialogMode] = useState(null);
  const [bookmarkRouteObj, setBookmarkRouteObj] = useState({});
  const { nearestStopId, updateNearestStopId, updateMapLocation, updateMapStopIdx } = useContext(EtaContext);

  const stopListRef = useRef(null);

  const handleMapDialogOnClose = () => {
    setMapDialogOpen(false);
  };

  const handleMapIconOnClick = ({ mapLocation, mapStopIdx }) => {
    setMapDialogOpen(true);
    updateMapLocation(mapLocation);
    updateMapStopIdx(mapStopIdx);
  };

  const handleBookmarkAddIconOnClick = (routeObj) => {
    setBookmarkRouteObj(routeObj);
    if (routeObj.co === "mtr") {
      setMtrRouteOptionDialogOpen(true);
    } else {
      setBookmarkDialogMode("category");
    }
  };

  const handleChange = (_stopId) => (e, isExpanded) => {
    navigate("/search/" + routeKey, { replace: true });
    setExpanded(isExpanded ? _stopId : false);
  };

  const _currRoute = gRouteList[routeKey];

  const handleEtaCallback = (i, response) => {
    // TODO
  };

  // When the currRoute in AppContext changed
  useEffect(() => {
    if (routeKey) {
      // Find the company Id which appear in currRoute.stops

      const companyId = getCoPriorityId(_currRoute);
      const expandStopIdArr = _currRoute.stops[companyId];

      setStopList(expandStopIdArr.map((e) => ({ ...gStopList[e], stopId: e })));

      if (currentLocation.lat !== 0 && currentLocation.lng !== 0) {
        updateNearestStopId(
          expandStopIdArr.reduce((prev, curr) => {
            const prevDistance = getPreciseDistance(
              {
                latitude: gStopList[prev].location.lat,
                longitude: gStopList[prev].location.lng,
              },
              {
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
              }
            );
            const currDistance = getPreciseDistance(
              {
                latitude: gStopList[curr].location.lat,
                longitude: gStopList[curr].location.lng,
              },
              {
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
              }
            );

            if (prevDistance < currDistance) {
              return prev;
            }
            return curr;
          })
        );
      } else {
        updateNearestStopId("");
      }
    }
  }, [routeKey, currentLocation.lat, currentLocation.lng]);

  useEffect(() => {
    if (stopList.length > 0) {
      stopListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [stopList]);

  return (
    <>
      <StopListRoot>
        {routeKey &&
          stopList?.map((e, i) => {
            const isNearestStop = gStopList[nearestStopId]?.name === e.name && currentLocation.lat !== -1 && currentLocation.lng !== -1;
            const {
              location: { lat, lng },
            } = e;
            return (
              <Accordion
                expanded={stopId ? stopId === e.stopId : expanded === e.stopId}
                onChange={handleChange(e.stopId)}
                key={i}
                className={isNearestStop ? "highlighted" : ""}
                ref={isNearestStop ? stopListRef : null}
              >
                <AccordionSummary className="accordionSummary">
                  {_currRoute.co[0] === "mtr" ? (
                    <MtrStopEta seq={i + 1} routeObj={_currRoute} stopObj={e} MtrStopEtaRoot={MtrStopEtaRoot} />
                  ) : (
                    <StopEta
                      seq={i + 1}
                      routeObj={_currRoute}
                      stopObj={e}
                      StopEtaRoot={StopEtaRoot}
                      callback={(response) => {
                        handleEtaCallback(i, response);
                      }}
                    />
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <IconButton
                    className="iconBtn mapIconBtn"
                    onClick={() =>
                      handleMapIconOnClick({
                        mapLocation: { lat, lng },
                        mapStopIdx: i,
                      })
                    }
                  >
                    <MapIcon />
                    <div>地圖</div>
                  </IconButton>
                  <IconButton
                    className="iconBtn"
                    component="a"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`}
                    target="_blank"
                  >
                    <DirectionsIcon />
                    <div>規劃路線</div>
                  </IconButton>
                  <IconButton
                    className="iconBtn"
                    component="a"
                    href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=0&pitch=0&fov=160`}
                    target="_blank"
                  >
                    <StreetviewIcon />
                    <div>街景</div>
                  </IconButton>
                  {!etaExcluded.includes(_currRoute.route) && (
                    <IconButton
                      className="iconBtn"
                      onClick={() => {
                        if (_currRoute.co[0] === "gmb") {
                          handleBookmarkAddIconOnClick({
                            seq: i + 1,
                            co: "gmb",
                            route: _currRoute.route,
                            stopId: e.stopId,
                            gtfsId: _currRoute.gtfsId,
                          });
                        } else if (_currRoute.co[0] === "mtr") {
                          handleBookmarkAddIconOnClick({
                            co: "mtr", // use _currRoute.stops' company as standard
                            route: _currRoute.route,
                            stopId: e.stopId,
                          });
                        } else {
                          handleBookmarkAddIconOnClick({
                            seq: i + 1,
                            co: getCoPriorityId(_currRoute), // use _currRoute.stops' company as standard
                            route: _currRoute.route,
                            stopId: e.stopId,
                            dest: _currRoute.dest.zh,
                            routeKey,
                          });
                        }
                      }}
                    >
                      <BookmarkAddIcon />
                      <div>書籤</div>
                    </IconButton>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
      </StopListRoot>
      <MapDialog mapDialogOpen={mapDialogOpen} handleMapDialogOnClose={handleMapDialogOnClose} />
      <BookmarkDialog bookmarkDialogMode={bookmarkDialogMode} setBookmarkDialogMode={setBookmarkDialogMode} bookmarkRouteObj={bookmarkRouteObj} />
      <MtrRouteOptionDialog
        mtrRouteOptionDialogOpen={mtrRouteOptionDialogOpen}
        setBookmarkDialogMode={setBookmarkDialogMode}
        bookmarkRouteObj={bookmarkRouteObj}
        setBookmarkRouteObj={setBookmarkRouteObj}
        setMtrRouteOptionDialogOpen={setMtrRouteOptionDialogOpen}
      />
    </>
  );
};

const StopListRoot = styled("div")({
  width: "100%",
  ".MuiPaper-root": {
    "&:before": {
      backgroundColor: "unset",
    },
    "&.Mui-expanded": {
      backgroundColor: `${primaryColor}17`,
      padding: "4px 6px 0px",
    },
    "&.highlighted": { backgroundColor: "lightblue" },
    padding: "0 6px",
    borderBottom: "0.1px solid #eaeaea",
    margin: "0 !important",
    boxShadow: "unset",
    ".accordionSummary": {
      minHeight: "unset",
      padding: "0",
      ".MuiAccordionSummary-content": {
        margin: 0,
      },
    },
    ".MuiCollapse-root": {
      ".MuiAccordionDetails-root": {
        padding: "0px 16px 0px 5%",
        display: "flex",
        ".mapIconBtn": {
          marginLeft: "-8px",
        },
        ".iconBtn": {
          flexDirection: "column",
          fontSize: "10px",
          height: "58px",
          width: "58px",
        },
      },
    },
  },
});

const MtrStopEtaRoot = styled("div")({
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  alignItems: "center",
  ".seq": {
    width: "25px",
  },
  ".stop": {
    width: "50px",
  },
  ".noEta": {
    textAlign: "center",
    width: "80%",
    padding: "4px 0",
  },
  ".noEta2": {
    width: "55%",
  },
  ".etasWrapper": {
    width: "100%",
    ".etaWrapper": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: "4px 0",
      ".arriveText": {
        width: "80px",
        ".dest": {
          paddingLeft: "4px",
        },
      },
      ".ttntWrapper": {
        width: "55%",
        display: "flex",
        flexDirection: "row",
        ".ttnt": {
          width: "33.33%",
          fontSize: "12px",
        },
      },
    },
  },
});

const StopEtaRoot = styled("div")({
  display: "flex",
  padding: "4px 0",
  width: "100%",
  alignItems: "center",
  ".seq": {
    width: "5%",
  },
  ".stop": {
    width: "50%",
  },
  ".etas": {
    width: "40%",
    display: "flex",
    flexDirection: "row",
    div: {
      width: "33.33%",
    },
  },
});
/* eslint-disable no-unused-vars  */
