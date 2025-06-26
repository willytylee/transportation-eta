import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Tab, Tabs, styled } from "@mui/material/";
import { DepartureBoard as DepartureBoardIcon } from "@mui/icons-material";
import { getLocalStorage, setLocalStorage, a11yProps } from "../Utils/Utils";
import { dataSet } from "../data/DataSet";
import { StationTitleDialog } from "../components/StationMode/StationTitleDialog";
import { StationModeTabPanel } from "../components/StationMode/StationModeTabPanel";

export const StationMode = () => {
  const bookmark = localStorage.getItem("bookmark");
  const userId = JSON.parse(localStorage.getItem("user"))?.userId || null;
  const stationMode = JSON.parse(localStorage.getItem("stationMode")) || [];
  const title = localStorage.getItem("stationTitle")
    ? localStorage.getItem("stationTitle")
    : "車站名稱";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabIdx, setTabIdx] = useState(0);

  let transportData;

  if (bookmark) {
    transportData = getLocalStorage("bookmark");
  } else if (userId) {
    const data = dataSet.find((o) => o.userId === userId);
    setLocalStorage("bookmark", data.transportData);
    transportData = data.transportData;
  }

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  return (
    <>
      <StationModeView>
        {bookmark ? (
          transportData?.length > 0 ? (
            stationMode?.length > 0 ? (
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabIdx}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    {stationMode.map((e, i) => (
                      <Tab label={e.title} {...a11yProps(i)} key={i} />
                    ))}
                  </Tabs>
                </Box>
                {stationMode.map((e, i) => (
                  <StationModeTabPanel
                    value={tabIdx}
                    index={i}
                    key={i}
                    stationModeData={e}
                    transportData={transportData}
                  />
                ))}
              </Box>
            ) : (
              <div className="emptyMsg">
                <p>未有設定車站模式。</p>
                <p>
                  請先到<Link to="/search">路線搜尋</Link>, 選擇交通路線,
                  再選擇巴士站, 然後新增書籤。
                </p>
                <p>
                  點擊
                  <DepartureBoardIcon fontSize="small" />
                  將路線加入車站模式
                </p>
              </div>
            )
          ) : (
            <div className="emptyMsg">
              <p>未有書籤。</p>
              <p>
                請先到<Link to="/search">路線搜尋</Link>, 選擇交通路線,
                再選擇巴士站, 然後新增書籤。
              </p>
            </div>
          )
        ) : (
          <div className="emptyMsg">
            <p>未有書籤</p>
            <p>
              現有用戶, 請到<Link to="/settings">設定</Link>, 載入用戶書籤。
            </p>
            <p>
              新用戶, 請先到<Link to="/search">路線搜尋</Link>, 選擇交通路線,
              再選擇巴士站, 然後新增書籤。
            </p>
          </div>
        )}
      </StationModeView>
      <StationTitleDialog
        title={title}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
};

const StationModeView = styled("div")({
  width: "100%",
  paddingTop: "8px",
  ".emptyMsg": {
    fontSize: "14px",
    textAlign: "center",
    padding: "14px",
  },
});
