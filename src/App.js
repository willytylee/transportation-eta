import "./App.css";
import { useState } from "react";
import { Navbar } from "./Navbar";
import { DataReader } from "./DataReader";

const App = () => {
  const [name, setName] = useState("");

  const handleLink = (e) => {
    setName(e.target.id);
  };

  return (
    <>
      <Navbar handleLink={handleLink} />
      <div className="container">
        <DataReader name={name} />
        <div className="refresh-wrapper">
          <button onClick={() => window.location.reload()}>
            Refresh to update the app
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
