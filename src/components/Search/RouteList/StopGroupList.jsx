import { useContext, useState } from "react";
import _ from "lodash";
import { styled, ButtonGroup, Button } from "@mui/material";
import { getFirstCoByRouteObj } from "../../../Utils/Utils";
import { DbContext } from "../../../context/DbContext";
import { primaryColor } from "../../../constants/Constants";
import { useStopIdsNearby } from "../../../hooks/StopIdsNearBy";
import { StopGroupListSection } from "./StopGroupListSection";

export const StopGroupList = ({
  routeKeyList,
  currentLocation,
  setNearbyDialogOpen,
  childStyles,
}) => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const [maxDistance, setMaxDistance] = useState(200);
  const { stopIdsNearby } = useStopIdsNearby({
    maxDistance,
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });

  const filteredRouteObjList = [];

  // Find out the route which contains the near by Stops
  routeKeyList?.forEach((e) => {
    const routeData = gRouteList[e];
    const company = getFirstCoByRouteObj(routeData);
    const { stops } = routeData;

    const filitedStopId = stops[company].filter((f) =>
      Object.keys(stopIdsNearby).includes(f)
    );

    if (filitedStopId?.length > 0) {
      // There may have more than one stopIdsNearby in a route, find the nearest stop in the route stop List
      const _stopId = filitedStopId.reduce((prev, curr) =>
        stopIdsNearby[prev] < stopIdsNearby[curr] ? prev : curr
      );
      const origStopSeq = stops[company].findIndex((f) => f === _stopId) + 1;
      routeData.stopId = _stopId;
      routeData.seq = origStopSeq;

      routeData.distance = stopIdsNearby[_stopId];
      routeData.routeKey = e;

      filteredRouteObjList.push(routeData);
    }
  });

  const nearbyRouteList = _(filteredRouteObjList)
    .groupBy((x) => x.stopId)
    .map((value, key) => ({
      stopId: key,
      routes: value,
    }))
    .value()
    .sort((a, b) => a.routes[0].distance - b.routes[0].distance);

  const buttons = [200, 400, 600, 800, 1000];

  const handleMeterBtnOnClick = (e) => {
    setMaxDistance(e);
  };

  return (
    <StopGrouListRoot childStyles={childStyles}>
      <div className="btnGroupWrapper">
        <ButtonGroup size="small">
          {buttons.map((e, i) => (
            <Button
              key={i}
              variant={maxDistance === e ? "contained" : "outlined"}
              onClick={() => handleMeterBtnOnClick(e)}
              className="meterBtn"
            >
              {e + "米"}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      {nearbyRouteList?.length > 0 &&
        nearbyRouteList.map((category, i) => {
          const stop = gStopList[category.stopId];
          const name = stop.name.zh;
          const { lat, lng } = stop.location;
          return (
            <div className="routeList" key={i}>
              <div className="stop">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`}
                >
                  {name} - {category.routes[0].distance}米
                </a>
              </div>
              <div className="routes">
                <StopGroupListSection
                  category={category}
                  setNearbyDialogOpen={setNearbyDialogOpen}
                />
              </div>
            </div>
          );
        })}

      {currentLocation.lat === 0 && currentLocation.lng === 0 && (
        <div className="emptyMsg">載入中...</div>
      )}

      {currentLocation.lat !== 0 &&
        currentLocation.lng !== 0 &&
        nearbyRouteList?.length === 0 && (
          <div className="emptyMsg">附近未有交通路線</div>
        )}
    </StopGrouListRoot>
  );
};

const StopGrouListRoot = styled("div", {
  // Prevent childStyles from being passed to DOM
  shouldForwardProp: (prop) => prop !== "childStyles",
})(({ childStyles }) => ({
  ".btnGroupWrapper": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ".MuiButton-containedPrimary": {
      backgroundColor: "#2f305c",
      color: "white",
    },
  },
  ".routeList": {
    display: "flex",
    padding: "4px",
    flexDirection: "column",
    ".stop": {
      backgroundColor: `${primaryColor}26`,
      padding: "4px 10px",
    },
    ".routes": {
      padding: "0 10px",
    },
  },
  ...childStyles,
}));
