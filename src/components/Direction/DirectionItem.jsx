import { useContext } from "react";
import { DirectionContext } from "../../context/DirectionContext";
import { useEtas2 } from "../../hooks/Etas";
import { DirectionItemAccordion } from "./DirectionItemAccordion";

export const DirectionItem = ({ routeListItem, i }) => {
  const { displayMode } = useContext(DirectionContext);

  const { eta: origEta, isEtaLoading: isOrigEtaLoading } = useEtas2({
    seq: routeListItem.origin.stopSeq,
    routeObj: routeListItem.origin.routeObj,
    interval: 60000,
  });

  const { eta: commonStopEta, isEtaLoading: isCommontEtaLoading } = useEtas2({
    seq: routeListItem.destination.commonStopSeq,
    routeObj: routeListItem.destination.routeObj,
    interval: 60000,
  });

  const isMultiRoute =
    !!routeListItem &&
    routeListItem.origin?.commonStopId &&
    routeListItem.origin?.commonStopSeq &&
    routeListItem.destination?.commonStopId &&
    routeListItem.destination?.commonStopSeq;

  return (
    (displayMode === "顯示所有路線" ||
      (displayMode === "只顯示現時有班次路線" && isMultiRoute
        ? origEta.length > 0 && commonStopEta.length > 0
        : origEta.length > 0)) && (
      <DirectionItemAccordion
        i={i}
        routeListItem={routeListItem}
        origEta={origEta}
        commonStopEta={commonStopEta}
        isEtaLoading={isOrigEtaLoading && isCommontEtaLoading}
      />
    )
  );
};
