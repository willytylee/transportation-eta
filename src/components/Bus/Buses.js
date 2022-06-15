import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table } from "./Table.js";
import { List } from "./List.js";

export const Buses = (props) => {
  const [sectionData, setSectionData] = useState([]);
  const [view, setView] = useState("list");
  const { section } = props;

  useEffect(() => {
    let kmbStopList = [];

    const kmbStopListLocal = localStorage.getItem("kmbStopList");
    if (kmbStopListLocal) {
      kmbStopList = JSON.parse(kmbStopListLocal);
    } else {
      axios
        .get("https://data.etabus.gov.hk/v1/transport/kmb/stop/")
        .then((response) => {
          kmbStopList = response.data.data;
          localStorage.setItem("kmbStopList", JSON.stringify(kmbStopList));
        });
    }

    const interval = setInterval(async () => {
      const result = [];

      // for (let i = range[0] - 1; i < range[1]; i++) {
      for (let i = 0; i < section.length; i++) {
        let res,
          res1 = [],
          res2 = [];
        let route, stopCode, stopIndex, stopName, stopLat, stopLng;

        const api = section[i];
        const apiUrl = api.url[0];
        const apiUrlArr = apiUrl.split("/");
        const endPoint = apiUrlArr[2];

        if (api.url.length === 1) {
          if (endPoint === "data.etabus.gov.hk") {
            route = apiUrlArr[8];
            stopCode = apiUrlArr[7];
            stopIndex = kmbStopList.findIndex((stop) => stop.stop === stopCode);
            stopName = kmbStopList[stopIndex].name_tc;
            stopLat = kmbStopList[stopIndex].lat;
            stopLng = kmbStopList[stopIndex].long;
          } else if (endPoint === "rt.data.gov.hk") {
            let stopRes;

            route = apiUrlArr[9];
            stopCode = apiUrlArr[8];
            stopRes = await axios.get(
              "https://rt.data.gov.hk/v1/transport/citybus-nwfb/stop/" +
                stopCode
            );
            stopName = stopRes.data.data.name_tc;
          }

          res = await axios.get(apiUrl);

          result.push({
            etas: api.seq
              ? res.data.data.filter((item) => item.seq === api.seq)
              : res.data.data, // Default we get the 1st stop insteam of last stop
            route,
            stopName,
            latLng: [stopLat, stopLng],
          });
        } else {
          if (endPoint === "data.etabus.gov.hk") {
            route = apiUrlArr[8];
            stopCode = apiUrlArr[7];
            stopIndex = kmbStopList.findIndex((stop) => stop.stop === stopCode);
            stopName = kmbStopList[stopIndex].name_tc;
            stopLat = kmbStopList[stopIndex].lat;
            stopLng = kmbStopList[stopIndex].long;
          } else if (endPoint === "rt.data.gov.hk") {
            route = apiUrlArr[9];
          }

          res1 = await axios.get(api.url[0]);
          res2 = await axios.get(api.url[1]);

          if (api.seq) {
            const data1 = res1.data.data.filter((item) => item.seq === 1);
            const data2 = res2.data.data.filter((item) => item.seq === 1);
            res = data1.concat(data2);
          } else {
            res = res1.data.data.concat(res2.data.data);
          }

          res.sort((a, b) => {
            if (a.eta === "" || a.eta === null) {
              return 1;
            }
            if (b.eta === "" || b.eta === null) {
              return -1;
            }
            return moment(a.eta).diff(moment(b.eta), "second");
          });

          res = res.slice(0, 3);
          result.push({
            etas: res,
            route,
            stopName,
            latLng: [stopLat, stopLng],
          });
        }
      }

      setSectionData(result);
    }, 1000);

    return () => clearInterval(interval);
  }, [section]);

  const switchView = () => {
    if (view === "list") {
      setView("table");
    } else if (view === "table") {
      setView("list");
    }
  };

  return (
    <>
      <button onClick={() => switchView(view)}>
        {view === "list" ? "Table" : "List"} view
      </button>
      {view === "list" ? (
        <List sectionData={sectionData} />
      ) : (
        <Table sectionData={sectionData} />
      )}
    </>
  );
};
