import { styled } from "@mui/material";
import { stationMap } from "../../../constants/Mtr";

export const Table = ({ data, dests }) => {
  const detail = data[dests];

  return (
    detail?.dest &&
    data.dests.includes(dests) && (
      <MtrTable>
        <div className="arriveText">
          → <span className="dest">{stationMap[detail.dest]}</span>
        </div>
        <div className="ttntWrapper">
          {detail.ttnts === ""
            ? "已停駛"
            : detail.ttnts
                .map((e, j) => (
                  <div className="ttnt" key={j}>
                    {e}
                  </div>
                ))
                .slice(0, 3)}
        </div>
      </MtrTable>
    )
  );
};

const MtrTable = styled("div")({
  fontSize: "12px",
  width: "100%",
  padding: "2px 0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  ".arriveText": {
    width: "47%",
    ".dest": {
      fontWeight: "900",
    },
  },
  ".ttntWrapper": {
    width: "53%",
    display: "flex",
    flexDirection: "row",
    ".ttnt": {
      width: "33.33%",
      fontSize: "12px",
    },
  },
});
