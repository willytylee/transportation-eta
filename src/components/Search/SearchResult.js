import React from "react";
import axios from "axios";
import { Card } from "@mui/material";
import { useState, useEffect } from "react";
import { StopEta } from "./StopEta";
import { getLocalStorage } from "../../Utils";

export const SearchResult = (props) => {
  const { route, expandItem, setExpandItem } = props;
  const [searchResult, setSearchResult] = useState([]);
  const [routeList, setRouteList] = useState([]);

  const kmbStopList = getLocalStorage("kmbStopList");
  const kmbRouteList = getLocalStorage("kmbRouteList");

  const handleCardOnClick = (i) => {
    setExpandItem(i);
  };

  useEffect(() => {
    if (route) {
      const list = kmbRouteList
        .filter((item) => item.route === route)
        .sort((a, b) => a.service_type - b.service_type);
      setRouteList(list);

      const urls = [];

      list.forEach((item) => {
        let bound;
        switch (item.bound) {
          case "O":
            bound = "outbound";
            break;
          case "I":
            bound = "inbound";
            break;
          default:
            break;
        }
        urls.push(
          `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${bound}/${item.service_type}`
        );
      });

      const fetchURL = (url) => axios.get(url);
      const promiseArray = urls.map(fetchURL);
      Promise.all(promiseArray).then((response) => {
        setSearchResult(
          response.map((item) => {
            return item.data.data;
          })
        );
      });
    } else {
      setSearchResult([]);
    }
  }, [route, expandItem]);

  return (
    <div className="searchResult">
      {routeList.map((item, i) => {
        return (
          <div key={i} onClick={() => handleCardOnClick(i)}>
            <Card className={"searchResultCard"} variant="outlined">
              <div
                className="routeTitle"
                style={expandItem === i ? { backgroundColor: "lightgrey" } : {}}
              >
                {item.orig_tc} - {item.dest_tc}{" "}
                <span className="special">
                  {item.service_type !== "1" && "特別班次"}
                </span>
              </div>
            </Card>
          </div>
        );
      })}

      <Card>
        <table className="searchResultTable">
          <tbody>
            {searchResult &&
              expandItem != null &&
              searchResult[expandItem]?.map((item) => {
                const stopIndex = kmbStopList.findIndex(
                  (stop) => stop.stop === item.stop
                );
                const { name_tc, lat, long } = kmbStopList[stopIndex];
                const latLng = [lat, long];
                return (
                  <StopEta
                    key={item.seq}
                    seq={item.seq}
                    kmbStopId={item.stop}
                    route={route}
                    stopName={name_tc}
                    latLng={latLng}
                    serviceType={item.service_type}
                  />
                );
              })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
