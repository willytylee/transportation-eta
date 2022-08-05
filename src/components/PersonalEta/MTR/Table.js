import React from "react";
import { styled } from "@mui/material";
import { isValEqualInArr } from "../../../Utils";

export const Table = ({ data, dir }) => {
  return (
    <>
      {data[dir]?.dest && data.direction.includes(dir) && (
        <MTRTable>
          <div className="arriveText">
            → <span className="dest">{data[dir].dest}</span>
          </div>
          <div className="ttntWrapper">
            {isValEqualInArr(data[dir].ttnts) &&
            data[dir].ttnts[0] == "沒有班次"
              ? "已停站"
              : data[dir].ttnts
                  .map((e, j) => (
                    <div className="ttnt" key={j}>
                      {e}
                    </div>
                  ))
                  .slice(0, 3)}
          </div>
        </MTRTable>
      )}
    </>
  );
};

const MTRTable = styled("div")({
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
    width: "60%",
    display: "flex",
    flexDirection: "row",
    ".ttnt": {
      width: "33.33%",
      fontSize: "12px",
    },
  },
});
