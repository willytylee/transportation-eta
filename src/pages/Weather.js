import { useState } from "react";
import { Tabs, Tab, styled } from "@mui/material/";
import { CurrentWeater } from "../components/Weather/CurrentWeater";
import { NineDays } from "../components/Weather/NineDays";
import { TabPanel } from "../components/TabPanel";

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
    <>
      <Tabs value={tabIdx} onChange={handleChange}>
        <Tab label="本港現時天氣及預報" {...a11yProps(0)} />
        <Tab label="九天天氣預報" {...a11yProps(1)} />
      </Tabs>
      <StyledTabPanel value={tabIdx} index={0}>
        <CurrentWeater tabIdx={tabIdx} />
      </StyledTabPanel>
      <StyledTabPanel value={tabIdx} index={1}>
        <NineDays tabIdx={tabIdx} />
      </StyledTabPanel>
    </>
  );
};

const StyledTabPanel = styled(TabPanel)({
  overflow: "auto",
  padding: "8px",
});
