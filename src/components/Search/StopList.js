import { useState, useEffect, useMemo, useContext, useRef } from "react";
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
import { MtrStopEta } from "./MtrStopEta";
import { useCorrectBound } from "../../hooks/Bound";
import { EtaContext } from "../../context/EtaContext";
import { etaExcluded } from "../../constants/Mtr";

export const StopList = ({ route }) => {
  const [stopList, setStopList] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const { dbVersion, location: currentLocation } = useContext(AppContext);
  const { currRoute, nearestStopId, updateNearestStopId } =
    useContext(EtaContext);
  const { correctBound, isBoundLoading } = useCorrectBound({ currRoute });
  const stopListRef = useRef(null);

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

  useEffect(() => {
    if (stopList.length > 0) {
      stopListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [stopList]);

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
              ref={isNearestStop ? stopListRef : null}
            >
              <AccordionSummary className="accordionSummary">
                {currRoute.co[0] === "mtr" ? (
                  <>
                    <div className="seq">{i + 1}.</div>
                    <div className="stop" title={e.stopId}>
                      {e.name.zh}
                    </div>
                    {etaExcluded.includes(currRoute.route) ? (
                      <div className="noEta">沒有相關班次資料</div>
                    ) : (
                      <MtrStopEta
                        seq={i + 1}
                        routeObj={currRoute}
                        stopObj={e}
                        MtrStopEtaRoot={MtrStopEtaRoot}
                      />
                    )}
                  </>
                ) : (
                  <StopEta
                    seq={i + 1}
                    routeObj={currRoute}
                    stopObj={e}
                    bound={correctBound}
                    isBoundLoading={isBoundLoading}
                    StopEtaRoot={StopEtaRoot}
                  />
                )}
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
        display: "flex",
        width: "100%",
        alignItems: "center",
        margin: 0,
        ".seq": {
          width: "5%",
        },
        ".stop": {
          width: "15%",
        },
        ".noEta": {
          textAlign: "center",
          width: "80%",
          padding: "4px 0",
        },
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

const MtrStopEtaRoot = styled("div")({
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  ".etaWrapper": {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "4px 0",
    ".arriveText": {
      width: "20%",
    },
    ".ttntWrapper": {
      width: "65%",
      display: "flex",
      flexDirection: "row",
      ".ttnt": {
        width: "33.33%",
        fontSize: "12px",
      },
    },
  },
});

const StopEtaRoot = styled("div")({
  display: "flex",
  padding: "4px 0",
  width: "100%",
  ".seq": {
    width: "5%",
  },
  ".stop": {
    display: "flex",
    flexGrow: "1",
  },
  ".etas": {
    width: "40%",
    display: "flex",
    flexDirection: "row",
    ".eta": {
      width: "33.33%",
    },
  },
});
