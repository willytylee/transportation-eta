import { useContext } from "react";
import { TextField } from "@mui/material";
import { AppContext } from "../../context/AppContext";

export const SearchBar = ({ handleFormChange, searchValue }) => {
  const { dbVersion } = useContext(AppContext);

  return (
    <div className="searchBarWrapper">
      <TextField
        variant="standard"
        disabled={dbVersion == null}
        inputProps={{ className: "searchBar" }}
        size="small"
        name="category"
        value={searchValue}
        onChange={(e) => handleFormChange(e)}
      />
    </div>
  );
};
