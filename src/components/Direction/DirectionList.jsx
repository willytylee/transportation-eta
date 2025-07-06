import { useState, useContext, useEffect, useMemo } from "react";
import { styled, Button, ButtonGroup } from "@mui/material";
import {
  DirectionsRun as DirectionsRunIcon,
  Elderly as ElderlyIcon,
} from "@mui/icons-material";
import { DbContext } from "../../context/DbContext";
import { useLocationOnce } from "../../hooks/Location";
import { useStopIdsNearby } from "../../hooks/StopIdsNearBy";
import { basicFiltering } from "../../Utils/Utils";
import { DirectionContext } from "../../context/DirectionContext";
import { DirectionItem } from "./DirectionItem";

export const DirectionList = () => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const { origin, destination, sortingMethod, updateExpanded } =
    useContext(DirectionContext);
  const [directionRouteList, setDirectionRouteList] = useState([]);
  const [sortedRouteList, setSortedRouteList] = useState([]);
  const [maxWalkingDistance, setMaxWalkingDistance] = useState(400);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const routeList = useMemo(
    () =>
      gRouteList &&
      Object.keys(gRouteList)
        .map((e) => {
          gRouteList[e].key = e;
          return gRouteList[e];
        })
        .filter((e) => basicFiltering(e)),
    []
  );

  const handleWalkMoreOnClick = () => {
    setMaxWalkingDistance((prev) => prev + 200);
  };

  const handleWalkLessOnClick = () => {
    if (maxWalkingDistance > 0) {
      setMaxWalkingDistance((prev) => prev - 200);
    }
  };

  const { location: currentLocation } = useLocationOnce();
  const { stopIdsNearby: origins } = useStopIdsNearby({
    maxDistance: maxWalkingDistance,
    lat: origin ? origin.location.lat : currentLocation.lat,
    lng: origin ? origin.location.lng : currentLocation.lng,
  });
  const { stopIdsNearby: destinations } = useStopIdsNearby({
    maxDistance: maxWalkingDistance,
    lat: destination?.location?.lat,
    lng: destination?.location?.lng,
  });

  // ===============================================================

  useEffect(() => {
    updateExpanded(false);

    setIsLoading(true);
    const worker = new Worker(
      new URL("../../workers/directionWorker.js", import.meta.url),
      {
        type: "module",
      }
    );

    worker.onmessage = (e) => {
      setDirectionRouteList(e.data);
      setIsLoading(false);
      worker.terminate(); // Clean up
    };

    worker.onerror = () => {
      setText("Error during calculation");
      setIsLoading(false);
      worker.terminate();
    };

    worker.postMessage({ origins, destinations, routeList, gStopList }); // Trigger calculation (pass data if needed)

    return () => worker.terminate(); // Cleanup on unmount
  }, [origin, destination, maxWalkingDistance]);

  useEffect(() => {
    let filteredRouteList;
    if (sortingMethod === "最短步行時間") {
      filteredRouteList = directionRouteList.sort(
        (a, b) =>
          a.origin.walkTime +
          a.destination.walkTime -
          (b.origin.walkTime + b.destination.walkTime)
      );
    } else if (sortingMethod === "最短交通時間") {
      filteredRouteList = directionRouteList.sort(
        (a, b) =>
          a.origin.transportTime +
          a.destination.transportTime -
          (b.origin.transportTime + b.destination.transportTime)
      );
    } else if (sortingMethod === "最短總時間") {
      filteredRouteList = directionRouteList.sort(
        (a, b) =>
          a.origin.walkTime +
          a.origin.transportTime +
          a.destination.walkTime +
          a.destination.transportTime -
          (b.origin.walkTime +
            b.origin.transportTime +
            b.destination.walkTime +
            b.destination.transportTime)
      );
    }
    setSortedRouteList(
      filteredRouteList
        .sort((a, b) => {
          const aIsEmpty =
            a.origin.commonStopId === "" &&
            a.origin.commonStopSeq === "" &&
            a.destination.commonStopId === "" &&
            a.destination.commonStopSeq === "";
          const bIsEmpty =
            b.origin.commonStopId === "" &&
            b.origin.commonStopSeq === "" &&
            b.destination.commonStopId === "" &&
            b.destination.commonStopSeq === "";

          if (aIsEmpty && !bIsEmpty) return -1; // a goes first
          if (!aIsEmpty && bIsEmpty) return 1; // b goes first
          return 0; // maintain order if both are empty or both are non-empty
        })
        .filter(
          (e) =>
            e.origin.walkTime +
              e.origin.transportTime +
              e.destination.walkTime +
              e.destination.transportTime <
            100
        )
    );
  }, [directionRouteList, sortingMethod]);

  // const groupedData = sortedRouteList.reduce((acc, item) => {
  //   const key = `${item.origin.stopId}|${item.destination.stopId}|${item.common.stopId}`;
  //   if (!acc[key]) {
  //     acc[key] = [];
  //   }
  //   acc[key].push(item);
  //   return acc;
  // }, {});

  // Convert to array format if needed
  // console.log(Object.values(groupedData));

  // console.log(sortedRouteList);

  return (
    <DirectionListRoot>
      {origin &&
        destination &&
        (isLoading ? (
          <div className="emptyMsg">搜尋路線中...</div>
        ) : sortedRouteList?.length > 0 ? (
          sortedRouteList.map((e, i) => (
            <DirectionItem
              key={i}
              routeListItem={e}
              i={i}
              destination={destination}
            />
          ))
        ) : (
          <div className="emptyMsg">沒有路線</div>
        ))}
      {!origin && !destination ? (
        <div className="emptyMsg" />
      ) : !origin ? (
        <div className="emptyMsg">請輸入起點</div>
      ) : (
        !destination && <div className="emptyMsg">請輸入目的地</div>
      )}
      <div className="walkingDistanceWrapper">
        車站步行距離: 最多{maxWalkingDistance}米
      </div>
      <ButtonGroup fullWidth variant="outlined" className="btnWrapper">
        <Button
          disabled={maxWalkingDistance === 1000}
          onClick={handleWalkMoreOnClick}
          startIcon={<DirectionsRunIcon />}
        >
          可以行遠啲!
        </Button>
        <Button
          disabled={maxWalkingDistance === 0}
          onClick={handleWalkLessOnClick}
          startIcon={<ElderlyIcon />}
        >
          行唔郁啦!
        </Button>
      </ButtonGroup>
      {text}
    </DirectionListRoot>
  );
};

const DirectionListRoot = styled("div")({
  display: "flex",
  flex: "5",
  flexDirection: "column",
  overflow: "auto",
  ".walkingDistanceWrapper": {
    textAlign: "center",
    paddingTop: "10px",
  },
  ".emptyMsg": {
    fontSize: "14px",
    textAlign: "center",
    padding: "14px",
  },
  ".btnWrapper button": {
    borderColor: "#2f305c",
    color: "#2f305c",
    fontSize: "14px",
    alignItems: "flex-start",
  },
});
