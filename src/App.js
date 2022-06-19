import "./App.css";
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Section } from "./components/Section";
import { dataSet } from "./data/DataSet";

const App = () => {
  const [data, setData] = useState(dataSet[0]);

  const handleLink = (e) => {
    if (e.target.id) {
      setData(dataSet.find((o) => o.user === e.target.id));
    } else {
      setData(dataSet[0]);
    }
  };

  return (
    <>
      <Navbar handleLink={handleLink} />
      <div className="container">
        {data.transportData.map((category, i) => (
          <Section key={i} category={category} />
        ))}
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
