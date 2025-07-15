import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { styled, Tabs, Tab } from "@mui/material";
import { useSnackbar } from "notistack";
import { SearchBar } from "../components/Search/SearchBar";
import { RouteList } from "../components/Search/RouteList/RouteList";
import { StopList } from "../components/Search/StopList";
import { TabPanel } from "../components/TabPanel";
import { NearbyRouteList } from "../components/Search/RouteList/NearbyRouteList";
import { SearchRouteList } from "../components/Search/RouteList/SearchRouteList";
import { HistoryRouteList } from "../components/Search/RouteList/HistoryRouteList";
import { a11yProps } from "../Utils/Utils";
import { primaryColor } from "../constants/Constants";
import { AppContext } from "../context/AppContext";
import { DbContext } from "../context/DbContext";
import { EtaContext } from "../context/EtaContext";
import { Map } from "../components/Search/Map";

export const Search = () => {
  const searchMethod =
    JSON.parse(localStorage.getItem("settings"))?.searchMethod || "搜尋路線";
  const [tabIdx, setTabIdx] = useState(searchMethod === "搜尋路線" ? 0 : 1);
  const [stopListRenderKey, setStopListRenderKey] = useState(0);
  const [historyRenderKey, setHistoryRenderKey] = useState(0);
  const { routeKey } = useParams();
  const { gRouteList } = useContext(DbContext);
  const { dbVersion } = useContext(AppContext);
  const { updateRoute } = useContext(EtaContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleRefreshOnClick = () => {
    setStopListRenderKey(stopListRenderKey + 1);
  };

  const handleFormKeyPress = (e) => {
    e.key === "Enter" && setTabIdx(1);
  };

  const handleTabChange = (e, value) => {
    setTabIdx(value);
    if (value === 2 || value === 3) {
      updateRoute("");
      navigate("/search", { replace: true });
    }
    if (value === 0) {
      navigate("/search", { replace: true });
    }
  };

  const handleRemoveHistoryOnClick = () => {
    localStorage.removeItem("routeListHistory");
    setHistoryRenderKey(historyRenderKey + 1);
    enqueueSnackbar("歷史紀錄已清除", {
      variant: "success",
    });
  };

  useEffect(() => {
    if (gRouteList && routeKey && gRouteList[routeKey]) {
      setTabIdx(1);

      let routeListHistory;

      try {
        JSON.parse(localStorage.getItem("routeListHistory"));
      } catch (error) {
        routeListHistory = [];
        localStorage.removeItem("routeListHistory");
      }

      if (Array.isArray(JSON.parse(localStorage.getItem("routeListHistory")))) {
        routeListHistory = JSON.parse(localStorage.getItem("routeListHistory"));
      } else {
        routeListHistory = [];
        localStorage.removeItem("routeListHistory");
      }

      const isInHistory =
        routeListHistory.filter((e) => e === routeKey).length > 0;

      if (!isInHistory) {
        if (routeListHistory.length >= 20) {
          routeListHistory.pop();
        }
        routeListHistory.unshift(routeKey);
        localStorage.setItem(
          "routeListHistory",
          JSON.stringify(routeListHistory)
        );
      }
    }
  }, [routeKey]);

  return (
    <SearchRoot>
      <SearchBar
        handleFormKeyPress={handleFormKeyPress}
        handleRefreshOnClick={handleRefreshOnClick}
        handleRemoveHistoryOnClick={handleRemoveHistoryOnClick}
        tabIdx={tabIdx}
      />
      <SearchResult>
        <Tabs
          value={tabIdx}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { background: `${primaryColor}` } }}
        >
          <Tab
            disabled={dbVersion === null}
            label="搜尋路線"
            {...a11yProps(0)}
          />
          <Tab
            disabled={dbVersion === null}
            label="交通路線"
            {...a11yProps(1)}
          />
          <Tab
            disabled={dbVersion === null}
            label="附近路線"
            {...a11yProps(2)}
          />
          <Tab
            disabled={dbVersion === null}
            label="歷史紀錄"
            {...a11yProps(3)}
          />
        </Tabs>
        <TabPanelRoot value={tabIdx} index={0}>
          <SearchRouteList />
        </TabPanelRoot>
        <TabPanelRoot value={tabIdx} index={1}>
          {routeKey && <Map />}
          <div className="routeListStopWrapper">
            <RouteList />
            <StopList stopListRenderKey={stopListRenderKey} />
          </div>
        </TabPanelRoot>
        <TabPanelRoot value={tabIdx} index={2}>
          <NearbyRouteList />
        </TabPanelRoot>
        <TabPanelRoot value={tabIdx} index={3}>
          <HistoryRouteList key={historyRenderKey} />
        </TabPanelRoot>
      </SearchResult>
    </SearchRoot>
  );
};

const SearchRoot = styled("div")({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const SearchResult = styled("div")({
  fontSize: "12px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  ".MuiTabs-flexContainer": {
    justifyContent: "space-evenly",
    button: {
      "&.Mui-selected": {
        color: `${primaryColor}`,
      },
      flexGrow: 1,
      paddingLeft: 0,
      paddingRight: 0,
      maxWidth: "unset",
      minWidth: "unset",
    },
  },
});

const TabPanelRoot = styled(TabPanel)({
  overflow: "auto",
  "&#simple-tabpanel-1>div": {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    ".routeListStopWrapper": {
      flex: 3,
      overflow: "auto",
    },
  },
  ".emptyMsg": {
    fontSize: "14px",
    textAlign: "center",
    padding: "14px",
  },
});
