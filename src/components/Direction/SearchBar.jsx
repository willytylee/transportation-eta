import { useContext, useEffect } from "react";
import AsyncSelect from "react-select/async";
import proj4 from "proj4";
import { IconButton, styled } from "@mui/material";
import { CompareArrows as CompareArrowsIcon } from "@mui/icons-material";
import { fetchLocation } from "../../fetch/Location";
import { DirectionContext } from "../../context/DirectionContext";
import { useLocationOnce } from "../../hooks/Location";
import { DbContext } from "../../context/DbContext";

export const SearchBar = ({ updateMapCollapse }) => {
  const {
    origin,
    destination,
    updateCurrRoute,
    updateOrigin,
    updateDestination,
  } = useContext(DirectionContext);
  const { location: currentLocation } = useLocationOnce();

  const { gStopList } = useContext(DbContext);

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
          const key = `${item.nameZH}`;
          if (!seen.has(key)) {
            const [lng, lat] = proj4(
              "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=m +no_defs",
              "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
              [item.x, item.y]
            );
            seen.add(key);
            uniqueData.push({
              nameZH: item.nameZH,
              addressZH: item.addressZH,
              districtZH: item.districtZH,
              location: { lat, lng },
            });
          }
        }

        for (const item of Object.values(gStopList)) {
          const key = `${item.name.zh}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueData.push({
              nameZH: item.name.zh,
              addressZH: "",
              districtZH: "",
              location: { lat: item.location.lat, lng: item.location.lng },
            });
          }
        }

        const result = uniqueData
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
          .sort((x, y) => {
            // Check for exact match
            const xIsExact = x.nameZH === input;
            const yIsExact = y.nameZH === input;

            // Check if input is included at the start
            const xStartsWith = x.nameZH.startsWith(input) && !xIsExact;
            const yStartsWith = y.nameZH.startsWith(input) && !yIsExact;

            // Check if input is included but not at the start
            const xIncludes =
              x.nameZH.includes(input) && !xIsExact && !xStartsWith;
            const yIncludes =
              y.nameZH.includes(input) && !yIsExact && !yStartsWith;

            // Priority 1: Exact matches
            if (xIsExact && !yIsExact) return -1;
            if (!xIsExact && yIsExact) return 1;

            // Priority 2: Text included at the start
            if (xStartsWith && !yStartsWith) return -1;
            if (!xStartsWith && yStartsWith) return 1;

            // Priority 3: Text included but not at the start
            if (xIncludes && !yIncludes) return -1;
            if (!xIncludes && yIncludes) return 1;

            // Priority 4: Alphabetical order for the rest
            return x.nameZH.localeCompare(y.nameZH);
          })
          .map((e) => {
            const formatted = `${e.nameZH}${
              e.addressZH ? ` - ${e.addressZH}` : ""
            }${e.districtZH ? ` - ${e.districtZH}` : ""}`;
            const { lat, lng } = e.location;
            return {
              label: formatted,
              value: formatted,
              location: { lat, lng },
            };
          });

        return result;
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
          loadingMessage={() => "載入地點中..."}
          styles={{
            option: (baseStyles) => ({
              ...baseStyles,
              fontSize: "11px",
            }),
          }}
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
          loadingMessage={() => "載入地點中..."}
          styles={{
            option: (baseStyles) => ({
              ...baseStyles,
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
