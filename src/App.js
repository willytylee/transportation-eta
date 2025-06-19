import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { styled } from "@mui/material";
import "./App.css";
import { Navbar } from "./layouts/Navbar";
import { BottomNav } from "./layouts/BottomNav";
import { Search } from "./pages/Search";
import { AppContext } from "./context/AppContext";
import { Settings } from "./pages/Settings";
import { Weather } from "./pages/Weather";
import { Bookmark } from "./pages/Bookmark";
import { StationMode } from "./pages/StationMode";
import { More } from "./pages/More";
import { About } from "./pages/Settings/About";
import { Install } from "./pages/Settings/Install";
import { News } from "./pages/News";
import { ChangeLog } from "./pages/Settings/ChangeLog";
import { Update } from "./pages/Settings/Update";
import { Personal } from "./pages/Settings/Personal";
import { Redirect } from "./pages/Redirect";
import { Playground } from "./pages/Playground";
import { BookmarkModify } from "./pages/Settings/BookmarkModify";
import { Direction } from "./pages/Direction";
import { Lab } from "./pages/Settings/Lab";

const App = () => {
  const { initDb, initAppVersion } = useContext(AppContext);

  useEffect(() => {
    initDb();
    initAppVersion();
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<Redirect />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/:routeKey" element={<Search />} />
          <Route path="/search/:routeKey/:stopId" element={<Search />} />
          <Route path="/news" element={<News />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/direction" element={<Direction />} />
          <Route path="/more" element={<More />} />
          <Route path="/stationMode" element={<StationMode />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/bookmark/:userId" element={<Playground />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/personal" element={<Personal />} />
          <Route path="/settings/bookmarkModify" element={<BookmarkModify />} />
          <Route path="/settings/about" element={<About />} />
          <Route path="/settings/about/changeLog" element={<ChangeLog />} />
          <Route path="/settings/about/lab" element={<Lab />} />
          <Route path="/settings/install" element={<Install />} />
          <Route path="/settings/update" element={<Update />} />
        </Routes>
      </Container>
      <BottomNav />
    </>
  );
};

const Container = styled("div")({
  fontSize: "14px",
  display: "flex",
  flex: "1 1 0%",
  overflow: "hidden",
  flexDirection: "column",
});

export default App;
