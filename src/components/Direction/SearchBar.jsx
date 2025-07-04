import { useContext, useEffect } from "react";
import AsyncSelect from "react-select/async";
import proj4 from "proj4";
import { IconButton, styled } from "@mui/material";
import { CompareArrows as CompareArrowsIcon } from "@mui/icons-material";
import { fetchLocation } from "../../fetch/Location";
import { DirectionContext } from "../../context/DirectionContext";
import { useLocationOnce } from "../../hooks/Location";

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

  const loadOptions = async (input, callback) => {
    callback(
      await fetchLocation({ q: input }).then((response) => {
        const uniqueData = [];
        const seen = new Set();

        for (const item of response) {
          const key = `${item.addressZH}|${item.nameZH}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueData.push(item);
          }
        }

        return uniqueData
          .filter(
            (e) =>
              e.addressZH
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(input.toLowerCase().replace(/\s/g, "")) ||
              e.nameZH
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(input.toLowerCase().replace(/\s/g, "")) ||
              e.districtZH
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
            const formatted = `${e.nameZH}${
              e.addressZH ? ` - ${e.addressZH}` : ""
            }${e.districtZH ? ` - ${e.districtZH}` : ""}`;
            return {
              label: formatted,
              value: formatted,
              location: { lat, lng },
            };
          });
      })
    );
  };

  const onDestChange = (e) => {
    updateDestination(e);
    updateCurrRoute({});
  };

  const onOrigChange = (e) => {
    updateOrigin(e);
    updateCurrRoute({});
  };

  const handleExchangeOnClick = () => {
    updateCurrRoute({});
    const _origin = origin;
    const _destination = destination;
    updateDestination(_origin);
    updateOrigin(_destination);
  };

  const onFocus = () => {
    updateMapCollapse();
  };
  const onBlur = () => {
    updateMapCollapse();
  };

  const defaultOptions = [
    {
      label: "你的位置",
      value: "你的位置",
      location: currentLocation,
    },
    // {
    //   label: "康華苑 - 連德道   2號",
    //   value: "康華苑 - 連德道   2號",
    //   location: {
    //     lat: 22.31387909231962,
    //     lng: 114.24009654515417,
    //   },
    // },
    // {
    //   label: "富邦大廈 - 漆咸道北   451-455A號",
    //   value: "富邦大廈 - 漆咸道北   451-455A號",
    //   location: {
    //     lat: 22.31307838747235,
    //     lng: 114.18655077345633,
    //   },
    // },
    // {
    //   label: "機電工程署總部大樓 - 啓成街   3號",
    //   value: "機電工程署總部大樓 - 啓成街   3號",
    //   location: {
    //     lat: 22.325746394805208,
    //     lng: 114.20358639601292,
    //   },
    // },
  ];

  return (
    <SearchBarRoot>
      <div className="selectWrapper">
        <AsyncSelect
          loadOptions={loadOptions}
          onChange={onOrigChange}
          defaultOptions={defaultOptions}
          defaultValue={{
            label: "你的位置",
            value: "你的位置",
            location: currentLocation,
          }}
          cacheOptions
          value={origin}
          placeholder="起點"
          className="asyncSelect"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          defaultOptions={defaultOptions}
          onChange={onDestChange}
          value={destination}
          placeholder="目的地"
          className="asyncSelect"
          onFocus={onFocus}
          onBlur={onBlur}
          styles={{
            option: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? "grey" : "red",
              fontSize: "11px",
            }),
          }}
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
