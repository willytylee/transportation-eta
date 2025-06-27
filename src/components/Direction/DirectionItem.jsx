import { useContext } from "react";
import { styled } from "@mui/material";
import { DirectionContext } from "../../context/DirectionContext";
import { useEtas } from "../../hooks/Etas";
import { DirectionItemAccordion } from "./DirectionItemAccordion";

export const DirectionItem = ({ e, i, handleChange }) => {
  const { displayMode } = useContext(DirectionContext);
  const { eta, isEtaLoading } = useEtas({
    seq: e.nearbyOrigStopSeq,
    routeObj: e,
    interval: 10000,
  });

  return (
    <>
      {displayMode === "只顯示現時有班次路線" && eta.length > 0 && (
        <DirectionItemRoot>
          <DirectionItemAccordion
            handleChange={handleChange}
            i={i}
            e={e}
            eta={eta}
            isEtaLoading={isEtaLoading}
          />
        </DirectionItemRoot>
      )}
      {displayMode === "顯示所有路線" && (
        <DirectionItemRoot>
          <DirectionItemAccordion
            handleChange={handleChange}
            i={i}
            e={e}
            eta={eta}
            isEtaLoading={isEtaLoading}
          />
        </DirectionItemRoot>
      )}
    </>
  );
};

const DirectionItemRoot = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  borderBottom: "1px solid lightgrey",
});
