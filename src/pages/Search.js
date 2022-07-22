import { useState } from "react";
import { SearchResult } from "../components/Search/SearchResult";
import { SearchBar } from "../components/Search/SearchBar";

export const Search = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleFormChange = (e) => {
    setSearchValue(e.target.value.toUpperCase());
  };

  return (
    <div className="search">
      <SearchBar
        handleFormChange={handleFormChange}
        searchValue={searchValue}
      />
      <SearchResult route={searchValue} />
    </div>
  );
};
