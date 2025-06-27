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
import { handleTableResult } from "../../Utils/Utils";
import { companyColor, primaryColor } from "../../constants/Constants";
import { routeMap, mtrLineColor, stationMap } from "../../constants/Mtr";

export const Table = ({ etaResult }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const result = handleTableResult(etaResult);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <TableView>
      {result.map((e, i) => (
        <Accordion
          key={i}
          expanded={expanded === `panel${i}`}
          onChange={handleChange(`panel${i}`)}
        >
          <AccordionSummary className="accordionSummary">
            <div className="route">
              {e.co === "mtr" ? (
                <span className={`${e.route}`}>{routeMap[e?.route]}</span>
              ) : (
                <>
                  {e.co === "error" && <PriorityHighIcon fontSize="small" />}
                  <span className={`${e.co}`}>{e?.route}</span>
                </>
              )}
            </div>
            <div className={`stopName ${e.co}`}>{e.stopName}</div>
            {e.etas.map((eta, j) => (
              <div key={j} className="eta">
                {eta.minutes} <br />
                {eta.dest && `(${stationMap[eta?.dest]})`}
              </div>
            ))}
          </AccordionSummary>
          <AccordionDetails>
            <IconButton
              className="iconBtn directionIconBtn"
              component="a"
              href={e.latLngUrl}
              target="_blank"
            >
              <DirectionsIcon />
              <div>規劃路線</div>
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
    </TableView>
  );
};

const TableView = styled("div")({
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
          ...mtrLineColor,
          width: "13%",
          fontWeight: "900",
          display: "flex",
          alignItems: "center",
        },
        ".stopName": {
          width: "45%",
        },
        ".eta": { width: "14%" },
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
