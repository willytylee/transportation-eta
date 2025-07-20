import { useContext } from "react";
import { Accordion, AccordionDetails, styled } from "@mui/material";
import { primaryColor } from "../../constants/Constants";
import { phaseEta } from "../../utils/Utils";
import { DirectionContext } from "../../context/DirectionContext";
import { Walking } from "./Box/Walking";
import { TransportEta } from "./Box/TransportEta";
import { DirectionSummary } from "./DirectionSummary";
import { DirectionStopList } from "./Box/DirectionStopList";

export const DirectionItemAccordion = ({
  i,
  routeListItem,
  isEtaLoading,
  origEta,
  commonStopEta,
}) => {
  const { expanded, updateFitBoundMode, updateExpanded, updateCurrRoute } =
    useContext(DirectionContext);

  const { origin, destination } = routeListItem;
  const {
    routeObj: origRouteObj,
    stopId: origStopId,
    stopSeq: origStopSeq,
    commonStopId: origCommonStopId,
    commonStopSeq: origCommonStopSeq,
    walkDistance: origWalkDistance,
    walkTime: origWalkTime,
    transportTime: origTransportTime,
  } = origin;

  const {
    routeObj: destRouteObj,
    stopId: destStopId,
    stopSeq: destStopSeq,
    commonStopId: destCommonStopId,
    commonStopSeq: destCommonStopSeq,
    walkDistance: destWalkDistance,
    walkTime: destWalkTime,
    transportTime: destTransportTime,
  } = destination;

  const origWaitingTime = phaseEta({
    etaStr: origEta[0]?.eta,
  }).waitingMins;
  const origArriveTime = phaseEta({
    etaStr: origEta[0]?.eta,
  }).time;
  const destArriveTime = phaseEta({
    etaStr: commonStopEta[0]?.eta,
  }).time;

  const isMultiRoute =
    origCommonStopId &&
    origCommonStopSeq &&
    destCommonStopId &&
    destCommonStopSeq;

  const handleAccordionChange = (panel, currRoute) => (e, isExpanded) => {
    updateExpanded(isExpanded ? panel : false);
    updateCurrRoute(currRoute);
  };

  return (
    <AccordionRoot
      expanded={expanded === `panel${i}`}
      onChange={handleAccordionChange(`panel${i}`, routeListItem)}
    >
      <DirectionSummary
        eta={origEta}
        routeObj={{ origRouteObj, destRouteObj }}
        transportTime={{ origTransportTime, destTransportTime }}
        origStopId={origStopId}
        origWalkDistance={destWalkDistance}
        origWalkTime={origWalkTime}
        destWalkDistance={destWalkDistance}
        destWalkTime={destWalkTime}
        isEtaLoading={isEtaLoading}
        waitingTime={origWaitingTime}
        arriveTime={origArriveTime}
        isMultiRoute={isMultiRoute}
      />
      <AccordionDetails className="AccordionDetails">
        <div className="detail">
          <Walking
            walkDistance={origWalkDistance}
            stopId={origStopId}
            walkTime={origWalkTime}
            updateFitBoundMode={updateFitBoundMode}
            fitBoundMode="startWalk"
          />
          <TransportEta
            eta={origEta}
            routeObj={origRouteObj}
            stopSeq={origStopSeq}
            arriveTime={origArriveTime}
            walkTime={origWalkTime}
            updateFitBoundMode={updateFitBoundMode}
            fitBoundMode="transportEtaA"
          />
          {!isMultiRoute && (
            <DirectionStopList
              routeObj={origRouteObj}
              startStopSeq={origStopSeq}
              startStopId={origStopId}
              endStopId={destStopId}
              endStopSeq={destStopSeq}
              transportTime={origTransportTime}
              updateFitBoundMode={updateFitBoundMode}
              fitBoundMode="transportEtaSingle"
            />
          )}

          {isMultiRoute && (
            <>
              <DirectionStopList
                routeObj={origRouteObj}
                startStopId={origStopId}
                startStopSeq={origStopSeq}
                endStopId={origCommonStopId}
                endStopSeq={origCommonStopSeq}
                transportTime={origTransportTime}
                updateFitBoundMode={updateFitBoundMode}
                fitBoundMode="transportRouteA"
              />
              <TransportEta
                eta={commonStopEta}
                routeObj={destRouteObj}
                arriveTime={destArriveTime}
                updateFitBoundMode={updateFitBoundMode}
                fitBoundMode="transportEtaB"
              />
              <DirectionStopList
                routeObj={destRouteObj}
                startStopId={destCommonStopId}
                startStopSeq={destCommonStopSeq}
                endStopId={destStopId}
                endStopSeq={destStopSeq}
                transportTime={destTransportTime}
                updateFitBoundMode={updateFitBoundMode}
                fitBoundMode="transportRouteB"
              />
            </>
          )}
          <Walking
            walkDistance={destWalkDistance}
            walkTime={destWalkTime}
            updateFitBoundMode={updateFitBoundMode}
            fitBoundMode="endWalk"
          />
        </div>
      </AccordionDetails>
    </AccordionRoot>
  );
};

const AccordionRoot = styled(Accordion)({
  width: "100%",
  boxShadow: "none",
  padding: "8px 0",
  borderRadius: 0,
  borderBottom: "1px solid lightgrey",
  "&:before": {
    backgroundColor: "unset",
  },
  "&.Mui-expanded": {
    backgroundColor: `${primaryColor}17`,
    margin: 0,
  },
  ".MuiAccordionSummary-root": {
    minHeight: 0,
    "&.Mui-expanded": {
      minHeight: 0,
    },
    ".MuiAccordionSummary-content": {
      display: "flex",
      margin: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
  },

  ".AccordionDetails": {
    padding: "8px",
    ".detail": {
      display: "flex",
      alignItems: "flex-start",
      flexWrap: "wrap",
      flexDirection: "column",
      gap: "4px",
      ".detailItem": {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "8px",
        background: "white",
        borderRadius: "4px",
        alignItems: "center",
        border: "none",
        svg: { fontSize: "14px" },
        lineHeight: "normal",
        fontSize: "12px",
      },
    },
  },
});
