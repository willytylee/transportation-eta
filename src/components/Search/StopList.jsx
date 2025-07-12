import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  IconButton,
} from "@mui/material";
import {
  Directions as DirectionsIcon,
  BookmarkAdd as BookmarkAddIcon,
  Streetview as StreetviewIcon,
  PushPin as PushPinIcon,
  Radar as RadarIcon,
} from "@mui/icons-material";
import { getDistance } from "geolib";
import { getFirstCoByRouteObj } from "../../Utils/Utils";
import { EtaContext } from "../../context/EtaContext";
import { DbContext } from "../../context/DbContext";
import { primaryColor } from "../../constants/Constants";
import { useLocationWithInterval } from "../../hooks/Location";
import { MtrStopEta } from "./MtrStopEta";
import { StopEta } from "./StopEta";
import { BookmarkDialog } from "./Dialog/BookmarkDialog";
import { MtrRouteOptionDialog } from "./Dialog/MtrRouteOptionDialog";
import { StopNearbyDialog } from "./Dialog/StopNearbyDialog";

export const StopList = () => {
  const { routeKey, stopId } = useParams();
  const navigate = useNavigate();
  const { gStopList, gRouteList } = useContext(DbContext);
  const { location: currentLocation } = useLocationWithInterval({
    interval: 60000,
  });
  const [stopList, setStopList] = useState([]);
  const [nearbyDialogOpen, setNearbyDialogOpen] = useState(false);
  const [mtrRouteOptionDialogOpen, setMtrRouteOptionDialogOpen] =
    useState(false);
  const [bookmarkDialogMode, setBookmarkDialogMode] = useState(null);
  const [bookmarkData, setBookmarkData] = useState({});
  const [stopLatLng, setStopLatLng] = useState({});
  const {
    nearestStopId,
    updateNearestStopId,
    updateMapLocation,
    updateMapStopIdx,
    pinList,
    updatePinList,
  } = useContext(EtaContext);

  const stopListRef = useRef([]);

  const handlePinIconOnClick = (seq, _routeKey, _stopId) => {
    const isInList =
      pinList.filter(
        (e) => e.routeKey === _routeKey && e.stopId === _stopId && e.seq === seq
      ).length > 0;

    if (!isInList) {
      updatePinList([
        ...pinList,
        { seq, routeKey: _routeKey, stopId: _stopId },
      ]);
    }
  };

  const handleNearbyIconOnClick = (_stopId) => {
    setStopLatLng(gStopList[_stopId].location);
    setNearbyDialogOpen(true);
  };

  const handleBookmarkAddIconOnClick = (_bookmarkData) => {
    setBookmarkData(_bookmarkData);
    const english = /^[A-Za-z]*$/;

    if (
      _bookmarkData.stopId.length === 3 &&
      english.test(_bookmarkData.stopId)
    ) {
      setMtrRouteOptionDialogOpen(true);
    } else {
      setBookmarkDialogMode("category");
    }
  };

  const handleAccordionOnChange = ({ _stopId, mapLocation, mapStopIdx }) => {
    updateMapLocation(mapLocation);
    updateMapStopIdx(mapStopIdx);
    if (stopId && stopId === _stopId) {
      navigate("/search/" + routeKey, { replace: true });
    } else {
      navigate("/search/" + routeKey + "/" + _stopId, { replace: true });
    }
  };

  const routeData = routeKey ? gRouteList[routeKey] : [];

  // When the currRoute in AppContext changed
  useEffect(() => {
    if (routeKey) {
      // Find the company Id which appear in currRoute.stops

      const companyId = getFirstCoByRouteObj(routeData);
      const expandStopIdArr = routeData.stops[companyId];

      setStopList(expandStopIdArr.map((e) => ({ ...gStopList[e], stopId: e })));

      if (currentLocation.lat !== 0 && currentLocation.lng !== 0) {
        const resultStopId = expandStopIdArr.reduce((prev, curr) => {
          const prevDistance = getDistance(
            {
              latitude: gStopList[prev].location.lat,
              longitude: gStopList[prev].location.lng,
            },
            {
              latitude: currentLocation.lat,
              longitude: currentLocation.lng,
            }
          );
          const currDistance = getDistance(
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
        });

        if (!stopId) {
          updateMapStopIdx(
            expandStopIdArr.findIndex((e) => e === resultStopId)
          );
          updateMapLocation(gStopList[resultStopId].location);
        }

        updateNearestStopId(resultStopId);
      } else {
        updateNearestStopId("");
      }
    }
  }, [routeKey, currentLocation.lat, currentLocation.lng]);

  useEffect(() => {
    if (stopList.length > 0) {
      const idx = stopList.findIndex((e) => e.stopId === stopId);
      stopListRef.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [stopId]);

  useEffect(() => {
    if (stopList.length > 0) {
      const idx = stopList.findIndex((e) => e.stopId === nearestStopId);
      stopListRef.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [nearestStopId]);

  return (
    <>
      <StopListRoot>
        {routeKey &&
          stopList?.map((e, i) => {
            const isNearestStop =
              gStopList[nearestStopId]?.name === e.name &&
              currentLocation.lat !== -1 &&
              currentLocation.lng !== -1;
            const {
              location: { lat, lng },
            } = e;

            return (
              <Accordion
                expanded={stopId === e?.stopId}
                onChange={() =>
                  handleAccordionOnChange({
                    _stopId: e.stopId,
                    mapLocation: { lat, lng },
                    mapStopIdx: i,
                  })
                }
                key={i}
                className={isNearestStop ? "highlighted" : ""}
                ref={(_e) => (stopListRef.current[i] = _e)}
              >
                <AccordionSummary className="accordionSummary">
                  {routeData.co[0] === "mtr" ? (
                    <MtrStopEta seq={i + 1} routeObj={routeData} stopObj={e} />
                  ) : (
                    <StopEta
                      seq={i + 1}
                      routeObj={routeData}
                      stopObj={e}
                      slice={3}
                    />
                  )}
                </AccordionSummary>
                <AccordionDetails className="iconWrapper">
                  <IconButton
                    className="iconBtn"
                    component="a"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`}
                    target="_blank"
                  >
                    <DirectionsIcon />
                    <div>前往車站</div>
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
                  <IconButton
                    className="iconBtn"
                    onClick={() => {
                      if (routeData.co[0] === "mtr") {
                        handleBookmarkAddIconOnClick({
                          routeKey,
                          stopId: e.stopId,
                        });
                      } else {
                        handleBookmarkAddIconOnClick({
                          seq: i + 1,
                          stopId: e.stopId,
                          routeKey,
                        });
                      }
                    }}
                  >
                    <BookmarkAddIcon />
                    <div>書籤</div>
                  </IconButton>
                  <IconButton
                    className="iconBtn"
                    onClick={() =>
                      handlePinIconOnClick(i + 1, routeKey, e.stopId)
                    }
                  >
                    <PushPinIcon />
                    <div>置頂</div>
                  </IconButton>
                  <IconButton
                    className="iconBtn"
                    onClick={() => handleNearbyIconOnClick(e.stopId)}
                  >
                    <RadarIcon />
                    <div>附近路線</div>
                  </IconButton>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </StopListRoot>

      <BookmarkDialog
        bookmarkDialogMode={bookmarkDialogMode}
        setBookmarkDialogMode={setBookmarkDialogMode}
        bookmarkData={bookmarkData}
      />
      <MtrRouteOptionDialog
        mtrRouteOptionDialogOpen={mtrRouteOptionDialogOpen}
        setBookmarkDialogMode={setBookmarkDialogMode}
        bookmarkData={bookmarkData}
        setBookmarkData={setBookmarkData}
        setMtrRouteOptionDialogOpen={setMtrRouteOptionDialogOpen}
      />
      <StopNearbyDialog
        nearbyDialogOpen={nearbyDialogOpen}
        setNearbyDialogOpen={setNearbyDialogOpen}
        stopLatLng={stopLatLng}
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
      ".iconWrapper": {
        padding: "0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(50px, max-content))",
        gridGap: "4px",
        justifyContent: "center",
        ".iconBtn": {
          padding: "0px",
          flexDirection: "column",
          fontSize: "10px",
          height: "50px",
          width: "50px",
        },
      },
    },
  },
});
