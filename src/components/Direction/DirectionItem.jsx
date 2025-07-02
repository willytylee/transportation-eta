import { useContext } from "react";
import { DirectionContext } from "../../context/DirectionContext";
import { useEtas } from "../../hooks/Etas";
import { DirectionItemAccordion } from "./DirectionItemAccordion";

export const DirectionItem = ({ routeListItem, i, handleChange }) => {
  const { displayMode } = useContext(DirectionContext);
  const { eta: origEta, isOrigEtaLoading } = useEtas({
    seq: routeListItem.origin.stopSeq,
    routeObj: routeListItem.origin.routeObj,
    interval: 60000,
  });

  const { eta: destEta, isDestEtaLoading } = useEtas({
    seq: routeListItem.destination.stopSeq,
    routeObj: routeListItem.destination.routeObj,
    interval: 60000,
  });

  const isMultiRoute =
    !!routeListItem &&
    routeListItem.common &&
    Object.keys(routeListItem.common).length > 0;

  return (
    (displayMode === "顯示所有路線" ||
      (displayMode === "只顯示現時有班次路線" && isMultiRoute
        ? origEta.length > 0 && destEta.length > 0
        : origEta.length > 0)) && (
      <DirectionItemAccordion
        handleChange={handleChange}
        i={i}
        routeListItem={routeListItem}
        eta={[origEta, destEta]}
        isEtaLoading={isOrigEtaLoading && isDestEtaLoading}
      />
    )
  );
};
