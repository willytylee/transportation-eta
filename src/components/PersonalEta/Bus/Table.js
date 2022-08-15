import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  IconButton,
} from "@mui/material";
import {
  Directions as DirectionsIcon,
  Map as MapIcon,
} from "@mui/icons-material";
import { etaTimeConverter } from "../../../Utils";
import { companyColor } from "../../../constants/Constants";

export const Table = ({ sectionData }) => {
  const [expanded, setExpanded] = useState(false);

  const result = sectionData.map((e) => {
    const {
      co,
      etas,
      route,
      stopName,
      location: { lat, lng },
    } = e;

    return {
      co,
      route,
      etas:
        etas.length === 0
          ? ["沒有班次"]
          : etas
              .map((e) => {
                return etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr;
              })
              .slice(0, 3),
      stopName,
      latLngUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`,
    };
  });

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <TableView>
      {result.map((e, i) => {
        return (
          <Accordion
            key={i}
            expanded={expanded === `panel${i}`}
            onChange={handleChange(`panel${i}`)}
          >
            <AccordionSummary className="accordionSummary">
              <div className="route">
                <span className={`${e.co}`}>{e.route}</span>
              </div>
              <div className="stopName" title={e?.stopId}>
                {e.stopName}
              </div>
              {e.etas.map((e, j) => {
                return (
                  <div key={j} className="eta">
                    {e}
                  </div>
                );
              })}
            </AccordionSummary>
            <AccordionDetails>
              <IconButton
                className="directionIconBtn"
                component={"a"}
                href={e.latLngUrl}
                target="_blank"
              >
                <DirectionsIcon />
              </IconButton>
              {/* <IconButton
                className="mapIconBtn"
                onClick={() =>
                  handleMapIconOnClick({
                    mapLocation: { lat, lng },
                    mapStopIdx: i,
                  })
                }
              >
                <MapIcon />
              </IconButton> */}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </TableView>
  );
};

const TableView = styled("div")({
  fontSize: "12px",
  width: "100%",
  ".MuiPaper-root": {
    "&:before": {
      backgroundColor: "unset",
    },
    "&.Mui-expanded": {
      backgroundColor: "#2f305c17",
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
          letterSpacing: "-0.5px",
        },
        ".stopName": {
          width: "45%",
        },
        ".eta": { width: "15%" },
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
