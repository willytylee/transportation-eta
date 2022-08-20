import { useState, useRef, useContext } from "react";
import { Popper, styled } from "@mui/material";
import { SearchBar } from "../components/Search/SearchBar";
import { AutoList } from "../components/Search/AutoList/AutoList";
import { RouteList } from "../components/Search/RouteList";
import { StopList } from "../components/Search/StopList";
import { EtaContext } from "../context/EtaContext";

export const Search = () => {
  const [route, setRoute] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { updateCurrRoute } = useContext(EtaContext);

  const handleFormChange = (text) => {
    setRoute(text.toUpperCase());
    updateCurrRoute({});
  };

  const open = Boolean(anchorEl);
  const divRef = useRef();

  return (
    <SearchRoot>
      <SearchBar
        handleFormChange={handleFormChange}
        route={route}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        divRef={divRef}
      />
      <div ref={divRef}> </div>
      {open && (
        <Popper
          sx={popperSx}
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
      <SearchResult className={open ? "open" : "close"}>
        <RouteList route={route} />
        <StopList route={route} />
      </SearchResult>
    </SearchRoot>
  );
};

const popperSx = {
  width: "95%",
  height: "calc(100% - 170px - env(safe-area-inset-bottom))",
  overflow: "auto",
  border: "1px solid lightgrey",
  borderRadius: "5px",
  background: "white",
};

const SearchRoot = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
});

const SearchResult = styled("div")({
  fontSize: "12px",
  overflow: "auto",
  "&.open": {
    opacity: "20%",
  },
  "&.close": {
    opacity: "100%",
  },
});
