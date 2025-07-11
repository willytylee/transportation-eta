import { useParams } from "react-router-dom";
import { useEtas } from "../../../hooks/Etas";
import { phaseEta } from "../../../Utils/Utils";

export const Eta = ({ seq, routeObj, slice }) => {
  const { stopId } = useParams();
  const { eta, isEtaLoading } = useEtas({
    seq,
    routeObj,
    interval: 30000,
  });

  return isEtaLoading ? (
    <div>載入中...</div>
  ) : eta.length !== 0 ? (
    eta
      .map((e, i) => (
        <div key={i} className="eta">
          {phaseEta({ etaStr: e.eta, remark: e.rmk_tc }).etaIntervalStr}
          {stopId && stopId === e.stopId && (
            <div>{phaseEta({ etaStr: e.eta }).time}</div>
          )}
          {stopId && stopId === e.stopId && e.plat && <div>{e.plat}號月台</div>}
        </div>
      ))
      .slice(0, slice)
  ) : (
    <div>沒有班次</div>
  );
};
