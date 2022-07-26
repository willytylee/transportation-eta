import { useState, useEffect, useRef } from "react";
import { Popover } from "@mui/material";
import { SearchResult } from "../components/Search/SearchResult";
import { SearchBar } from "../components/Search/SearchBar";
import { AutoComplete } from "../components/Search/AutoComplete";

export const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleFormChange = (e) => {
    setSearchValue(e.target.value.toUpperCase());
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const divRef = useRef();
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="search">
      <SearchBar
        handleFormChange={handleFormChange}
        searchValue={searchValue}
        setAnchorEl={setAnchorEl}
        divRef={divRef}
      />
      <div ref={divRef} aria-describedby={id}></div>
      {open ? (
        <Popover
          sx={{ width: "100%" }}
          id={id}
          open={open}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
        >
          <AutoComplete route={searchValue} />
        </Popover>
      ) : null}
      <SearchResult route={searchValue} />
    </div>
  );
};
