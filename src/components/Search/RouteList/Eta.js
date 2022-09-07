import React from "react";
import { useEtas } from "../../../hooks/Etas";
import { etaTimeConverter } from "../../../Utils/Utils";

export const Eta = ({ seq, routeObj, slice, callback }) => {
  const { eta, isEtaLoading } = useEtas({
    seq,
    routeObj,
    callback,
  });

  return isEtaLoading ? (
    <div>載入中...</div>
  ) : eta.length !== 0 ? (
    eta
      .map((e, i) => (
        <div key={i} title={e.seq}>
          {etaTimeConverter({ etaStr: e.eta, remark: e.rmk_tc }).etaIntervalStr}
        </div>
      ))
      .slice(0, slice)
  ) : (
    <div>沒有班次</div>
  );
};
