import { Buses } from "./Bus/Buses.js";
import { MTRs } from "./MTR/MTRs.js";

export const Section = ({ category, gStopList }) => {
  return (
    <div className="section">
      <div>{category.title}</div>
      {category.data.map((e, i) => {
        const firstCo = e[0].co;
        if (firstCo === "citybus" || firstCo === "kmb" || firstCo === "nwfb") {
          return <Buses key={i} section={e} gStopList={gStopList} />;
        } else {
          return <MTRs key={i} section={e} gStopList={gStopList} />;
        }
      })}
    </div>
  );
};
