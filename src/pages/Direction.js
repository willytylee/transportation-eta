import { Fab, styled } from "@mui/material";
import { Sort as SortIcon } from "@mui/icons-material";
import { useContext } from "react";
import { SearchBar } from "../components/Direction/SearchBar";
import { Map } from "../components/Direction/Map";
import { DirectionList } from "../components/Direction/DirectionList";
import { SortingDialog } from "../components/Direction/SortingDialog";
import { DirectionContext } from "../context/DirectionContext";

export const Direction = () => {
  const { updateSortingDialogOpen } = useContext(DirectionContext);

  return (
    <DirectionRoot>
      <Map />
      <SearchBar />
      <DirectionList />
      <Fab onClick={() => updateSortingDialogOpen(true)}>
        <SortIcon />
      </Fab>
      <SortingDialog />
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
