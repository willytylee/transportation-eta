import { styled } from "@mui/material";
import { stationMap } from "../../../constants/Mtr";
import { parseMtrEtas } from "../../../Utils/Utils";

export const Table = ({ etasDetail }) =>
  etasDetail.length === 0
    ? "沒有班次"
    : etasDetail.map((etas) => (
        <MtrTable>
          <div className="ttntWrapper">
            {etas
              .map((e, j) => (
                <div className="ttnt" key={j}>
                  <div className="dest">{stationMap[e.dest]}</div>
                  <div className="minutes">{parseMtrEtas(e)}</div>
                </div>
              ))
              .slice(0, 4)}
          </div>
        </MtrTable>
      ));

const MtrTable = styled("div")({
  fontSize: "12px",
  width: "95%",
  padding: "2px 0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  ".arriveText": {
    width: "47%",
    ".dest": {
      fontWeight: "900",
    },
  },
  ".ttntWrapper": {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    ".ttnt": {
      display: "flex",
      flexDirection: "column",
      width: "25%",
      fontSize: "12px",
    },
  },
});
