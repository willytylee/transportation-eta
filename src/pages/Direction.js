import { useState } from "react";
import { styled } from "@mui/material";
import { SearchBar } from "../components/Direction/SearchBar";
import { Map } from "../components/Direction/Map";
import { DirectionList } from "../components/Direction/DirectionList";

export const Direction = () => {
  const [destination, setDestination] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [sortingMethod, setSortingMethod] = useState("");

  return (
    <DirectionRoot>
      <SearchBar
        setDestination={setDestination}
        setSortingMethod={setSortingMethod}
      />
      <Map destination={destination} expanded={expanded} />
      <DirectionList
        destination={destination}
        expanded={expanded}
        setExpanded={setExpanded}
        sortingMethod={sortingMethod}
      />
    </DirectionRoot>
  );
};

const DirectionRoot = styled("div")({
  fontSize: "12px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  height: "100%",
});
