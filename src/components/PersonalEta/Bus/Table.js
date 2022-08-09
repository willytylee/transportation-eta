import { useContext } from "react";
import { styled } from "@mui/material";
import { EtaContext } from "../../../context/EtaContext";
import { etaTimeConverter } from "../../../Utils";
import { companyColor } from "../../../constants/Constants";

export const Table = ({ sectionData }) => {
  const { sectionCompareMode } = useContext(EtaContext);

  const result = sectionData.map((e) => {
    const {
      co,
      etas,
      route,
      stopName,
      location: { lat, lng },
    } = e;

    return {
      co,
      route,
      etas:
        etas.length === 0
          ? ["沒有班次"]
          : etas
              .map((e) => {
                return etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr;
              })
              .slice(0, 3),
      stopName,
      latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${lat},${lng}`,
    };
  });

  return (
    <TableView>
      {result.map((e, i) => {
        return (
          <div key={i} className="etaWrapper">
            <div className="route">
              <span className={`${e.co}`}>{e.route}</span>
            </div>
            <div className="stopName">
              <a href={e.latLngUrl}>{e.stopName}</a>
            </div>
            {e.etas.map((e, j) => {
              return (
                <div key={j} className="eta">
                  {e}
                </div>
              );
            })}
          </div>
        );
      })}
    </TableView>
  );
};

const TableView = styled("div")({
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
    },
    ".stopName": {
      width: "45%",
    },
    ".eta": { width: "15%" },
  },
});
