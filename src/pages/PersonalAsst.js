import { useParams } from "react-router-dom";
import { PersonalEta } from "../components/PersonalEta/PersonalEta";
import { FatherHolidays } from "../components/FatherHolidays/FatherHolidays";

export const PersonalAsst = () => {
  const { name } = useParams();

  if (name === "shan") {
    return <PersonalEta name={name} />;
  } else if (name === "willy") {
    return (
      <>
        <PersonalEta name={name} />
      </>
    );
  } else if (name === "test") {
    // return <FatherHolidays />;
  }
};
