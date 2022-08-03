import { useContext, useEffect } from "react";
import { styled } from "@mui/material";
import "./App.css";
import { Navbar } from "./layouts/Navbar";
import { BottomNav } from "./layouts/BottomNav";
import { Route, Routes } from "react-router-dom";
import { Search } from "./pages/Search";
import { AppContext } from "./context/AppContext";
import { Settings } from "./pages/Settings";
import { Weather } from "./pages/Weather";
import { PersonalAsst } from "./pages/PersonalAsst";
import { About } from "./pages/Settings/About";
// import { Tutorial } from "./pages/Settings/Tutorial";
import { Install } from "./pages/Settings/Install";
import { News } from "./pages/News";
import { Map } from "./pages/Map";

const App = () => {
  const { initDb, getGeoLocation, initAppVersion } = useContext(AppContext);

  useEffect(() => {
    getGeoLocation();
    initDb();
    initAppVersion();
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/search" element={<Search />} />
          <Route path="/news" element={<News />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/personalAsst/:userId" element={<PersonalAsst />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/about" element={<About />} />
          <Route path="/settings/install" element={<Install />} />
          <Route path="/map" element={<Map />} />
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
