import { useState } from "react";
import { Fab, styled } from "@mui/material";
import { Sort as SortIcon } from "@mui/icons-material";
import { SearchBar } from "../components/Direction/SearchBar";
import { Map } from "../components/Direction/Map";
import { DirectionList } from "../components/Direction/DirectionList";
import { SortingDialog } from "../components/Direction/SortingDialog";

export const Direction = () => {
  const [origination, setOrigination] = useState(null);
  const [destination, setDestination] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [sortingDialogOpen, setSortingDialogOpen] = useState(false);
  const [sortingMethod, setSortingMethod] = useState("");

  return (
    <DirectionRoot>
      <Map
        origination={origination}
        destination={destination}
        expanded={expanded}
      />
      <SearchBar
        setOrigination={setOrigination}
        setDestination={setDestination}
      />
      <DirectionList
        origination={origination}
        destination={destination}
        expanded={expanded}
        setExpanded={setExpanded}
        sortingMethod={sortingMethod}
      />
      <Fab onClick={() => setSortingDialogOpen(true)}>
        <SortIcon />
      </Fab>
      <SortingDialog
        sortingDialogOpen={sortingDialogOpen}
        setSortingDialogOpen={setSortingDialogOpen}
        setSortingMethod={setSortingMethod}
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
  position: "relative",
  ".MuiFab-root": {
    position: "absolute",
    right: "10px",
    width: "35px",
    height: "35px",
    top: "5px",
  },
});
