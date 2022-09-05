import _ from "lodash";
import { parseMtrEtas } from "../../Utils/Utils";
import { useEtas } from "../../hooks/Etas";
import { etaExcluded, stationMap } from "../../constants/Mtr";

export const MtrStopEta = ({ seq, stopObj, routeObj, MtrStopEtaRoot }) => {
  const { eta, isEtaLoading } = useEtas({
    seq,
    routeObj,
  });

  const groupedEtas = _(eta)
    .groupBy((x) => x.dest)
    .map((value, key) => ({
      dest: key,
      etas: value,
    }))
    .value()
    .sort((a, b) => (a.etas[0].bound > b.etas[0].bound ? 1 : -1));

  return (
    <MtrStopEtaRoot>
      <div className="seq">{seq}.</div>
      <div className="stop">{stopObj.name.zh}</div>
      {etaExcluded.includes(routeObj.route) ? (
        <div className="noEta">沒有相關班次資料</div>
      ) : (
        <div className="etasWrapper">
          {groupedEtas.length > 0 ? (
            groupedEtas.map((destEtas, i) => (
              <div key={i} className="etaWrapper">
                <div className="arriveText">
                  → <span className="dest">{stationMap[destEtas.dest]}</span>
                </div>
                <div className="ttntWrapper">
                  {destEtas.etas
                    .map((_eta, j) => (
                      <div key={j} className="ttnt">
                        {parseMtrEtas(_eta)}
                      </div>
                    ))
                    .slice(0, 3)}
                </div>
              </div>
            ))
          ) : (
            <div className="etaWrapper">
              <div> </div>
              <div className="noEta2">
                {isEtaLoading ? "載入中..." : "沒有相關班次資料"}
              </div>
            </div>
          )}
        </div>
      )}
    </MtrStopEtaRoot>
  );
};
