import { useContext, useRef } from "react";
import { TextField } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { AppContext } from "../../context/AppContext";

export const SearchBar = ({
  handleFormChange,
  route,
  anchorEl,
  setAnchorEl,
  divRef,
}) => {
  const { dbVersion } = useContext(AppContext);
  const textInput = useRef(null);

  const handleSearchIconOnClick = () => {
    setAnchorEl(!anchorEl && divRef.current);
    !anchorEl && textInput.current.focus();
  };

  return (
    <div className="searchBarWrapper">
      <div>
        <TextField
          variant="standard"
          placeholder="輸入路線"
          disabled={dbVersion === null}
          inputProps={{ className: "searchBar" }}
          size="small"
          name="category"
          value={route}
          onChange={(e) => handleFormChange(e)}
          autoComplete="off"
          inputRef={textInput}
        />
        <SearchIcon onClick={handleSearchIconOnClick} />
      </div>
    </div>
  );
};
