import React from "react";
import { useEtas } from "../../../hooks/Etas";
import { etaTimeConverter } from "../../../Utils/Utils";

export const Eta = ({ seq, routeObj, slice }) => {
  const { eta, isEtaLoading } = useEtas({
    seq,
    routeObj,
  });

  return isEtaLoading ? (
    <div>載入中...</div>
  ) : eta.length !== 0 ? (
    eta
      .map((e, i) => (
        <div key={i} title={e.seq}>
          {etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr}
        </div>
      ))
      .slice(0, slice)
  ) : (
    <div>沒有班次</div>
  );
};
