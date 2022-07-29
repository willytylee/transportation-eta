import React from "react";
import { styled } from "@mui/material";

export const Table = ({ data, dir }) => {
  return (
    <MTRTable>
      {data[dir]?.dest && data.direction.includes(dir) && (
        <div className="etaWrapper">
          <div className="arriveText">
            → <span className="dest">{data[dir].dest}</span> 到站時間:
          </div>
          <div class="ttntWrapper">
            {data[dir].ttnts
              .map((e, j) => (
                <div className="ttnt" key={j}>
                  {e}
                </div>
              ))
              .slice(0, 3)}
          </div>
        </div>
      )}
    </MTRTable>
  );
};

const MTRTable = styled("div")({
  fontSize: "12px",
  width: "100%",
  padding: "2px 0",
  ".etaWrapper": {
    display: "flex",
    flexDirection: "row",
    ".arriveText": {
      width: "40%",
      ".dest": {
        fontWeight: "900",
      },
    },
    ".ttntWrapper": {
      width: "60%",
      display: "flex",
      flexDirection: "row",
      ".ttnt": {
        width: "33.33%",
        fontSize: "12px",
      },
    },
  },
});
