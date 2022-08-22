import { useState } from "react";
import { Tabs, Tab, styled } from "@mui/material/";
import { CurrentWeater } from "../components/Weather/CurrentWeater";
import { NineDays } from "../components/Weather/NineDays";
import { TabPanel } from "../components/TabPanel";
import { primaryColor } from "../constants/Constants";

export const Weather = () => {
  const [tabIdx, setTabIdx] = useState(0);

  const handleChange = (e, value) => {
    setTabIdx(value);
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  });

  return (
    <WeatherRoot>
      <Tabs
        value={tabIdx}
        onChange={handleChange}
        TabIndicatorProps={{ style: { background: `${primaryColor}` } }}
      >
        <Tab label="本港現時天氣及預報" {...a11yProps(0)} />
        <Tab label="九天天氣預報" {...a11yProps(1)} />
      </Tabs>
      <TabPanelRoot value={tabIdx} index={0}>
        <CurrentWeater />
      </TabPanelRoot>
      <TabPanelRoot value={tabIdx} index={1}>
        <NineDays />
      </TabPanelRoot>
    </WeatherRoot>
  );
};

const WeatherRoot = styled("div")({
  ".MuiButtonBase-root.Mui-selected": {
    color: `${primaryColor}`,
  },
});

const TabPanelRoot = styled(TabPanel)({
  overflow: "auto",
  padding: "8px",
});
