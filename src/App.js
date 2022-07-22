import { useContext, useEffect } from "react";
import "./App.css";
import { Navbar } from "./Navbar";
import { Route, Routes } from "react-router-dom";
import { PersonalEta } from "./pages/PersonalEta";
import { Search } from "./pages/Search";
import { AppContext } from "./context/AppContext";

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
          <Route path="/eta/:name" element={<PersonalEta />} />
        </Routes>
      </div>
      <div className="refresh-wrapper">
        <a href="https://eta.willytylee.com/">
          <button>Refresh to update the app</button>
        </a>
      </div>
    </>
  );
};

export default App;
