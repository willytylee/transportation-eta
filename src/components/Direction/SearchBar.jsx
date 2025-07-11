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
              label: `${item.nameZH}${
                item.addressZH ? ` - ${item.addressZH}` : ""
              }${item.districtZH ? ` - ${item.districtZH}` : ""}`,
              labelEn: item.nameEN.toLowerCase(),
              location: { lat, lng },
            });
          }
        }

        const stopList = Object.values(gStopList).filter(
          (e) =>
            e.name.en.toLowerCase().includes(input.toLowerCase()) ||
            e.name.zh.includes(input)
        );

        for (const item of stopList) {
          const key = `${item.name.zh}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueData.push({
              label: item.name.zh,
              labelEn: item.name.en.toLowerCase(),
              location: { lat: item.location.lat, lng: item.location.lng },
            });
          }
        }

        return uniqueData
          .sort((x, y) => {
            // Check for exact match
            const xIsExact =
              x.label === input || x.labelEn === input.toLowerCase();
            const yIsExact =
              y.label === input || y.labelEn === input.toLowerCase();

            // Check if input is included at the start
            const xStartsWith =
              (x.label.startsWith(input) ||
                x.labelEn.startsWith(input.toLowerCase())) &&
              !xIsExact;
            const yStartsWith =
              (y.label.startsWith(input) ||
                y.labelEn.startsWith(input.toLowerCase())) &&
              !yIsExact;

            // Check if input is included but not at the start
            const xIncludes =
              (x.label.includes(input) ||
                x.labelEn.includes(input.toLowerCase())) &&
              !xIsExact &&
              !xStartsWith;
            const yIncludes =
              (y.label.includes(input) ||
                y.labelEn.includes(input.toLowerCase())) &&
              !yIsExact &&
              !yStartsWith;

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
            return x.label.localeCompare(y.label);
          })
          .slice(0, 30)
          .map((e) => ({
            label: e.label,
            value: e.label,
            location: e.location,
          }));
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

  const defaultValue = {
    label: "你的位置",
    value: "你的位置",
    location: currentLocation,
  };
  const defaultOptions = [defaultValue];

  return (
    <SearchBarRoot>
      <div className="selectWrapper">
        <AsyncSelect
          loadOptions={loadOptions}
          onChange={onOrigChange}
          defaultOptions={defaultOptions}
          defaultValue={defaultValue}
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
