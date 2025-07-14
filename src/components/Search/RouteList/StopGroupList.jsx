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
  const [showNoEta, setShowNoEta] = useState(false);
  const [transport, setTransport] = useState(["gmb", "bus", "mtr", "lrt"]);
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

  const transportBtn = [
    {
      value: "gmb",
      text: "小巴",
      co: ["gmb"],
    },
    {
      value: "bus",
      text: "巴士",
      co: ["kmb", "ctb", "nwfb", "nlb"],
    },
    {
      value: "mtr",
      text: "地鐵",
      co: ["mtr"],
    },
    {
      value: "lrt",
      text: "輕鐵",
      co: ["lightRail"],
    },
  ];

  const transportCo = transport
    .map((e) => {
      const _transport = transportBtn.find((btn) => e === btn.value);
      return _transport ? _transport.co : [];
    })
    .flat();

  const handleMeterBtnOnClick = (e) => {
    setMaxDistance(e);
  };

  const handleShowNoEtaBtnOnClick = () => {
    setShowNoEta(!showNoEta);
  };

  const handleTransportBtnOnClick = (e) => {
    const index = transport.indexOf(e.target.value);
    if (index === -1) {
      setTransport([...transport, e.target.value]);
    } else {
      setTransport(transport.filter((f) => f !== e.target.value));
    }
  };

  return (
    <StopGrouListRoot childStyles={childStyles}>
      <div className="filterButtonWrapper">
        <div className="meterBtnGroupWrapper">
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
        <div className="bottomBtn">
          <Button
            size="small"
            variant={showNoEta ? "contained" : "outlined"}
            onClick={handleShowNoEtaBtnOnClick}
            className="showNoEtaBtn"
          >
            顯示「沒有班次」
          </Button>
          <ButtonGroup size="small">
            {transportBtn.map((e, i) => (
              <Button
                key={i}
                variant={transport.includes(e.value) ? "contained" : "outlined"}
                onClick={(f) => handleTransportBtnOnClick(f)}
                className="transportBtn"
                value={e.value}
              >
                {e.text}
              </Button>
            ))}
          </ButtonGroup>
        </div>
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
                  showNoEta={showNoEta}
                  transportCo={transportCo}
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
  ".filterButtonWrapper": {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingTop: "4px",
    ".MuiButton-containedPrimary": {
      backgroundColor: "#2f305c",
      color: "white",
    },
    ".MuiButton-outlinedPrimary": {
      color: "#2f305c",
      borderColor: "#2f305c",
    },
    ".meterBtnGroupWrapper": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    ".bottomBtn": {
      display: "flex",
      justifyContent: "space-between",
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
