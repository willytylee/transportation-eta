import React from "react";
import { TextField } from "@mui/material";

export const SearchBar = (props) => {
  const { handleFormChange, searchValue } = props;

  return (
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
  );
};
