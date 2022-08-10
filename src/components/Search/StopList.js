import { useState, useEffect, useMemo, useContext } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  IconButton,
} from "@mui/material";
import { Directions as DirectionsIcon } from "@mui/icons-material";
import { getPreciseDistance } from "geolib";
import { getCoPriorityId, getLocalStorage } from "../../Utils";
import { AppContext } from "../../context/AppContext";
import { StopEta } from "./StopEta";
import { useCorrectBound } from "../../hooks/Bound";
import { EtaContext } from "../../context/EtaContext";

export const StopList = ({ route }) => {
  const [stopList, setStopList] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const { dbVersion, location: currentLocation } = useContext(AppContext);
  const { currRoute, nearestStopId, updateNearestStopId } =
    useContext(EtaContext);
  const { correctBound, isBoundLoading } = useCorrectBound({ currRoute });

  const gStopList = useMemo(() => getLocalStorage("stopList"), [dbVersion]);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  // When the route number is changed
  useEffect(() => {
    setStopList([]);
  }, [route]);

  // When the currRoute in AppContext changed
  useEffect(() => {
    if (Object.keys(currRoute).length !== 0) {
      // Find the company Id which appear in currRoute.stops

      const companyId = getCoPriorityId(currRoute);
      const expandStopIdArr = currRoute.stops[companyId];

      setStopList(expandStopIdArr.map((e) => ({ ...gStopList[e], stopId: e })));

      updateNearestStopId(
        expandStopIdArr.reduce((prev, curr) => {
          const prevDistance = getPreciseDistance(
            {
              latitude: gStopList[prev].location.lat,
              longitude: gStopList[prev].location.lng,
            },
            {
              latitude: currentLocation.lat,
              longitude: currentLocation.lng,
            }
          );
          const currDistance = getPreciseDistance(
            {
              latitude: gStopList[curr].location.lat,
              longitude: gStopList[curr].location.lng,
            },
            {
              latitude: currentLocation.lat,
              longitude: currentLocation.lng,
            }
          );

          if (prevDistance < currDistance) {
            return prev;
          }
          return curr;
        })
      );
    }
  }, [currRoute]);

  return (
    <StopListRoot>
      {Object.keys(currRoute).length !== 0 &&
        stopList?.map((e, i) => {
          const isNearestStop = gStopList[nearestStopId]?.name === e.name;
          const {
            location: { lat, lng },
          } = e;
          return (
            <Accordion
              expanded={expanded === `panel${i}`}
              onChange={handleChange(`panel${i}`)}
              key={i}
              className={isNearestStop ? "highlighted" : ""}
            >
              <AccordionSummary className="accordionSummary">
                <StopEta
                  seq={i + 1}
                  routeObj={currRoute}
                  stopObj={e}
                  bound={correctBound}
                  isBoundLoading={isBoundLoading}
                />
              </AccordionSummary>
              <AccordionDetails>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`}
                >
                  <IconButton className="directionIconBtn">
                    <DirectionsIcon />
                  </IconButton>
                </a>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </StopListRoot>
  );
};

const StopListRoot = styled("div")({
  width: "100%",
  ".MuiPaper-root": {
    "&:before": {
      backgroundColor: "unset",
    },
    "&.Mui-expanded": {
      backgroundColor: "#2f305c17",
      padding: "4px 6px 8px",
    },
    "&.highlighted": { backgroundColor: "lightblue" },
    padding: "0 6px",
    borderBottom: "0.1px solid #eaeaea",
    margin: "0 !important",
    boxShadow: "unset",
    ".accordionSummary": {
      minHeight: "unset",
      padding: "0",
      ".MuiAccordionSummary-content": {
        margin: 0,
      },
    },
    ".MuiCollapse-root": {
      ".MuiAccordionDetails-root": {
        padding: "0px 16px 0px 4.5%",
        ".directionIconBtn": {
          background: "white",
        },
      },
    },
  },
});
