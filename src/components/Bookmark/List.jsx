import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  IconButton,
} from "@mui/material";
import {
  Directions as DirectionsIcon,
  DirectionsBus as DirectionsBusIcon,
  PriorityHigh as PriorityHighIcon,
} from "@mui/icons-material";
import { phaseEta, sortEtaObj } from "../../utils/Utils";
import { companyColor, primaryColor } from "../../constants/Constants";
import { stationMap, mtrLineColor, routeMap } from "../../constants/Mtr";

export const List = ({ etaResult, longList }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  let result = [];

  etaResult.forEach((e) => {
    const { co, etas, route, stopName, stopId, location, routeKey } = e;

    let eta;

    if (etas) {
      if (etas.length === 0) {
        result.push({
          co,
          route,
          eta: "",
          stopName,
          stopId,
          routeKey,
          latLngUrl: `https://www.google.com.hk/maps/dir/?api=1&destination=${location?.lat},${location?.lng}&travelmode=walking`,
        });
      } else if (etas.length >= 0) {
        etas.forEach((f) => {
          eta = f.eta ?? "";
          const { rmk_tc } = f;
          result.push({
            co,
            route,
            eta,
            rmk_tc,
            stopName,
            dest: f.dest,
            stopId,
            routeKey,
            latLngUrl: `https://www.google.com.hk/maps/dir/?api=1&destination=${location?.lat},${location?.lng}&travelmode=walking`,
          });
        });
      }
    } else {
      result.push({
        co: "error",
        route,
        eta: false,
        stopName,
        stopId,
        routeKey,
        latLngUrl: `https://www.google.com.hk/maps/dir/?api=1&destination=${location?.lat},${location?.lng}&travelmode=walking`,
      });
    }
  });

  // Sort the eta for same category
  result = sortEtaObj(result);

  const etaRouteNum =
    JSON.parse(localStorage.getItem("settings"))?.etaRouteNum || "5個";

  if (!longList) {
    result = result.slice(0, etaRouteNum[0]);
  }

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <ListView>
      {result.map((e, i) => (
        <Accordion
          key={i}
          className="etaWrapper"
          expanded={expanded === `panel${i}`}
          onChange={handleChange(`panel${i}`)}
        >
          <AccordionSummary className="accordionSummary">
            <div className="routeWrapper">
              {e.co === "mtr" ? (
                <span className={`route ${e.route}`}>{routeMap[e?.route]}</span>
              ) : (
                <>
                  {e.co === "error" && <PriorityHighIcon fontSize="small" />}
                  <span className={`${e.co}`}>{e?.route}</span>
                </>
              )}
            </div>
            <div className={`stopName ${e.co}`}>
              {e?.stopName}
              {e.co === "mtr" &&
                e?.eta.length > 0 &&
                ` → ${stationMap[e?.dest]}`}
            </div>
            <div className="eta">
              {
                phaseEta({
                  etaStr: e.eta,
                  remark: e.rmk_tc,
                }).etaIntervalStr
              }
              {e?.eta.length > 0 && (
                <span className="time">
                  (
                  {
                    phaseEta({
                      etaStr: e.eta,
                      remark: e.rmk_tc,
                    }).time
                  }
                  )
                </span>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <IconButton
              className="iconBtn directionIconBtn"
              component="a"
              href={e?.latLngUrl}
              target="_blank"
            >
              <DirectionsIcon />
              <div>前往車站</div>
            </IconButton>
            {e.routeKey && (
              <IconButton
                className="iconBtn"
                onClick={() => {
                  navigate("/search/" + e.routeKey + "/" + e.stopId, {
                    replace: true,
                  });
                }}
              >
                <DirectionsBusIcon />
                <div>交通路線</div>
              </IconButton>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </ListView>
  );
};

const ListView = styled("div")({
  fontSize: "12px",
  width: "100%",
  ".error": {
    color: "#808080",
  },
  ".MuiPaper-root": {
    "&:before": {
      backgroundColor: "unset",
    },
    "&.Mui-expanded": {
      backgroundColor: `${primaryColor}17`,
      paddingTop: "4px",
      paddingBottom: "0",
      margin: 0,
    },
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    boxShadow: "unset",
    padding: "2px 6px",
    ".accordionSummary": {
      minHeight: "unset",
      padding: "0",
      ".MuiAccordionSummary-content": {
        display: "flex",
        width: "100%",
        alignItems: "center",
        margin: 0,
        ".routeWrapper": {
          ...companyColor,
          width: "52px",
          fontWeight: "900",
          display: "flex",
          alignItems: "center",
          ".route": {
            ...mtrLineColor,
          },
        },
        ".stopName": {
          width: "45%",
        },
        ".eta": {
          display: "flex",
          width: "156px", // match table's eta = width: 52px
          flexShrink: 0,
          alignItems: "baseline",
          ".time": {
            fontSize: "11px",
            paddingLeft: "4px",
          },
        },
      },
    },
  },
  ".MuiCollapse-root": {
    ".MuiAccordionDetails-root": {
      padding: "0px 16px 0px 10%",
      display: "flex",
      paddingTop: "6px",
      ".directionIconBtn": {
        marginLeft: "-10px",
      },
      ".iconBtn": {
        flexDirection: "column",
        fontSize: "10px",
        height: "58px",
        width: "58px",
      },
    },
  },
});
