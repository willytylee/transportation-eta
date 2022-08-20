import { useContext } from "react";
import { styled } from "@mui/material";
import { EtaContext } from "../../../context/EtaContext";
import { AutoDistance } from "./AutoDistance";
import { AutoSearch } from "./AutoSearch";

export const AutoList = ({ route, setAnchorEl, setRoute }) => {
  const { updateCurrRoute } = useContext(EtaContext);

  const handleItemOnClick = (e) => {
    updateCurrRoute(e);
    setRoute(e.route);
    setAnchorEl(null);
  };

  const title = route ? "搜尋路線" : "附近路線";

  return (
    <AutoListRoot>
      <div className="title">{title}</div>

      {route ? (
        <AutoSearch route={route} handleItemOnClick={handleItemOnClick} />
      ) : (
        <AutoDistance handleItemOnClick={handleItemOnClick} />
      )}
    </AutoListRoot>
  );
};

const AutoListRoot = styled("div")({
  overflow: "auto",
  margin: "8px 0",
  fontSize: "12px",
  ".title": {
    textAlign: "center",
    fontWeight: "700",
    paddingBottom: "2px",
  },
});
