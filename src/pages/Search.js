import React from "react";
import { useState } from "react";
import { SearchResult } from "../components/Search/SearchResult";
import { SearchBar } from "../components/Search/SearchBar";
import { getLocalStorage } from "../Utils";

export const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [expandItem, setExpandItem] = useState("");

  const gRouteList = getLocalStorage("routeList");
  const gStopList = getLocalStorage("stopList");

  const handleFormChange = (e) => {
    setSearchValue(e.target.value.toUpperCase());
    setExpandItem("");
  };

  return (
    <div className="search">
      <SearchBar
        handleFormChange={handleFormChange}
        searchValue={searchValue}
      />
      <SearchResult
        route={searchValue}
        expandItem={expandItem}
        setExpandItem={setExpandItem}
        gRouteList={gRouteList}
        gStopList={gStopList}
      />
    </div>
  );
};
