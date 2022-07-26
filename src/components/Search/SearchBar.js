import { useContext, useState } from "react";
import { TextField } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { AppContext } from "../../context/AppContext";

export const SearchBar = ({
  handleFormChange,
  searchValue,
  setAnchorEl,
  divRef,
}) => {
  const { dbVersion } = useContext(AppContext);

  const handleExpandIconOnClick = () => {
    setAnchorEl(divRef.current);
  };

  return (
    <div className="searchBarWrapper">
      <div>
        <TextField
          variant="standard"
          placeholder="搜尋路線"
          disabled={dbVersion == null}
          inputProps={{ className: "searchBar" }}
          size="small"
          name="category"
          value={searchValue}
          onChange={(e) => handleFormChange(e)}
          autoComplete="off"
        />
        <ExpandMoreIcon onClick={handleExpandIconOnClick} />
      </div>
    </div>
  );
};
