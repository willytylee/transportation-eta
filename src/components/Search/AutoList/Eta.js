import React from "react";
import { useCorrectBound } from "../../../hooks/Bound";
import { useEtas } from "../../../hooks/Etas";
import { etaTimeConverter } from "../../../Utils";

export const Eta = ({ routeObj }) => {
  const { correctBound, isBoundLoading } = useCorrectBound({
    routeObj,
  });

  const { eta, isEtaLoading } = useEtas({
    seq: routeObj.nearByStopSeq,
    bound: correctBound,
    routeObj,
    isBoundLoading,
  });

  return isEtaLoading || isBoundLoading ? (
    <div>載入中</div>
  ) : eta.length !== 0 ? (
    eta
      .map((e, i) => (
        <div key={i} title={e.seq}>
          {etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr}
        </div>
      ))
      .slice(0, 1)
  ) : (
    <div>沒有班次</div>
  );
};
