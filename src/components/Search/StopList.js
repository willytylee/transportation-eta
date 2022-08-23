import { useState, useEffect, useContext, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  IconButton,
} from "@mui/material";
import {
  Directions as DirectionsIcon,
  Map as MapIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { getPreciseDistance } from "geolib";
import { getCoPriorityId } from "../../Utils";
import { AppContext } from "../../context/AppContext";
import { useCorrectBound } from "../../hooks/Bound";
import { EtaContext } from "../../context/EtaContext";
import { MapDialog } from "../MapDialog/MapDialog";
import { DbContext } from "../../context/DbContext";
import { primaryColor } from "../../constants/Constants";
import { MtrStopEta } from "./MtrStopEta";
import { StopEta } from "./StopEta";
import { BookmarkDialog } from "./BookmarkDialog";

export const StopList = () => {
  const [stopList, setStopList] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const { location: currentLocation } = useContext(AppContext);
  const { gStopList } = useContext(DbContext);
  const {
    route,
    currRoute,
    nearestStopId,
    updateNearestStopId,
    updateMapLocation,
    updateMapStopIdx,
  } = useContext(EtaContext);

  const { correctBound, isBoundLoading } = useCorrectBound({
    routeObj: currRoute,
  });
  const stopListRef = useRef(null);

  const handleMapDialogOnClose = () => {
    setMapDialogOpen(false);
  };

  const handleMapIconOnClick = ({ mapLocation, mapStopIdx }) => {
    setMapDialogOpen(true);
    updateMapLocation(mapLocation);
    updateMapStopIdx(mapStopIdx);
  };

  const handleFavIconOnClick = (routeObj) => {
<<<<<<< HEAD
    setBookmarkDialogOpen(true);
    // console.log(routeObj);
=======
    console.log(routeObj);
>>>>>>> 2292fdd... get routeObj
  };

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // When the route number is changed
  useEffect(() => {
    setStopList([]);
  }, [route]);

  // When the currRoute in AppContext changed
  useEffect(() => {
    if (Object.keys(currRoute).length !== 0) {
      // Find the company Id which appear in currRoute.stops

      const companyId = getCoPriorityId(currRoute);
      const expandStopIdArr = currRoute.stops[companyId];

      setStopList(expandStopIdArr.map((e) => ({ ...gStopList[e], stopId: e })));

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currRoute]);

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
<<<<<<< HEAD
    <>
      <StopListRoot>
        {Object.keys(currRoute).length !== 0 &&
          stopList?.map((e, i) => {
            const isNearestStop = gStopList[nearestStopId]?.name === e.name;
            const {
              location: { lat, lng },
            } = e;
            return (
              <Accordion
                expanded={expanded === `panel${i}`}
                onChange={handleChange(`panel${i}`)}
                key={i}
                className={isNearestStop ? "highlighted" : ""}
                ref={isNearestStop ? stopListRef : null}
              >
                <AccordionSummary className="accordionSummary">
                  {currRoute.co[0] === "mtr" ? (
                    <MtrStopEta
                      seq={i + 1}
                      routeObj={currRoute}
                      stopObj={e}
                      MtrStopEtaRoot={MtrStopEtaRoot}
                    />
                  ) : (
                    <StopEta
                      seq={i + 1}
                      routeObj={currRoute}
                      stopObj={e}
                      bound={correctBound}
                      isBoundLoading={isBoundLoading}
                      StopEtaRoot={StopEtaRoot}
                    />
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <IconButton
                    className="directionIconBtn"
                    component="a"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`}
                    target="_blank"
                  >
                    <DirectionsIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handleMapIconOnClick({
                        mapLocation: { lat, lng },
                        mapStopIdx: i,
                      })
                    }
                  >
                    <MapIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handleFavIconOnClick({
                        seq: i + 1,
                        co: currRoute.co[0],
                        route: currRoute.route,
                        stopId: e.stopId,
                      })
                    }
                  >
                    <FavoriteIcon />
                  </IconButton>
                </AccordionDetails>
              </Accordion>
            );
          })}
        <MapDialog
          fullWidth
          mapDialogOpen={mapDialogOpen}
          handleMapDialogOnClose={handleMapDialogOnClose}
        />
      </StopListRoot>
      <BookmarkDialog
=======
    <StopListRoot>
      {Object.keys(currRoute).length !== 0 &&
        stopList?.map((e, i) => {
          const isNearestStop = gStopList[nearestStopId]?.name === e.name;
          const {
            location: { lat, lng },
          } = e;
          return (
            <Accordion
              expanded={expanded === `panel${i}`}
              onChange={handleChange(`panel${i}`)}
              key={i}
              className={isNearestStop ? "highlighted" : ""}
              ref={isNearestStop ? stopListRef : null}
            >
              <AccordionSummary className="accordionSummary">
                {currRoute.co[0] === "mtr" ? (
                  <MtrStopEta
                    seq={i + 1}
                    routeObj={currRoute}
                    stopObj={e}
                    MtrStopEtaRoot={MtrStopEtaRoot}
                  />
                ) : (
                  <StopEta
                    seq={i + 1}
                    routeObj={currRoute}
                    stopObj={e}
                    bound={correctBound}
                    isBoundLoading={isBoundLoading}
                    StopEtaRoot={StopEtaRoot}
                  />
                )}
              </AccordionSummary>
              <AccordionDetails>
                <IconButton
                  className="directionIconBtn"
                  component="a"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`}
                  target="_blank"
                >
                  <DirectionsIcon />
                </IconButton>
                <IconButton
                  onClick={() =>
                    handleMapIconOnClick({
                      mapLocation: { lat, lng },
                      mapStopIdx: i,
                    })
                  }
                >
                  <MapIcon />
                </IconButton>
                <IconButton
                  onClick={() =>
                    handleFavIconOnClick({
                      seq: i + 1,
                      co: currRoute.co[0],
                      route: currRoute.route,
                      stopId: e.stopId,
                    })
                  }
                >
                  <FavoriteIcon />
                </IconButton>
              </AccordionDetails>
            </Accordion>
          );
        })}
      <MapDialog
>>>>>>> 2292fdd... get routeObj
        fullWidth
        bookmarkDialogOpen={bookmarkDialogOpen}
        setBookmarkDialogOpen={setBookmarkDialogOpen}
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
      padding: "4px 6px 8px",
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
        ".directionIconBtn": {
          marginLeft: "-8px",
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
  ".etasWrapper": {
    width: "100%",
    ".etaWrapper": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: "4px 0",
      ".arriveText": {
        width: "70px",
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
  ".seq": {
    width: "5%",
  },
  ".stop": {
    display: "flex",
    flexGrow: "1",
  },
  ".etas": {
    width: "40%",
    display: "flex",
    flexDirection: "row",
    ".eta": {
      width: "33.33%",
    },
  },
});
