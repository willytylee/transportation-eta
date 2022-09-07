import { useContext, useRef, useState, useEffect } from "react";
import { TextField, styled, IconButton, InputAdornment } from "@mui/material";
import {
  Map as MapIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { AppContext } from "../../context/AppContext";
import { MapDialog } from "../MapDialog/MapDialog";
import { EtaContext } from "../../context/EtaContext";
import { TimetableDialog } from "../TimetableDialog";

export const SearchBar = ({ handleFormChange, handleFormKeyPress }) => {
  const { dbVersion } = useContext(AppContext);
  const { currRoute, updateCurrRoute, route } = useContext(EtaContext);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [timetableDialogOpen, setTimetableDialogOpen] = useState(false);
  const textInput = useRef(null);

  useEffect(() => {
    if (!route) {
      updateCurrRoute({});
    }
  }, [route]);

  const handleMapDialogOnClose = () => {
    setMapDialogOpen(false);
  };

  return (
    <SearchBarWraper>
      <IconButton
        className={`timetableIconButton ${
          Object.keys(currRoute).length === 0 || currRoute.co[0] === "mtr"
            ? "hide"
            : ""
        }`}
        disabled={dbVersion === null}
        onClick={() => setTimetableDialogOpen(true)}
      >
        <AccessTimeIcon />
        <div>昤間表</div>
      </IconButton>
      <div className="searchWrapper">
        <TextField
          variant="standard"
          label="輸入路線號碼"
          placeholder="297"
          disabled={dbVersion === null}
          inputProps={{ className: "searchBar" }}
          size="small"
          name="category"
          value={route}
          onChange={(e) => handleFormChange(e.target.value)}
          onKeyPress={(e) => handleFormKeyPress(e)}
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
        <div>地圖</div>
      </IconButton>
      <MapDialog
        mapDialogOpen={mapDialogOpen}
        handleMapDialogOnClose={handleMapDialogOnClose}
      />
      <TimetableDialog
        timetableDialogOpen={timetableDialogOpen}
        setTimetableDialogOpen={setTimetableDialogOpen}
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
  position: "relative",
  ".searchWrapper": {
    display: "flex",
    alignItems: "center",
    ".MuiInput-root": {
      paddingBottom: "6px",
      ".searchBar": {
        textAlign: "center",
        padding: 0,
        width: "110px",
      },
    },
  },
  ".mapIconButton": {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    right: 0,
    width: "55px",
    height: "55px",
    fontSize: "10px",
    "&.hide": {
      display: "none",
    },
  },
  ".timetableIconButton": {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    left: 0,
    width: "55px",
    height: "55px",
    fontSize: "10px",
    "&.hide": {
      display: "none",
    },
  },
});
