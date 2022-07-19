import PropTypes from "prop-types";
import { Buses } from "./Bus/Buses.js";
import { MTRs } from "./MTR/MTRs.js";

export const Section = (props) => {
  const { category } = props;

  return (
    <div className="section">
      <div>{category.title}</div>
      {category.data.map((e, j) => {
        const firstCo = e[0].co;
        if (firstCo === "citybus" || firstCo === "kmb") {
          return <Buses key={j} section={e} />;
        } else {
          return <MTRs key={j} section={e} />;
        }
      })}
    </div>
  );
};

Section.propTypes = {
  category: PropTypes.object,
};
