import { useContext, useEffect } from "react";
import { IconButton, styled } from "@mui/material";
import { CompareArrows as CompareArrowsIcon } from "@mui/icons-material";
import { DirectionContext } from "../../context/DirectionContext";
import { useLocationOnce } from "../../hooks/Location";
import { LocationSearchBar } from "../Search/LocationSearchBar";

export const SearchBar = ({ updateMapCollapse }) => {
  const {
    origin,
    destination,
    updateCurrRoute,
    updateOrigin,
    updateDestination,
  } = useContext(DirectionContext);
  const { location: currentLocation } = useLocationOnce();

  useEffect(() => {
    updateOrigin({
      label: "你的位置",
      value: "你的位置",
      location: currentLocation,
    });
  }, [currentLocation]);

  const onDestChange = (e) => {
    updateDestination(e);
    updateCurrRoute({});
  };

  const onOrigChange = (e) => {
    updateOrigin(e);
    updateCurrRoute({});
  };

  const onFocus = () => {
    updateMapCollapse();
  };
  const onBlur = () => {
    updateMapCollapse();
  };

  const handleExchangeOnClick = () => {
    updateCurrRoute({});
    const _origin = origin;
    const _destination = destination;
    updateDestination(_origin);
    updateOrigin(_destination);
  };

  return (
    <SearchBarRoot>
      <div className="selectWrapper">
        <LocationSearchBar
          placeholder="起點"
          handleSelectOnChange={onOrigChange}
          value={origin}
          defaultValue={{
            label: "你的位置",
            value: "你的位置",
            location: currentLocation,
          }}
          defaultOptions={[
            {
              label: "你的位置",
              value: "你的位置",
              location: currentLocation,
            },
          ]}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <LocationSearchBar
          placeholder="目的地"
          handleSelectOnChange={onDestChange}
          value={destination}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
      <div className="btnWrapper">
        <IconButton onClick={handleExchangeOnClick}>
          <CompareArrowsIcon />
        </IconButton>
      </div>
    </SearchBarRoot>
  );
};

const SearchBarRoot = styled("div")({
  display: "flex",
  ".selectWrapper": {
    flex: 10,
  },
  ".btnWrapper": {
    display: "flex",
    alignItems: "center",
  },
});
