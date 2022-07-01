import React from "react";
import axios from "axios";
import _ from "underscore";
import { Card } from "@mui/material";
import { useState, useEffect } from "react";
import { StopEta } from "./StopEta";

export const SearchResult = (props) => {
  const { searchValue, expandItem, setExpandItem } = props;
  const [searchResult, setSearchResult] = useState([]);

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

  const handleCardOnClick = (i) => {
    setExpandItem(i);
  };

  useEffect(() => {
    if (searchValue) {
      const urls = [
        `https://data.etabus.gov.hk/v1/transport/kmb/route/${searchValue}/inbound/1`,
        `https://data.etabus.gov.hk/v1/transport/kmb/route/${searchValue}/outbound/1`,
        `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${searchValue}/inbound/1`,
        `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${searchValue}/outbound/1`,
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
  }, [searchValue, expandItem]);

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
                    stopId={data.stop}
                    route={searchValue}
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
