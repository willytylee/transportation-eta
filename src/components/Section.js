import PropTypes from "prop-types";
import { Buses } from "./Bus/Buses.js";
import { MTRs } from "./MTR/MTRs.js";

export const Section = (props) => {
  const { category } = props;

  return (
    <div className="section">
      <div>{category.title}</div>
      {category.data.map((section, j) => {
        const firstUrl = section[0].url[0];
        if (firstUrl.includes("citybus") || firstUrl.includes("kmb")) {
          return <Buses key={j} section={section} />;
        } else {
          return <MTRs key={j} section={section} />;
        }
      })}
    </div>
  );
};

Section.propTypes = {
  category: PropTypes.object,
};
