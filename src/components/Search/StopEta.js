import { styled } from "@mui/material";
import { etaTimeConverter, parseMtrEtas } from "../../Utils";
import { useEtas } from "../../hooks/Etas";

export const StopEta = ({
  seq,
  stopObj: { name, stopId },
  routeObj,
  bound,
  isBoundLoading,
}) => {
  const { eta, isEtaLoading } = useEtas({
    seq,
    bound,
    routeObj,
    isBoundLoading,
  });

  return (
    <StopEtaRoot>
      <div className="seq">{seq}</div>
      <div className="stop" title={stopId}>
        {name.zh}
      </div>
      <div className="etas">
        {isEtaLoading || isBoundLoading ? (
          <div className="eta">載入中</div>
        ) : eta.length !== 0 ? (
          eta.map((e, i) =>
            e.co === "mtr" ? (
              <div key={i} className="eta" title={e.seq}>
                {parseMtrEtas(e)}
              </div>
            ) : (
              <div key={i} className="eta" title={e.seq}>
                {etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr}
              </div>
            )
          )
        ) : (
          <div>
            {routeObj.co[0] === "mtr" ? "沒有相關班次資料" : "沒有班次"}
          </div>
        )}
      </div>
    </StopEtaRoot>
  );
};

const StopEtaRoot = styled("div")({
  display: "flex",
  padding: "3px 0",
  width: "100%",
  ".seq": {
    width: "5%",
  },
  ".stop": {
    width: "55%",
  },
  ".etas": {
    width: "40%",
    display: "flex",
    flexDirection: "row",
    ".eta": {
      width: "33.33%",
    },
  },
});
