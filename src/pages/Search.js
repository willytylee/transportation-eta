import { useState, useContext } from "react";
import { styled, Tabs, Tab } from "@mui/material";
import { SearchBar } from "../components/Search/SearchBar";
import { RouteList } from "../components/Search/RouteList/RouteList";
import { StopList } from "../components/Search/StopList";
import { EtaContext } from "../context/EtaContext";
import { TabPanel } from "../components/TabPanel";
import { NearbyRouteList } from "../components/Search/RouteList/NearbyRouteList";
import { SearchRouteList } from "../components/Search/RouteList/SearchRouteList";
import { HistoryRouteList } from "../components/Search/RouteList/HistoryRouteList";
import { setRouteListHistory } from "../Utils";

export const Search = () => {
  const [tabIdx, setTabIdx] = useState(0);
  const { updateCurrRoute, updateRoute } = useContext(EtaContext);

  const handleFormChange = (text) => {
    updateRoute(text.toUpperCase());
    updateCurrRoute({});
    if (tabIdx === 2 || tabIdx === 3) {
      setTabIdx(0);
    }
  };

  const handleTabChange = (e, value) => {
    setTabIdx(value);
  };

  const handleRouteListItemOnClick = (e) => {
    updateCurrRoute(e);
    updateRoute(e.route);
    setRouteListHistory(e);
    setTabIdx(0);
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  });

  return (
    <SearchRoot>
      <SearchBar handleFormChange={handleFormChange} />

      <SearchResult>
        <Tabs value={tabIdx} onChange={handleTabChange}>
          <Tab label="交通路線" {...a11yProps(0)} />
          <Tab label="搜尋路線" {...a11yProps(1)} />
          <Tab label="附近路線" {...a11yProps(2)} />
          <Tab label="歷史紀錄" {...a11yProps(3)} />
        </Tabs>
        <TabPanelRoot value={tabIdx} index={0}>
          <RouteList />
          <StopList />
        </TabPanelRoot>
        <TabPanelRoot value={tabIdx} index={1}>
          <SearchRouteList
            handleRouteListItemOnClick={handleRouteListItemOnClick}
          />
        </TabPanelRoot>
        <TabPanelRoot value={tabIdx} index={2}>
          <NearbyRouteList
            handleRouteListItemOnClick={handleRouteListItemOnClick}
          />
        </TabPanelRoot>
        <TabPanelRoot value={tabIdx} index={3}>
          <HistoryRouteList
            handleRouteListItemOnClick={handleRouteListItemOnClick}
          />
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
      flexGrow: 1,
    },
  },
});

const TabPanelRoot = styled(TabPanel)({
  overflow: "auto",
  padding: "8px",
  ".emptyMsg": {
    fontSize: "14px",
    textAlign: "center",
    paddingTop: "14px",
  },
});
