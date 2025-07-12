import { useContext, useState, useEffect } from "react";
import { styled, ButtonGroup, Button } from "@mui/material";
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
  const [nearbyRouteList, setNearbyRouteList] = useState([]);
  const { stopIdsNearby } = useStopIdsNearby({
    maxDistance,
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });

  useEffect(() => {
    const worker = new Worker(
      new URL("../../../workers/nearbyWorker.js", import.meta.url),
      {
        type: "module",
      }
    );

    worker.onmessage = (e) => {
      setNearbyRouteList(e.data);
      worker.terminate(); // Clean up
    };

    worker.onerror = () => {
      worker.terminate();
    };

    worker.postMessage({ routeKeyList, gRouteList, stopIdsNearby }); // Trigger calculation (pass data if needed)

    return () => worker.terminate(); // Cleanup on unmount
  }, [routeKeyList, maxDistance]);

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
    padding: "4px 0px",
    flexDirection: "column",
    ".stop": {
      backgroundColor: `${primaryColor}26`,
      padding: "4px 10px",
    },
    ".routes": {
      padding: "0 10px",
    },
  },
  ".emptyMsg": {
    padding: "14px",
    fontSize: "14px",
    textAlign: "center",
  },
  ...childStyles,
}));
