import { useState, useRef } from "react";
import { Popper } from "@mui/material";
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
  const divRef = useRef();

  return (
    <div className="search">
      <SearchBar
        handleFormChange={handleFormChange}
        searchValue={searchValue}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        divRef={divRef}
      />
      <div ref={divRef}></div>
      {open && (
        <Popper
          sx={{
            width: "95%",
            height: "40%",
            overflow: "auto",
            border: "1px solid lightgrey",
            borderRadius: "5px",
            background: "white",
          }}
          open={open}
          placement="bottom"
          anchorEl={anchorEl}
        >
          <AutoComplete
            route={searchValue}
            setAnchorEl={setAnchorEl}
            setSearchValue={setSearchValue}
          />
        </Popper>
      )}
      <SearchResult route={searchValue} open={open} />
    </div>
  );
};
