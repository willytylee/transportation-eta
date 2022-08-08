import { useParams } from "react-router-dom";
import { PersonalEta } from "../components/PersonalEta/PersonalEta";

export const Bookmark = () => {
  const { userId } = useParams();
  return <PersonalEta userId={userId} />;
};
