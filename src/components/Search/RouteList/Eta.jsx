import { useParams } from "react-router-dom";
import { useEtas } from "../../../hooks/Etas";
import { phaseEta } from "../../../utils/Utils";

export const Eta = ({ seq, routeObj, slice }) => {
  const { stopId } = useParams();
  const { eta, isEtaLoading } = useEtas({
    seq,
    routeObj,
    interval: 30000,
  });

  // Handle KMB and CTB have different stopId
  const stopIds = eta.map((e) => e.stopId);

  return isEtaLoading ? (
    <div>載入中...</div>
  ) : eta.length !== 0 ? (
    eta
      .map((e, i) => (
        <div key={i} className="eta">
          {phaseEta({ etaStr: e.eta, remark: e.rmk_tc }).etaIntervalStr}
          <div className="extra">
            {stopId && stopIds.includes(stopId) && (
              <div>{phaseEta({ etaStr: e.eta }).time}</div>
            )}
            {stopId && stopIds.includes(stopId) && e.plat && (
              <div>月台{e.plat}</div>
            )}
          </div>
        </div>
      ))
      .slice(0, slice)
  ) : (
    <div>沒有班次</div>
  );
};
