import React from "react";
import { styled } from "@mui/material";
import { isValEqualInArr } from "../../../Utils";

export const Table = ({ data, dir }) => {
  const detail = data[dir];
  return (
    <>
      {detail?.dest && data.direction.includes(dir) && (
        <MtrTable>
          <div className="arriveText">
            → <span className="dest">{detail.dest}</span>
          </div>
          <div className="ttntWrapper">
            {isValEqualInArr(detail.ttnts) && detail.ttnts[0] == "沒有班次"
              ? "已停站"
              : detail.ttnts
                  .map((e, j) => (
                    <div className="ttnt" key={j}>
                      {e}
                    </div>
                  ))
                  .slice(0, 3)}
          </div>
        </MtrTable>
      )}
    </>
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
    width: "20%",
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
