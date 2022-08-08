import { styled } from "@mui/material";
import { etaTimeConverter } from "../../Utils";
import { useEtas } from "../../hooks/Etas";

export const StopEta = ({
  seq,
  stopObj: {
    name,
    stopId,
    location: { lat, lng },
  },
  routeObj,
  isNearestStop,
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
    <StopEtaRoot className={isNearestStop ? "highlighted" : ""}>
      <div className="seq">{seq}</div>
      <div className="stop">
        <a
          href={`https://www.google.com.hk/maps/search/?api=1&query=${lat},${lng}`}
          title={stopId}
        >
          {name.zh}
        </a>
      </div>
      <div className="etas">
        {isEtaLoading || isBoundLoading ? (
          <div className="eta">載入中</div>
        ) : eta.length !== 0 ? (
          eta.map((e, i) => (
            <div key={i} className="eta" title={e.seq}>
              {etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr}
            </div>
          ))
        ) : (
          <div>沒有班次</div>
        )}
      </div>
    </StopEtaRoot>
  );
};

const StopEtaRoot = styled("div")({
  display: "flex",
  padding: "3px",
  "&.highlighted": { backgroundColor: "lightblue" },
  ".seq": {
    width: "5%",
  },
  ".stop": {
    width: "55%",
    textDecoration: "underline",
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
