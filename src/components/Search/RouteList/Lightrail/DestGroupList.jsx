import { useState, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import { styled } from "@mui/material";
import { primaryColor } from "../../../../constants/Constants";
import { fetchLrtStopInfo } from "../../../../fetch/transports/Lrt";
import { phaseEta } from "../../../../Utils/Utils";
import { TransportSign } from "../../../Direction/Box/TransportSign";

export const DestGroupList = ({ lrtStopId, orderMode, childStyles }) => {
  const [stopInfo, setStopInfo] = useState(null);

  useEffect(() => {
    const intervalContent = () => {
      fetchLrtStopInfo({ stopId: lrtStopId }).then((response) => {
        const result = _(response)
          .groupBy((x) => x[orderMode])
          .map((value, key) => ({
            key,
            routes: value,
          }))
          .value();
        setStopInfo(result);
      });
    };

    intervalContent();

    const intervalID = setInterval(intervalContent, 30000);

    return () => {
      clearInterval(intervalID);
    };
  }, [orderMode]);

  const renderCategoryText = (text) => {
    if (orderMode === "dest") {
      return "→ " + text;
    } else if (orderMode === "plat") {
      return "月台 " + text;
    } else if (orderMode === "route") {
      return "路線 " + text;
    }
  };

  return (
    <DestGroupListRoot childStyles={childStyles}>
      {stopInfo?.length > 0 &&
        stopInfo.map((category, i) => (
            <div className="routeList" key={i}>
              <div className="key">{renderCategoryText(category.key)}</div>
              <div className="routes">
                {category.routes
                  .sort((a, b) => {
                    if (
                      a.eta &&
                      b.eta &&
                      moment(a.eta, "YYYY-MM-DD HH:mm:ss").isValid() &&
                      moment(b.eta, "YYYY-MM-DD HH:mm:ss").isValid()
                    ) {
                      return moment(a.eta).diff(moment(b.eta), "second");
                    }
                    return false;
                  })
                  .map((route, j) => (
                    <div className="item" key={j}>
                      <div className="left">
                        <TransportSign routeObj={route} />
                        <div className="plat">月台{route.plat}</div>
                      </div>
                      <div className="etaWrapper">
                        <div className="etas">
                          {phaseEta({ etaStr: route.eta }).etaIntervalStr}
                        </div>
                        <div className="time">
                          {phaseEta({ etaStr: route.eta }).time}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
    </DestGroupListRoot>
  );
};

const DestGroupListRoot = styled("div", {
  // Prevent childStyles from being passed to DOM
  shouldForwardProp: (prop) => prop !== "childStyles",
})(({ childStyles }) => ({
  ".routeList": {
    display: "flex",
    flexDirection: "column",
    ".key": {
      backgroundColor: `${primaryColor}26`,
      padding: "4px 10px",
    },
    ".routes": {
      padding: "0 10px",
      ".item": {
        display: "flex",
        alignItems: "center",
        padding: "4px 0",
        borderBottom: "1px solid lightgrey",
        justifyContent: "space-between",
        ".left": {
          display: "flex",
          ".route": {
            width: "55px",
          },
        },
        ".etaWrapper": {
          display: "flex",
          ".etas": {
            width: "60px",
          },
          ".time": {
            width: "50px",
          },
        },
      },
    },
  },
  ".emptyMsg": {
    padding: "14px",
    fontSize: "14px",
    textAlign: "center",
  },
  ...childStyles,
}));
