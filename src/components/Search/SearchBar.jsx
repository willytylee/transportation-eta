import { useContext, useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, styled, IconButton, InputAdornment } from "@mui/material";
import {
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import mtrLogo from "../../assets/transports/mtrLogo.png";
import { AppContext } from "../../context/AppContext";
import { EtaContext } from "../../context/EtaContext";
import { DbContext } from "../../context/DbContext";
import { TimetableDialog } from "./Dialog/TimetableDialog";

export const SearchBar = ({
  tabIdx,
  handleRemoveHistoryOnClick,
  handleFormKeyPress,
  handleRefreshOnClick,
}) => {
  const { routeKey } = useParams();
  const { dbVersion } = useContext(AppContext);
  const textInput = useRef(null);
  const navigate = useNavigate();
  const { updateRoute, route } = useContext(EtaContext);
  const { gRouteList } = useContext(DbContext);
  const [timetableDialogOpen, setTimetableDialogOpen] = useState(false);

  useEffect(() => {
    if (routeKey && gRouteList && gRouteList[routeKey]) {
      updateRoute(gRouteList[routeKey].route);
    }
  }, [routeKey]);

  const handleFormChange = (text) => {
    updateRoute(text.toUpperCase());
  };

  const handleMtrOnClick = () => {
    updateRoute("MTR");
  };

  return (
    <SearchBarWraper>
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
      <div className="iconWrapper">
        {gRouteList &&
          routeKey &&
          gRouteList[routeKey].co[0] !== "mtr" &&
          gRouteList[routeKey].co[0] !== "lightRail" && (
            <IconButton
              className="btn"
              disabled={dbVersion === null}
              onClick={() => setTimetableDialogOpen(true)}
            >
              <AccessTimeIcon />
              <div>時間表</div>
            </IconButton>
          )}
        {gRouteList && routeKey && (
          <IconButton className="btn" onClick={handleRefreshOnClick}>
            <RefreshIcon />
            <div>更新時間</div>
          </IconButton>
        )}
        {tabIdx === 3 && (
          <IconButton className="btn" onClick={handleRemoveHistoryOnClick}>
            <DeleteIcon />
            <div>刪除記錄</div>
          </IconButton>
        )}
        {(tabIdx === 0 || tabIdx === 1) && route === "" && (
          <IconButton className="btn mtrBtn" onClick={handleMtrOnClick}>
            <img alt="edit" src={mtrLogo} />
            <div>港鐵路線</div>
          </IconButton>
        )}
      </div>
      {gRouteList && (
        <TimetableDialog
          timetableDialogOpen={timetableDialogOpen}
          setTimetableDialogOpen={setTimetableDialogOpen}
        />
      )}
    </SearchBarWraper>
  );
};

const SearchBarWraper = styled("div")({
  width: "100%",
  textAlign: "center",
  margin: "4px 0 4px",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "row",
  alignItems: "center",
  ".searchWrapper": {
    display: "flex",
    alignItems: "center",
    paddingLeft: "28px",
    ".MuiInput-root": {
      paddingBottom: "6px",
      ".searchBar": {
        textAlign: "center",
        padding: 0,
        width: "100px",
      },
    },
  },
  ".iconWrapper": {
    display: "flex",
    height: "40px",
    gap: "4px",
    alignItems: "center",
    paddingRight: "28px",
    ".btn": {
      display: "flex",
      flexDirection: "column",
      padding: "0",
      width: "45px",
      height: "45px",
      minWidth: "45px",
      fontSize: "10px",
      "&.mtrBtn": {
        img: {
          height: "19px",
          padding: "3px",
        },
      },
      svg: {
        width: "18px",
        height: "18px",
      },
      ".MuiTouchRipple-root, .MuiTouchRipple-ripple, .MuiTouchRipple-child": {
        borderRadius: "4px",
      },
    },
  },
});
