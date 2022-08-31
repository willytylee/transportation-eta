import _ from "lodash";
import { parseMtrEtas } from "../../Utils/Utils";
import { useEtas } from "../../hooks/Etas";
import { etaExcluded, stationMap } from "../../constants/Mtr";

export const MtrStopEta = ({ seq, stopObj, routeObj, MtrStopEtaRoot }) => {
  const { eta, isEtaLoading } = useEtas({
    seq,
    routeObj,
    isBoundLoading: false,
  });

  const groupedEtas = _(eta)
    .groupBy((x) => x.dest)
    .value();

  return (
    <MtrStopEtaRoot>
      <div className="seq">{seq}.</div>
      <div className="stop">{stopObj.name.zh}</div>
      {etaExcluded.includes(routeObj.route) ? (
        <div className="noEta">沒有相關班次資料</div>
      ) : (
        <div className="etasWrapper">
          {Object.keys(groupedEtas).map((destKey) => (
            <div className="etaWrapper">
              <div className="arriveText">
                → <span className="dest">{stationMap[destKey]}</span>
              </div>
              <div className="ttntWrapper">
                {isEtaLoading ? (
                  <div className="ttnt">載入中</div>
                ) : (
                  groupedEtas[destKey]
                    .map((e, i) => (
                      <div key={i} className="ttnt" title={e.seq}>
                        {parseMtrEtas(e)}
                      </div>
                    ))
                    .slice(0, 3)
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </MtrStopEtaRoot>
  );
};
