import { useContext, useRef, useState, useEffect } from "react";
import { TextField, styled, IconButton, InputAdornment } from "@mui/material";
import {
  Search as SearchIcon,
  Map as MapIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { AppContext } from "../../context/AppContext";
import { MapDialog } from "../MapDialog/MapDialog";
import { EtaContext } from "../../context/EtaContext";

export const SearchBar = ({
  handleFormChange,
  route,
  anchorEl,
  setAnchorEl,
  divRef,
}) => {
  const { dbVersion, location: currentLocation } = useContext(AppContext);
  const { currRoute, updateCurrRoute } = useContext(EtaContext);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const textInput = useRef(null);

  const handleSearchIconOnClick = () => {
    setAnchorEl(!anchorEl && divRef.current);
  };

  const handleMapDialogOnClose = () => {
    setMapDialogOpen(false);
  };

  useEffect(() => {
    if (!route) {
      updateCurrRoute({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return (
    <SearchBarWraper>
      <div className="searchWrapper">
        <TextField
          variant="standard"
          placeholder="輸入路線"
          disabled={dbVersion === null}
          inputProps={{ className: "searchBar" }}
          size="small"
          name="category"
          value={route}
          onChange={(e) => handleFormChange(e.target.value)}
          autoComplete="off"
          inputRef={textInput}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    handleFormChange("");
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <IconButton onClick={handleSearchIconOnClick}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <IconButton
        className={`mapIconButton ${
          Object.keys(currRoute).length === 0 ? "hide" : ""
        }`}
        disabled={dbVersion === null}
        onClick={() => setMapDialogOpen(true)}
      >
        <MapIcon />
      </IconButton>
      <MapDialog
        fullWidth
        mapDialogOpen={mapDialogOpen}
        handleMapDialogOnClose={handleMapDialogOnClose}
        currentLocation={currentLocation}
      />
    </SearchBarWraper>
  );
};

const SearchBarWraper = styled("div")({
  width: "100%",
  textAlign: "center",
  margin: "15px 0 10px",
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
  alignItems: "center",
  ".searchWrapper": {
    display: "flex",
    alignItems: "center",
    ".MuiInput-root": {
      height: "35px",
      ".searchBar": {
        textAlign: "center",
        padding: 0,
        width: "110px",
      },
    },
  },
  ".mapIconButton": {
    position: "absolute",
    right: 0,
    "&.hide": {
      display: "none",
    },
  },
});
