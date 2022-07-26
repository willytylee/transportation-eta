import { useContext, useEffect } from "react";
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
      <div className="container">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/search" element={<Search />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/personalAsst/:name" element={<PersonalAsst />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <BottomNav />
    </>
  );
};

export default App;
