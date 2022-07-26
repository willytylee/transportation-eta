import { Buses } from "./Bus/Buses.js";
import { MTRs } from "./MTR/MTRs.js";

export const Section = ({ category, gStopList, gRouteList }) => {
  return (
    <div className="section">
      <div>{category.title}</div>
      {category.data.map((e, i) => {
        const firstCo = e[0].co;
        if (
          gStopList &&
          (firstCo === "citybus" || firstCo === "kmb" || firstCo === "nwfb")
        ) {
          return (
            <Buses
              key={i}
              section={e}
              gStopList={gStopList}
              gRouteList={gRouteList}
            />
          );
        } else if (firstCo === "mtr") {
          return <MTRs key={i} section={e} />;
        }
        return null;
      })}
    </div>
  );
};
