import { styled } from "@mui/material";
import { Buses } from "./Bus/Buses.js";
import { Mtrs } from "./Mtr/Mtrs.js";

export const Section = ({ category }) => {
  return (
    <SectionRoot>
      <div>{category.title}</div>
      {category.data.map((e, i) => {
        const firstCo = e[0].co;
        if (
          firstCo === "ctb" ||
          firstCo === "kmb" ||
          firstCo === "nwfb" ||
          firstCo === "gmb"
        ) {
          return <Buses key={i} section={e} />;
        } else if (firstCo === "mtr") {
          return <Mtrs key={i} section={e} />;
        }
        return null;
      })}
    </SectionRoot>
  );
};

const SectionRoot = styled("div")({
  padding: "10px",
  borderRadius: "2px",
  borderBottom: "1px solid lightgrey",
});
