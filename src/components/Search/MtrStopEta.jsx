import _ from "lodash";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material";
import { phaseEta } from "../../utils/Utils";
import { useEtas } from "../../hooks/Etas";
import { stationMap } from "../../constants/Mtr";

export const MtrStopEta = ({ seq, stopObj, routeObj, childStyles }) => {
  const { stopId } = useParams();
  const { eta, isEtaLoading } = useEtas({
    seq,
    routeObj,
    interval: 30000,
  });

  const groupedEtas = _(eta)
    .groupBy((x) => x.dest)
    .map((value, key) => ({
      dest: key,
      etas: value,
    }))
    .value()
    .sort((a, b) => (a.dest > b.dest ? 1 : -1));

  return (
    <MtrStopEtaRoot childStyles={childStyles}>
      <div className="seq">{seq}.</div>
      <div className="stop">{stopObj.name.zh}</div>

      <div className="etasWrapper">
        {groupedEtas.length > 0 ? (
          groupedEtas.map((destEtas, i) => (
            <div key={i} className="etaWrapper">
              <div className="arriveText">
                →{" "}
                <span className="dest">
                  {" "}
                  {stationMap[destEtas.dest] || destEtas.dest}
                </span>
              </div>
              <div className="ttntWrapper">
                {destEtas.etas
                  .map((_eta, j) => (
                    <div key={j} className="ttnt">
                      {phaseEta({ etaStr: _eta.eta }).etaIntervalStr} <br />
                      {stopId && stopId === _eta.stopId && (
                        <div className="extra">
                          <div>{phaseEta({ etaStr: _eta.eta }).time}</div>
                          <div>月台{_eta.plat}</div>
                        </div>
                      )}
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
              {isEtaLoading ? "載入中..." : "沒有班次"}
            </div>
          </div>
        )}
      </div>
    </MtrStopEtaRoot>
  );
};

const MtrStopEtaRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "childStyles",
})(({ childStyles }) => ({
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  alignItems: "center",
  ".seq": {
    width: "25px",
  },
  ".stop": {
    width: "70px",
  },
  ".noEta": {
    textAlign: "center",
    width: "80%",
    padding: "4px 0",
  },
  ".noEta2": {
    width: "180px",
  },
  ".etasWrapper": {
    width: "100%",
    ".etaWrapper": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: "3px 0",
      alignItems: "center",
      ".arriveText": {
        display: "flex",
        alignItems: "center",
        ".dest": {
          paddingLeft: "4px",
        },
      },
      ".ttntWrapper": {
        width: "180px",
        display: "flex",
        flexDirection: "row",
        gap: "4px",
        alignItems: "flex-start",
        ".ttnt": {
          width: "33.33%",
          fontSize: "12px",
          ".extra": {
            fontSize: "11px",
          },
        },
      },
    },
  },
  ...childStyles,
}));
