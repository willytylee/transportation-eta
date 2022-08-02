import { useState, useEffect } from "react";
import { styled } from "@mui/material";
import { etaTimeConverter } from "../../Utils";
import { fetchEtas } from "../../fetch/transports";

export const StopEta = ({
  seq,
  stopObj: {
    name,
    stopId,
    location: { lat, lng },
  },
  routeObj,
  isClosestStop,
}) => {
  const [eta, setEta] = useState([{ eta: "loading" }]);

  useEffect(() => {
    setEta([{ eta: "loading" }]);
    const intervalContent = () => {
      fetchEtas({
        ...routeObj,
        seq: parseInt(seq, 10),
      }).then((response) => setEta(response.slice(0, 3)));
    };

    intervalContent();

    const interval = setInterval(intervalContent, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [routeObj, seq]);

  return (
    <StopEtaRoot className={isClosestStop ? "highlighted" : ""}>
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
        {eta.length !== 0 ? (
          eta.map((e, i) => {
            return (
              <div key={i} className="eta" title={e.seq}>
                {etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr}
                {/* <br />
              {etaTimeConverter(e.eta, e.rmk_tc).remarkStr} */}
              </div>
            );
          })
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
