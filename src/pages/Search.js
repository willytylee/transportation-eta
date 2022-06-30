import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { SearchResult } from "../components/SearchResult";

export const Search = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleFormChange = (e) => {
    setSearchValue(e.target.value.toUpperCase());
  };

  return (
    <>
      <TextField
        variant="standard"
        inputProps={{ style: { fontSize: 13 } }}
        size="small"
        name="category"
        value={searchValue}
        onChange={(e) => handleFormChange(e)}
      />
      <SearchResult searchValue={searchValue} />
    </>
  );
};
