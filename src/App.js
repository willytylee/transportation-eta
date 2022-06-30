import "./App.css";
import { Navbar } from "./Navbar";
import { Route, Routes } from "react-router-dom";
import { PersonalEta } from "./pages/PersonalEta";
import { Search } from "./pages/Search";

const App = () => {
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
    </>
  );
};

export default App;
