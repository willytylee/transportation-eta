import { useState, useEffect } from "react";
// import axios from "axios";
import { Table } from "./Table.js";
import { List } from "./List.js";
// import { sortEtaObject, getAllEtaUrlsFromKmb } from "../../Utils.js";
import { fetchEtas } from "../../fetch/index.js";

export const Buses = ({ section, gStopList, gRouteList }) => {
  const [sectionData, setSectionData] = useState([]);
  const [view, setView] = useState("list");

  useEffect(() => {
    const intervalContent = async () => {
      const result = [];

      for (let i = 0; i < section.length; i++) {
        const { co, route, stopId, serviceType, seq } = section[i];
        const stopName = gStopList[stopId].name.zh;
        const { location } = gStopList[stopId];
        const routeObj = Object.keys(gRouteList)
          .map((e) => gRouteList[e])
          .filter((e) => {
            return (
              e.route === route &&
              e.serviceType == (serviceType ? serviceType : 1) && // Default 1
              e.co.includes(co) &&
              e.stops[co][seq - 1] === stopId
            );
          })[0];

        if (routeObj) {
          const res = await fetchEtas({ ...routeObj, seq: parseInt(seq, 10) });
          result.push({
            etas: res,
            route,
            stopName,
            location,
            stopId,
          });
        }

        // if (co === "kmb") {
        //   const stop = gStopList[stopId];
        //   stopName = stop.name.zh;
        //   location = stop.location;
        //   urls = getAllEtaUrlsFromKmb(stopId, route, serviceType);
        // } else if (co === "nwfb") {
        //   const stopRes = await axios.get(
        //     `https://rt.data.gov.hk/v1/transport/citybus-nwfb/stop/${stopId}`
        //   );
        //   const { data } = stopRes.data;
        //   stopName = data.name_tc;
        //   location = { lat: data.lat, lng: data.long };
        //   urls = [
        //     `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/nwfb/${stopId}/${route}`,
        //   ];
        // }

        // const fetchURL = (url) => axios.get(url);
        // const promiseArray = urls.map(fetchURL);

        // res = await Promise.all(promiseArray);

        // res = res
        //   .map((e) => e.data.data)
        //   .flat()
        //   .filter((e) => (seq ? e.seq == seq : e));

        // res = sortEtaObject(res);

        // res = res.slice(0, 3);
        // result.push({
        //   etas: res,
        //   route,
        //   stopName,
        //   location,
        // });
      }

      setSectionData(result);
    };

    intervalContent();
    const interval = setInterval(intervalContent, 5000);

    return () => clearInterval(interval);
  }, [section, gStopList]);

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
        {view === "list" ? "顯示所有班次" : "以到站時間排列"}
      </button>
      {view === "list" ? (
        <List sectionData={sectionData} />
      ) : (
        <Table sectionData={sectionData} />
      )}
    </>
  );
};
