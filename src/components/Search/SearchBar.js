import { useContext, useRef, useState } from "react";
import { TextField, styled, IconButton } from "@mui/material";
import { Search as SearchIcon, Map as MapIcon } from "@mui/icons-material";
import { AppContext } from "../../context/AppContext";
import { MapDialog } from "../MapDialog";
import { EtaContext } from "../../context/EtaContext";

export const SearchBar = ({
  handleFormChange,
  route,
  anchorEl,
  setAnchorEl,
  divRef,
}) => {
  const { dbVersion } = useContext(AppContext);
  const { currRoute } = useContext(EtaContext);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const textInput = useRef(null);

  const handleSearchIconOnClick = () => {
    setAnchorEl(!anchorEl && divRef.current);
    !anchorEl && textInput.current.focus();
  };

  const handleMapDialogOnClose = () => {
    setMapDialogOpen(false);
  };

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
          onChange={(e) => handleFormChange(e)}
          autoComplete="off"
          inputRef={textInput}
        />
        <IconButton onClick={handleSearchIconOnClick}>
          <SearchIcon />
        </IconButton>
      </div>
      <IconButton
        className={`mapIconButton ${
          Object.keys(currRoute).length === 0 ? "hide" : ""
        }`}
        onClick={() => setMapDialogOpen(true)}
      >
        <MapIcon />
      </IconButton>
      <MapDialog
        fullWidth
        mapDialogOpen={mapDialogOpen}
        handleMapDialogOnClose={handleMapDialogOnClose}
      />
    </SearchBarWraper>
  );
};

const SearchBarWraper = styled("div")({
  width: "100%",
  textAlign: "center",
  margin: "10px 0",
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
  alignItems: "center",
  ".searchWrapper": {
    display: "flex",
    alignItems: "center",
  },
  ".searchBar": {
    textAlign: "center",
  },
  ".mapIconButton": {
    position: "absolute",
    right: 0,
    "&.hide": {
      display: "none",
    },
  },
});
