import { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, styled, IconButton } from "@mui/material";
import { Directions as DirectionsIcon } from "@mui/icons-material";
import { handleTableResult } from "../../../Utils/Utils";
import { companyColor, primaryColor } from "../../../constants/Constants";

export const Table = ({ section, sectionData }) => {
  const [expanded, setExpanded] = useState(false);

  const result = handleTableResult(sectionData);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <TableView>
      {result.map((e, i) => (
        <Accordion key={i} expanded={expanded === `panel${i}`} onChange={handleChange(`panel${i}`)}>
          <AccordionSummary className="accordionSummary">
            <div className="route">
              <span className={`${e.co}`}>{e.route}</span>
            </div>
            <div className={`stopName ${e.co === "error" ? "error" : ""}`} title={e?.stopId}>
              {e.stopName}
            </div>
            {e.etas.map((eta, j) => (
              <div key={j} className="eta">
                {eta}
              </div>
            ))}
          </AccordionSummary>
          <AccordionDetails>
            <IconButton className="iconBtn directionIconBtn" component="a" href={e.latLngUrl} target="_blank">
              <DirectionsIcon />
              <div>規劃路線</div>
            </IconButton>
          </AccordionDetails>
        </Accordion>
      ))}
    </TableView>
  );
};

const TableView = styled("div")({
  fontSize: "12px",
  width: "100%",
  ".error": {
    color: "#808080",
    textDecoration: "line-through",
  },
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
      ".iconBtn": {
        flexDirection: "column",
        fontSize: "10px",
        height: "58px",
        width: "58px",
      },
    },
  },
});
