import PropTypes from "prop-types";
import { Buses } from "./Bus/Buses.js";
import { MTRs } from "./MTR/MTRs.js";

export const Section = (props) => {
  const { category } = props;

  return (
    <div className="section">
      <div>{category.title}</div>
      {category.data.map((item, j) => {
        const firstCo = item[0].co;
        if (firstCo === "citybus" || firstCo === "kmb") {
          return <Buses key={j} section={item} />;
        } else {
          return <MTRs key={j} section={item} />;
        }
      })}
    </div>
  );
};

Section.propTypes = {
  category: PropTypes.object,
};
