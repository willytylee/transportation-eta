import { useContext, useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, styled, IconButton, InputAdornment } from "@mui/material";
import {
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { AppContext } from "../../context/AppContext";
import { EtaContext } from "../../context/EtaContext";
import { DbContext } from "../../context/DbContext";
import { TimetableDialog } from "./Dialog/TimetableDialog";

export const SearchBar = ({ handleFormKeyPress }) => {
  const { routeKey } = useParams();
  const { dbVersion } = useContext(AppContext);
  const textInput = useRef(null);
  const navigate = useNavigate();
  const { updateRoute, route } = useContext(EtaContext);
  const { gRouteList } = useContext(DbContext);
  const [timetableDialogOpen, setTimetableDialogOpen] = useState(false);

  useEffect(() => {
    if (routeKey && gRouteList[routeKey]) {
      updateRoute(gRouteList[routeKey].route);
    }
  }, [routeKey]);

  const handleFormChange = (text) => {
    updateRoute(text.toUpperCase());
  };

  return (
    <SearchBarWraper>
      <IconButton
        className={`timetableIconButton ${
          !routeKey || gRouteList[routeKey].co[0] === "mtr" ? "hide" : ""
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
          placeholder="輸入路線號碼"
          disabled={dbVersion === null}
          inputProps={{ className: "searchBar" }}
          size="small"
          name="category"
          value={route}
          onChange={(e) => handleFormChange(e.target.value)}
          onClick={() => navigate("/search", { replace: true })}
          onKeyDown={(e) => handleFormKeyPress(e)}
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
  margin: "10px 0 10px",
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
    width: "60px",
    height: "60px",
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
    width: "60px",
    height: "60px",
    fontSize: "10px",
    "&.hide": {
      display: "none",
    },
  },
});
