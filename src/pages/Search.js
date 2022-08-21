import { useState, useContext } from "react";
import { styled, Tabs, Tab } from "@mui/material";
import { SearchBar } from "../components/Search/SearchBar";
// import { AutoList } from "../components/Search/AutoList/AutoList";
import { RouteList } from "../components/Search/RouteList/RouteList";
import { StopList } from "../components/Search/StopList";
import { EtaContext } from "../context/EtaContext";
import { TabPanel } from "../components/TabPanel";
import { NearbyRouteList } from "../components/Search/RouteList/NearbyRouteList";
import { SearchRouteList } from "../components/Search/RouteList/SearchRouteList";

export const Search = () => {
  const [route, setRoute] = useState("");
  const [tabIdx, setTabIdx] = useState(0);
  // const [anchorEl, setAnchorEl] = useState(null);
  const { updateCurrRoute } = useContext(EtaContext);

  const handleFormChange = (text) => {
    setRoute(text.toUpperCase());
    updateCurrRoute({});
  };

  const handleTabChange = (e, value) => {
    setTabIdx(value);
  };

  const handleNearbyItemOnClick = (e) => {
    updateCurrRoute(e);
    setRoute(e.route);
    setTabIdx(0);
    // setAnchorEl(null);
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  });

  // const open = Boolean(anchorEl);
  // const divRef = useRef();

  return (
    <SearchRoot>
      <SearchBar
        handleFormChange={handleFormChange}
        route={route}
        // anchorEl={anchorEl}
        // setAnchorEl={setAnchorEl}
        // divRef={divRef}
      />
      {/* <div ref={divRef}> </div>
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
      )} */}
      {/* <SearchResult className={open ? "open" : "close"}> */}
      <SearchResult>
        <Tabs value={tabIdx} onChange={handleTabChange}>
          <Tab label="交通路線" {...a11yProps(0)} />
          <Tab label="附近路線" {...a11yProps(1)} />
          <Tab label="搜尋路線" {...a11yProps(2)} />
        </Tabs>
        <TabPanelRoot value={tabIdx} index={0}>
          <RouteList route={route} />
          <StopList route={route} />
        </TabPanelRoot>
        <TabPanelRoot value={tabIdx} index={1}>
          <NearbyRouteList
            route={route}
            handleNearbyItemOnClick={handleNearbyItemOnClick}
          />
        </TabPanelRoot>
        <TabPanelRoot value={tabIdx} index={2}>
          <SearchRouteList
            route={route}
            handleNearbyItemOnClick={handleNearbyItemOnClick}
          />
        </TabPanelRoot>
      </SearchResult>
    </SearchRoot>
  );
};

// const popperSx = {
//   width: "95%",
//   height: "calc(100% - 170px - env(safe-area-inset-bottom))",
//   overflow: "auto",
//   border: "1px solid lightgrey",
//   borderRadius: "5px",
//   background: "white",
// };

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
  },
});

const TabPanelRoot = styled(TabPanel)({
  overflow: "auto",
  padding: "8px",
});
