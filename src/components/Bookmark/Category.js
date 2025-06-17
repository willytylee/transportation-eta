import { styled } from "@mui/material";
import { Buses } from "./Bus/Buses";
import { Mtrs } from "./Mtr/Mtrs";

export const Category = ({ category, categoryKey }) => (
  <CategoryRoot>
    <div className="categoryName">{category.title}</div>
    {category.data.map((e, i) => {
      const firstCo = e[0]?.co;
      if (firstCo === "ctb" || firstCo === "kmb" || firstCo === "nwfb" || firstCo === "gmb") {
        return <Buses key={i} section={e} sectionKey={i} categoryKey={categoryKey} />;
      } else if (firstCo === "mtr") {
        return <Mtrs key={i} section={e} />;
      }
      return null;
    })}
  </CategoryRoot>
);

const CategoryRoot = styled("div")({
  padding: "10px",
  borderRadius: "2px",
  borderBottom: "1px solid lightgrey",
  background: "white",
  ".categoryName": {
    fontSize: "15px",
  },
});
