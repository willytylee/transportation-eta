import { useContext } from "react";
import { Fab, styled } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { SearchBar } from "../components/Direction/SearchBar";
import { Map } from "../components/Direction/Map";
import { DirectionList } from "../components/Direction/DirectionList";
import { SortingDialog } from "../components/Direction/SortingDialog";
import { DirectionContext } from "../context/DirectionContext";
import { SettingDialog } from "../components/Direction/SettingDialog";
import { DisplayDialog } from "../components/Direction/DisplayDialog";

export const Direction = () => {
  const { updateSettingDialogOpen, mapCollapse, updateMapCollapse } =
    useContext(DirectionContext);

  return (
    <DirectionRoot>
      <Map mapCollapse={mapCollapse} />
      <SearchBar updateMapCollapse={updateMapCollapse} />
      <DirectionList />
      <Fab
        className="settingsFab"
        onClick={() => updateSettingDialogOpen(true)}
      >
        <SettingsIcon />
      </Fab>
      <SortingDialog />
      <SettingDialog />
      <DisplayDialog />
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
    width: "35px",
    height: "35px",
    top: "10px",
    "&.settingsFab": {
      right: "10px",
    },
  },
});
