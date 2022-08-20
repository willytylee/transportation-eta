import { parseMtrEtas } from "../../Utils";
import { useEtas } from "../../hooks/Etas";
import { etaExcluded, stationDestMap } from "../../constants/Mtr";

export const MtrStopEta = ({ seq, stopObj, routeObj, MtrStopEtaRoot }) => {
  const { eta, isEtaLoading } = useEtas({
    seq,
    routeObj,
    isBoundLoading: false,
  });

  const upEta = eta.filter((e) => e.bound === "up");
  const downEta = eta.filter((e) => e.bound === "down");

  const bound = routeObj.bound.mtr;
  const prefix = bound.includes("-") ? `${bound.split("-")[0]}_` : "";

  console.log(stopObj);
  return (
    <MtrStopEtaRoot>
      <div className="seq">{seq}.</div>
      <div className="stop">{stopObj.name.zh}</div>
      {etaExcluded.includes(routeObj.route) ? (
        <div className="noEta">沒有相關班次資料</div>
      ) : (
        <>
          <div class="etasWrapper">
            <div className="etaWrapper">
              <div className="arriveText">
                →{" "}
                <span className="dest">
                  {stationDestMap[routeObj.route][`${prefix}UP`]}
                </span>
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
                →{" "}
                <span className="dest">
                  {stationDestMap[routeObj.route][`${prefix}DOWN`]}
                </span>
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
          </div>
        </>
      )}
    </MtrStopEtaRoot>
  );
};
