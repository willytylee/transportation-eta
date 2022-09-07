import { useState } from "react";
import AsyncSelect from "react-select/async";
import proj4 from "proj4";
import { IconButton, styled } from "@mui/material";
import { Sort as SortIcon } from "@mui/icons-material";
import { fetchLocation } from "../../fetch/Location";
import { SortingDialog } from "./SortingDialog";

export const SearchBar = ({ setDestination }) => {
  const [sortingDialogOpen, setSortingDialogOpen] = useState(false);

  const loadOptions = async (input, callback) => {
    callback(
      await fetchLocation({ q: input }).then((response) =>
        response
          .filter(
            (e) =>
              e.addressZH
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(input.toLowerCase().replace(/\s/g, "")) ||
              e.nameZH
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(input.toLowerCase().replace(/\s/g, ""))
          )
          .map((e) => {
            const [lng, lat] = proj4(
              "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=m +no_defs",
              "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
              [e.x, e.y]
            );
            return {
              label: `${e.nameZH} - ${e.addressZH}`,
              value: `${e.nameZH} - ${e.addressZH}`,
              location: {
                lat,
                lng,
              },
            };
          })
      )
    );
  };

  const onChange = (e) => {
    setDestination(e);
  };

  return (
    <SearchBarRoot>
      <AsyncSelect
        isClearable
        loadOptions={loadOptions}
        onChange={onChange}
        className="asyncSelect"
      />
      <IconButton onClick={() => setSortingDialogOpen(true)}>
        <SortIcon />
      </IconButton>
      <SortingDialog
        sortingDialogOpen={sortingDialogOpen}
        setSortingDialogOpen={setSortingDialogOpen}
      />
    </SearchBarRoot>
  );
};

const SearchBarRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  margin: "14px",
  ".asyncSelect": {
    width: "100%",
  },
});
