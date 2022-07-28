import { useState, useRef, useContext } from "react";
import { Popper } from "@mui/material";
import { SearchBar } from "../components/Search/SearchBar";
import { AutoList } from "../components/Search/AutoList";
import { RouteList } from "../components/Search/RouteList";
import { StopList } from "../components/Search/StopList";
import { AppContext } from "../context/AppContext";

export const Search = () => {
  const [route, setRoute] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { updateCurrRoute } = useContext(AppContext);

  const handleFormChange = (e) => {
    setRoute(e.target.value.toUpperCase());
    updateCurrRoute({});
  };

  const open = Boolean(anchorEl);
  const divRef = useRef();

  return (
    <div className="search">
      <SearchBar
        handleFormChange={handleFormChange}
        route={route}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        divRef={divRef}
      />
      <div ref={divRef}></div>
      {open && (
        <Popper
          sx={{
            width: "95%",
            height: "40%",
            overflow: "auto",
            border: "1px solid lightgrey",
            borderRadius: "5px",
            background: "white",
          }}
          open={open}
          placement="bottom"
          anchorEl={anchorEl}
        >
          <AutoList
            route={route}
            setAnchorEl={setAnchorEl}
            setRoute={setRoute}
          />
        </Popper>
      )}
      <div className="searchResult" style={{ opacity: open ? "20%" : "100%" }}>
        <RouteList route={route} />
        <StopList route={route} />
      </div>
    </div>
  );
};
