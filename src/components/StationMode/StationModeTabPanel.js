import { useState, useEffect, useContext } from "react";
import { styled } from "@mui/material";
import { DbContext } from "../../context/DbContext";
import { companyColor } from "../../constants/Constants";
import { buildRouteObjForEta, handleTableResult } from "../../Utils/Utils";

export const StationModeTabPanel = ({
  value,
  index,
  stationModeData,
  transportData,
}) => {
  const { gStopList, gRouteList } = useContext(DbContext);
  const [sectionEtaResult, setSectionEtaResult] = useState([]);

  const section =
    transportData[stationModeData.position[0]].data[
      stationModeData.position[1]
    ];

  useEffect(() => {
    const intervalContent = async () => {
      // Handle old bookmark format
      // New bookmark format only have routeKey, seq & stopId
      section.forEach((f) => {
        if (!f.co) {
          const routeData = gRouteList[f.routeKey];
          f.co = routeData.co[0];
          f.route = f.routeKey.split("+")[0];
          f.dest = routeData.dest.zh;
          if (routeData.co[0] === "gmb") {
            f.gtfsId = routeData.gtfsId;
          }
        }
      });
      const etas = await buildRouteObjForEta(gStopList, gRouteList, section);
      setSectionEtaResult(etas);
    };

    intervalContent();
    const interval = setInterval(intervalContent, 10000);

    return () => clearInterval(interval);
  }, []);

  const result = handleTableResult(sectionEtaResult);

  return (
    <StationModeTabPanelRoot>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
      >
        {value === index && (
          <div>
            <div className="row">
              <div className="route title">路線</div>
              <div className="dest title">總站</div>
              <div className="etaWrapper title">分鐘</div>
            </div>
            {result.map((e, i) => (
              <div className="row" key={i}>
                <div className="route">
                  <span className={`${e.co}`}>{e.route}</span>
                </div>
                <div className="dest">{section[i].dest}</div>
                <div className="etaWrapper">
                  {e.etas.slice(0, 2).map((eta, j) => (
                    <div key={j} className={`eta eta${j}`}>
                      {eta}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StationModeTabPanelRoot>
  );
};

const StationModeTabPanelRoot = styled("div")({
  width: "100%",
  paddingTop: "8px",
  ".error": {
    color: "#808080",
    textDecoration: "line-through",
  },
  ".emptyMsg": {
    fontSize: "14px",
    textAlign: "center",
    padding: "14px",
  },
  ".stationTitle": {
    fontSize: "1.5rem",
    textAlign: "center",
    fontWeight: 900,
    paddingBottom: "8px",
  },
  ".row": {
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "baseline",
    padding: "8px",
    borderBottom: "1px solid lightgrey",
    ".title": {
      fontWeight: "900",
    },
    ".route": {
      ...companyColor,
      width: "20%",
      fontWeight: "900",
    },
    ".dest": {
      width: "50%",
    },
    ".etaWrapper": {
      width: "30%",
      display: "flex",
      alignItems: "flex-end",
      flexDirection: "column",
      ".eta1": {
        fontSize: "15px",
      },
    },
  },
});
