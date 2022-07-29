import { useState } from "react";
import { Tabs, Tab } from "@mui/material/";
import { CurrentWeater } from "../components/Weather/CurrentWeater";
import { NineDays } from "../components/Weather/NineDays";

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
      <CurrentWeater tabIdx={tabIdx} />
      <NineDays tabIdx={tabIdx} />
    </>
  );
};
