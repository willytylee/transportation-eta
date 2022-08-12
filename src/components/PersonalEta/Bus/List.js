import { useState, useEffect } from "react";
import { styled } from "@mui/material";
import { etaTimeConverter, sortEtaObj } from "../../../Utils";
import { companyColor } from "../../../constants/Constants";

export const List = ({ sectionData }) => {
  const [finalResult, setFinalResult] = useState([]);
  useEffect(() => {
    let result = [];

    sectionData.forEach((e) => {
      const { co, etas, route, stopName, stopId, location } = e;

      let eta;

      if (etas) {
        if (etas.length === 0) {
          result.push({
            co,
            route,
            eta: "",
            stopName,
            stopId,
            latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${location?.lat},${location?.lng}`,
          });
        } else {
          etas.forEach((e) => {
            eta = e.eta ? e.eta : "";
            const { rmk_tc } = e;
            result.push({
              co,
              route,
              eta,
              rmk_tc,
              stopName,
              stopId,
              latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${location?.lat},${location?.lng}`,
            });
          });
        }
      }
    });

    // Sort the eta for same section

    result = sortEtaObj(result);

    result.forEach((e, i) => {
      const { eta, rmk_tc } = e;
      result[i].eta = etaTimeConverter(eta, rmk_tc).etaIntervalStr;
    });

    if (sectionData.length >= 3) {
      result = result.slice(0, sectionData.length);
    } else {
      result = result.slice(0, 3);
    }

    setFinalResult(result);
  }, [sectionData]);

  return (
    <ListView>
      {finalResult.map((e, i) => {
        return (
          <div key={i} className="etaWrapper">
            <div className="route">
              <span className={`${e.co}`}>{e?.route}</span>
            </div>
            <div className="stopName">
              <a href={e?.latLngUrl} title={e?.stopId}>
                {e?.stopName}
              </a>
            </div>
            <div className="eta">{e?.eta}</div>
          </div>
        );
      })}
    </ListView>
  );
};

const ListView = styled("div")({
  fontSize: "12px",
  width: "100%",
  ".etaWrapper": {
    display: "flex",
    textAlign: "left",
    margin: "4px 0",
    ".route": {
      ...companyColor,
      width: "10%",
      fontWeight: "900",
      letterSpacing: "-0.5px",
    },
    ".stopName": {
      width: "45%",
    },
    ".eta": { width: "45%" },
  },
});
