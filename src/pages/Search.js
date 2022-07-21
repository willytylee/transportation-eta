import { useState } from "react";
import { SearchResult } from "../components/Search/SearchResult";
import { SearchBar } from "../components/Search/SearchBar";

export const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [expandIndex, setExpandIndex] = useState(-1);

  const handleFormChange = (e) => {
    setSearchValue(e.target.value.toUpperCase());
    setExpandIndex(-1);
  };

  return (
    <div className="search">
      <SearchBar
        handleFormChange={handleFormChange}
        searchValue={searchValue}
      />
      <SearchResult
        route={searchValue}
        expandIndex={expandIndex}
        setExpandIndex={setExpandIndex}
      />
    </div>
  );
};
