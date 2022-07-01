import React from "react";
import axios from "axios";
import _ from "underscore";
import { Card } from "@mui/material";
import { useState, useEffect } from "react";
import { StopEta } from "./StopEta";
import { getStopList } from "../utils/EtaUtils";

export const SearchResult = (props) => {
  const { route, expandItem, setExpandItem } = props;
  const [searchResult, setSearchResult] = useState([]);

  const kmbStopList = getStopList();

  const handleCardOnClick = (i) => {
    setExpandItem(i);
  };

  useEffect(() => {
    if (route) {
      const urls = [
        `https://data.etabus.gov.hk/v1/transport/kmb/route/${route}/inbound/1`,
        `https://data.etabus.gov.hk/v1/transport/kmb/route/${route}/outbound/1`,
        `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/inbound/1`,
        `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/outbound/1`,
      ];

      const fetchURL = (url) => axios.get(url);

      const promiseArray = urls.map(fetchURL);

      Promise.all(promiseArray).then((res) => {
        setSearchResult(
          _.groupBy(
            res.map((data) => {
              return data.data;
            }),
            (item) => {
              return item.type;
            }
          )
        );
      });
    } else {
      setSearchResult([]);
    }
  }, [route, expandItem]);

  return (
    <div className="searchResult">
      {searchResult?.Route?.map((result, i) => {
        const { data } = result;
        if (Object.keys(data).length > 0) {
          return (
            <div key={i} onClick={() => handleCardOnClick(i)}>
              <Card className={"searchResultCard"} variant="outlined">
                <div
                  className="routeTitle"
                  style={
                    expandItem === i ? { backgroundColor: "lightgrey" } : {}
                  }
                >
                  {data.orig_tc} - {data.dest_tc}
                </div>
              </Card>
            </div>
          );
        }
      })}
      <Card>
        <table className="searchResultTable">
          <tbody>
            {searchResult.RouteStop &&
              expandItem != null &&
              searchResult?.RouteStop[expandItem]?.data.map((data, j) => {
                const stopIndex = kmbStopList.findIndex(
                  (stop) => stop.stop === data.stop
                );
                const stopName = kmbStopList[stopIndex].name_tc;
                return (
                  <StopEta
                    key={j}
                    id={j}
                    stopId={data.stop}
                    route={route}
                    stopName={stopName}
                  />
                );
              })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
