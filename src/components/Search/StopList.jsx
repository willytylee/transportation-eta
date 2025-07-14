import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDistance } from "geolib";
import { getFirstCoByRouteObj } from "../../Utils/Utils";
import { EtaContext } from "../../context/EtaContext";
import { DbContext } from "../../context/DbContext";
import { useLocationWithInterval } from "../../hooks/Location";
import { BookmarkDialog } from "./Dialog/BookmarkDialog";
import { MtrRouteOptionDialog } from "./Dialog/MtrRouteOptionDialog";
import { StopNearbyDialog } from "./Dialog/StopNearbyDialog";
import { StopListAccordion } from "./StopListAccordion";

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

  const stopListRef = useRef(null);

  const handlePinOnClick = (seq, _routeKey, _stopId) => {
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

  const handleNearbyOnClick = (_stopId) => {
    setStopLatLng(gStopList[_stopId].location);
    setNearbyDialogOpen(true);
  };

  const handleBookmarkAddOnClick = (_bookmarkData) => {
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

        updateNearestStopId(resultStopId);
      } else {
        updateNearestStopId("");
      }
    }
  }, [routeKey, currentLocation.lat, currentLocation.lng]);

  useEffect(() => {
    if (stopList.length > 0 && stopId) {
      updateMapStopIdx(stopList.findIndex((e) => e.stopId === stopId));
      updateMapLocation(gStopList[stopId]?.location);
      const node = stopListRef.current.querySelectorAll(
        '[title = "' + stopId + '"]'
      )[0];
      node?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [stopList, stopId]);

  useEffect(() => {
    if (stopList.length > 0 && !stopId) {
      updateMapStopIdx(stopList.findIndex((e) => e.stopId === nearestStopId));
      updateMapLocation(gStopList[nearestStopId]?.location);
      const node = stopListRef.current.querySelectorAll(
        '[title = "' + nearestStopId + '"]'
      )[0];
      node?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [nearestStopId]);

  return (
    <div className="debug" ref={stopListRef}>
      {routeKey &&
        stopList?.map((stop, i) => {
          const isNearestStop =
            nearestStopId === stop.stopId &&
            currentLocation.lat !== -1 &&
            currentLocation.lng !== -1;
          const {
            location: { lat, lng },
          } = stop;

          return (
            <StopListAccordion
              key={i}
              routeData={routeData}
              stop={stop}
              stopIdx={i}
              isNearestStop={isNearestStop}
              lat={lat}
              lng={lng}
              handlePinOnClick={handlePinOnClick}
              handleNearbyOnClick={handleNearbyOnClick}
              handleBookmarkAddOnClick={handleBookmarkAddOnClick}
              handleAccordionOnChange={handleAccordionOnChange}
            />
          );
        })}

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
    </div>
  );
};
