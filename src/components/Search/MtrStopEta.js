import { parseMtrEtas } from "../../Utils";
import { useEtas } from "../../hooks/Etas";
import { stationDestMap } from "../../constants/Mtr";

export const MtrStopEta = ({ seq, routeObj, MtrStopEtaRoot }) => {
  const { eta, isEtaLoading } = useEtas({
    seq,
    routeObj,
    isBoundLoading: false,
  });

  const upEta = eta.filter((e) => e.bound === "up");
  const downEta = eta.filter((e) => e.bound === "down");

  const bound = routeObj.bound.mtr;
  const prefix = bound.includes("-") ? `${bound.split("-")[0]}_` : "";

  return (
    <MtrStopEtaRoot>
      <div className="etaWrapper">
        <div className="arriveText">
          → {stationDestMap[routeObj.route][`${prefix}UP`]}
        </div>
        <div className="ttntWrapper">
          {isEtaLoading ? (
            <div className="ttnt">載入中</div>
          ) : upEta.length !== 0 ? (
            upEta
              .map((e, i) => (
                <div key={i} className="ttnt" title={e.seq}>
                  {parseMtrEtas(e)}
                </div>
              ))
              .slice(0, 3)
          ) : (
            <div>沒有班次</div>
          )}
        </div>
      </div>
      <div className="etaWrapper">
        <div className="arriveText">
          → {stationDestMap[routeObj.route][`${prefix}DOWN`]}
        </div>
        <div className="ttntWrapper">
          {isEtaLoading ? (
            <div className="ttnt">載入中</div>
          ) : downEta.length !== 0 ? (
            downEta
              .map((e, i) => (
                <div key={i} className="ttnt" title={e.seq}>
                  {parseMtrEtas(e)}
                </div>
              ))
              .slice(0, 3)
          ) : (
            <div>沒有班次</div>
          )}
        </div>
      </div>
    </MtrStopEtaRoot>
  );
};
