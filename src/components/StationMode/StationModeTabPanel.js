import { useState, useEffect, useContext } from "react";
import { DbContext } from "../../context/DbContext";
import { getLocalStorage, setLocalStorage, fetchBusEta, handleTableResult } from "../../Utils/Utils";
import { dataSet } from "../../data/DataSet";

export const StationModeTabPanel = ({ value, index, stationModeData }) => {
  const bookmark = localStorage.getItem("bookmark");
  const userId = JSON.parse(localStorage.getItem("user"))?.userId || null;
  const { gStopList, gRouteList } = useContext(DbContext);
  const [sectionData, setSectionData] = useState([]);

  let transportData;

  if (bookmark) {
    transportData = getLocalStorage("bookmark");
  } else if (userId) {
    const data = dataSet.find((o) => o.userId === userId);
    setLocalStorage("bookmark", data.transportData);
    transportData = data.transportData;
  }

  const section = transportData[stationModeData.position[0]].data[stationModeData.position[1]];

  useEffect(() => {
    const intervalContent = async () => {
      const etas = await fetchBusEta(gStopList, gRouteList, section);
      setSectionData(etas);
    };

    intervalContent();
    const interval = setInterval(intervalContent, 10000);

    return () => clearInterval(interval);
  }, []);

  const result = handleTableResult(sectionData);

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`}>
      {value === index && (
        <div>
          <div className="row">
            <div className="route title">路線</div>
            <div className="dest title">總站</div>
            <div className="etaWrapper title">分鐘</div>
          </div>
          {result.map((e, i) => (
            <div className="row" key={i}>
              <div className="route">
                <span className={`${e.co}`}>{e.route}</span>
              </div>
              <div className="dest">{section[i].dest}</div>
              <div className="etaWrapper">
                {e.etas.slice(0, 2).map((eta, j) => (
                  <div key={j} className={`eta eta${j}`}>
                    {eta}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
