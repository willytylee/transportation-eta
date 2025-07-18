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
import { routeMap } from "../../constants/Mtr";
import { TimetableDialog } from "./Dialog/TimetableDialog";
import { LocationSearchBar } from "./LocationSearchBar";

export const SearchBar = ({
  tabIdx,
  handleRemoveHistoryOnClick,
  handleFormKeyPress,
  handleRefreshOnClick,
  handleNearbySelectOnChange,
  handleMtrOnClick,
}) => {
  const { routeKey } = useParams();
  const { dbVersion } = useContext(AppContext);
  const textInput = useRef(null);
  const navigate = useNavigate();
  const { updateRoute, route } = useContext(EtaContext);
  const { gRouteList } = useContext(DbContext);
  const [timetableDialogOpen, setTimetableDialogOpen] = useState(false);
  const [locationSearchBarValue, setLocationSearchBarValue] = useState("");

  useEffect(() => {
    if (routeKey && gRouteList && gRouteList[routeKey]) {
      updateRoute(gRouteList[routeKey].route);
    }
  }, [routeKey]);

  const handleFormChange = (text) => {
    updateRoute(text.toUpperCase());
  };

  return (
    <SearchBarWraper tabIdx={tabIdx}>
      <div className="searchWrapper">
        <TextField
          fullWidth
          variant="standard"
          placeholder="輸入路線號碼"
          disabled={dbVersion === null}
          inputProps={{ className: "searchBarInput" }}
          name="category"
          className="routeSearchField"
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
      {tabIdx === 2 && (
        <div className="locationSearchBarWrapper">
          <LocationSearchBar
            placeholder="輸入自訂地點"
            defaultValue={{
              label: "你的位置",
              value: "你的位置",
            }}
            components={{
              IndicatorSeparator: () => null,
            }}
            defaultOptions={[
              {
                label: "你的位置",
                value: "你的位置",
              },
            ]}
            handleSelectOnChange={(e) => {
              handleNearbySelectOnChange(e);
              setLocationSearchBarValue(e);
            }}
            value={locationSearchBarValue}
            optionStyle={{
              textAlign: "left",
            }}
            styles={{
              option: {
                textAlign: "left",
              },
              control: {
                border: 0,
                borderBottom: "1px solid grey",
                paddingBottom: "2px",
                borderRadius: 0,
                minHeight: 0,
                fontSize: "14px",
                backgroundColor: "transparent",
              },
              dropdownIndicator: {
                padding: "4px",
              },
              placeholder: { color: "#b3b3b3" },
            }}
          />
        </div>
      )}
      {tabIdx !== 2 &&
        gRouteList &&
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
      {(tabIdx === 0 || tabIdx === 1) &&
        (route === "" ||
          route === "MTR" ||
          Object.keys(routeMap).includes(route)) && (
          <IconButton className="btn mtrBtn" onClick={handleMtrOnClick}>
            <img alt="edit" src={mtrLogo} />
            <div>港鐵路線</div>
          </IconButton>
        )}

      {gRouteList && (
        <TimetableDialog
          timetableDialogOpen={timetableDialogOpen}
          setTimetableDialogOpen={setTimetableDialogOpen}
        />
      )}
    </SearchBarWraper>
  );
};

const SearchBarWraper = styled("div", {
  shouldForwardProp: (prop) => prop !== "tabIdx",
})(({ tabIdx }) => ({
  padding: "0 28px",
  width: "100%",
  textAlign: "center",
  margin: "4px 0 4px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: tabIdx === 2 ? "column" : "row",
  gap: tabIdx === 2 ? 0 : "16px",
  ".searchWrapper": {
    display: "flex",
    alignItems: "center",
    width: "100%",
    ".routeSearchField": {
      height: "45px",
      justifyContent: "center",
      ".MuiInput-root": {
        paddingBottom: "6px",
        ".searchBarInput": {
          textAlign: "center",
          padding: 0,
          fontSize: "14px",
          color: "hsl(0, 0%, 20%)",
        },
        ".MuiInputAdornment-root": {
          marginLeft: 0,
          button: {
            padding: "4px",
            svg: {
              width: "20px",
              height: "20px",
            },
          },
        },
      },
    },
  },
  ".locationSearchBarWrapper": {
    height: "36px",
    width: "100%",
  },

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
}));
