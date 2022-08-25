import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  IconButton,
} from "@mui/material";
import { Directions as DirectionsIcon } from "@mui/icons-material";
import { etaTimeConverter, sortEtaObj } from "../../../Utils";
import { companyColor, primaryColor } from "../../../constants/Constants";

export const List = ({ sectionData, longList }) => {
  const [expanded, setExpanded] = useState(false);

  let result = [];

  sectionData.forEach((e) => {
    const { co, etas, route, stopName, stopId, location } = e;

    let eta;

    if (etas) {
      if (etas.length === 0) {
        result.push({
          co,
          route,
          eta: "",
          stopName,
          stopId,
          latLngUrl: `https://www.google.com.hk/maps/dir/?api=1&destination=${location?.lat},${location?.lng}&travelmode=walking`,
        });
      } else {
        etas.forEach((f) => {
          eta = f.eta ? f.eta : "";
          const { rmk_tc } = f;
          result.push({
            co,
            route,
            eta,
            rmk_tc,
            stopName,
            stopId,
            latLngUrl: `https://www.google.com.hk/maps/dir/?api=1&destination=${location?.lat},${location?.lng}&travelmode=walking`,
          });
        });
      }
    }
  });

  // Sort the eta for same section

  result = sortEtaObj(result);

  result.forEach((e, i) => {
    const { eta, rmk_tc } = e;
    result[i].eta = etaTimeConverter(eta, rmk_tc).etaIntervalStr;
  });

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
            <div className="route">
              <span className={`${e.co}`}>{e?.route}</span>
            </div>
            <div className="stopName" title={e?.stopId}>
              {e?.stopName}
            </div>
            <div className="eta">{e?.eta}</div>
          </AccordionSummary>
          <AccordionDetails>
            <IconButton
              className="directionIconBtn"
              component="a"
              href={e?.latLngUrl}
              target="_blank"
            >
              <DirectionsIcon />
            </IconButton>
          </AccordionDetails>
        </Accordion>
      ))}
    </ListView>
  );
};

const ListView = styled("div")({
  fontSize: "12px",
  width: "100%",
  ".MuiPaper-root": {
    "&:before": {
      backgroundColor: "unset",
    },
    "&.Mui-expanded": {
      backgroundColor: `${primaryColor}17`,
      paddingTop: "4px",
      paddingBottom: "4px",
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
        ".route": {
          ...companyColor,
          width: "10%",
          fontWeight: "900",
        },
        ".stopName": {
          width: "45%",
        },
        ".eta": { width: "45%" },
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
    },
  },
});
