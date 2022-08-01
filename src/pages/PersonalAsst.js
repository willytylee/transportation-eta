import { useParams } from "react-router-dom";
import { PersonalEta } from "../components/PersonalEta/PersonalEta";

export const PersonalAsst = () => {
  const { userId } = useParams();
  return <PersonalEta userId={userId} />;
};
