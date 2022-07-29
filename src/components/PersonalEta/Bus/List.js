import { styled } from "@mui/material";
import { etaTimeConverter, sortEtaObj } from "../../../Utils";

export const List = ({ sectionData }) => {
  let result = [];

  sectionData.forEach((e) => {
    const {
      etas,
      route,
      stopName,
      location: { lat, lng },
      stopId,
    } = e;

    let eta;

    if (etas.length === 0) {
      result.push({
        route,
        eta: "",
        stopName,
        stopId,
        latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${lat},${lng}`,
      });
    } else {
      etas.forEach((e) => {
        eta = e.eta ? e.eta : "";
        const { rmk_tc } = e;
        result.push({
          route,
          eta,
          rmk_tc,
          stopName,
          stopId,
          latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${lat},${lng}`,
        });
      });
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

  return (
    <ListView>
      {result.map((e, i) => {
        return (
          <div key={i} className="etaWrapper">
            <div className="route">{e?.route}</div>
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
      width: "10%",
      fontWeight: "900",
    },
    ".stopName": {
      width: "45%",
    },
    ".eta": { width: "45%" },
  },
});
