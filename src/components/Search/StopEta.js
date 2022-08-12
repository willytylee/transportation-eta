import { etaTimeConverter } from "../../Utils";
import { useEtas } from "../../hooks/Etas";

export const StopEta = ({
  seq,
  stopObj: { name, stopId },
  routeObj,
  bound,
  isBoundLoading,
  StopEtaRoot,
}) => {
  const { eta, isEtaLoading } = useEtas({
    seq,
    bound,
    routeObj,
    isBoundLoading,
  });

  return (
    <StopEtaRoot>
      <div className="seq">{seq}.</div>
      <div className="stop" title={stopId}>
        {name.zh}
      </div>
      <div className="etas">
        {isEtaLoading || isBoundLoading ? (
          <div className="eta">載入中</div>
        ) : eta.length !== 0 ? (
          eta
            .map((e, i) => (
              <div key={i} className="eta" title={e.seq}>
                {etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr}
              </div>
            ))
            .slice(0, 3)
        ) : (
          <div>沒有班次2</div>
        )}
      </div>
    </StopEtaRoot>
  );
};
