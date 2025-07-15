import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  IconButton,
} from "@mui/material";
import {
  Directions as DirectionsIcon,
  BookmarkAdd as BookmarkAddIcon,
  Streetview as StreetviewIcon,
  PushPin as PushPinIcon,
  Radar as RadarIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { primaryColor } from "../../constants/Constants";
import { MtrStopEta } from "./MtrStopEta";
import { StopEta } from "./StopEta";

export const StopListAccordion = ({
  routeData,
  stopListRenderKey,
  stop,
  stopIdx,
  isNearestStop,
  lat,
  lng,
  handlePinOnClick,
  handleNearbyOnClick,
  handleBookmarkAddOnClick,
  handleAccordionOnChange,
}) => {
  const { routeKey, stopId } = useParams();
  const [renderKey, setRenderKey] = useState(0);

  const handleRefreshOnClick = () => {
    setRenderKey(renderKey + 1);
  };

  useEffect(() => {
    setRenderKey(renderKey + stopListRenderKey);
  }, [stopListRenderKey]);

  return (
    <AccordionRoot
      expanded={stopId === stop?.stopId}
      onChange={() =>
        handleAccordionOnChange({
          _stopId: stop.stopId,
          mapLocation: { lat, lng },
          mapStopIdx: stopIdx,
        })
      }
      className={isNearestStop ? "highlighted" : ""}
      title={stop.stopId}
    >
      <AccordionSummary className="accordionSummary">
        {routeData.co[0] === "mtr" ? (
          <MtrStopEta
            seq={stopIdx + 1}
            routeObj={routeData}
            stopObj={stop}
            key={renderKey}
          />
        ) : (
          <StopEta
            seq={stopIdx + 1}
            routeObj={routeData}
            stopObj={stop}
            slice={3}
            key={renderKey}
          />
        )}
      </AccordionSummary>
      <AccordionDetails className="iconWrapper">
        <IconButton
          className="iconBtn"
          component="a"
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`}
          target="_blank"
        >
          <DirectionsIcon />
          <div>前往車站</div>
        </IconButton>
        <IconButton
          className="iconBtn"
          component="a"
          href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=0&pitch=0&fov=160`}
          target="_blank"
        >
          <StreetviewIcon />
          <div>街景</div>
        </IconButton>
        <IconButton
          className="iconBtn"
          onClick={() => {
            if (routeData.co[0] === "mtr") {
              handleBookmarkAddOnClick({
                routeKey,
                stopId: stop.stopId,
              });
            } else {
              handleBookmarkAddOnClick({
                seq: stopIdx + 1,
                stopId: stop.stopId,
                routeKey,
              });
            }
          }}
        >
          <BookmarkAddIcon />
          <div>書籤</div>
        </IconButton>
        <IconButton
          className="iconBtn"
          onClick={() => handlePinOnClick(stopIdx + 1, routeKey, stop.stopId)}
        >
          <PushPinIcon />
          <div>置頂</div>
        </IconButton>
        <IconButton
          className="iconBtn"
          onClick={() => handleNearbyOnClick(stop.stopId)}
        >
          <RadarIcon />
          <div>附近路線</div>
        </IconButton>
        <IconButton className="iconBtn" onClick={handleRefreshOnClick}>
          <RefreshIcon />
          <div>更新時間</div>
        </IconButton>
      </AccordionDetails>
    </AccordionRoot>
  );
};

const AccordionRoot = styled(Accordion)({
  "&:before": {
    backgroundColor: "unset",
  },
  "&.Mui-expanded": {
    backgroundColor: `${primaryColor}17`,
    padding: "4px 6px 0px",
  },
  "&.highlighted": { backgroundColor: "lightblue" },
  padding: "0 6px",
  borderBottom: "0.1px solid #eaeaea",
  margin: "0 !important",
  boxShadow: "unset",
  ".accordionSummary": {
    minHeight: "0 !important",
    padding: "0",
    ".MuiAccordionSummary-content": {
      margin: 0,
    },
  },
  ".MuiCollapse-root": {
    ".iconWrapper": {
      padding: "0",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(50px, max-content))",
      gridGap: "4px",
      justifyContent: "center",
      ".iconBtn": {
        padding: "0px",
        flexDirection: "column",
        fontSize: "10px",
        height: "50px",
        width: "50px",
      },
    },
  },
});
