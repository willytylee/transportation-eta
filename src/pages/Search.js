import React from "react";
import { useState } from "react";
import { TextField } from "@mui/material";
import { SearchResult } from "../components/SearchResult";

export const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [expandItem, setExpandItem] = useState("");

  const handleFormChange = (e) => {
    setSearchValue(e.target.value.toUpperCase());
    setExpandItem("");
  };

  return (
    <div className="search">
      <div className="searchBarWrapper">
        <TextField
          variant="standard"
          inputProps={{ className: "searchBar" }}
          size="small"
          name="category"
          value={searchValue}
          onChange={(e) => handleFormChange(e)}
        />
      </div>
      <SearchResult
        searchValue={searchValue}
        expandItem={expandItem}
        setExpandItem={setExpandItem}
      />
    </div>
  );
};
