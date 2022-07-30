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

const App = () => {
  const { initDb } = useContext(AppContext);
  const { getGeoLocation } = useContext(AppContext);

  useEffect(() => {
    getGeoLocation();
    initDb();
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/search" element={<Search />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/personalAsst/:name" element={<PersonalAsst />} />
          <Route path="/settings" element={<Settings />} />
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
