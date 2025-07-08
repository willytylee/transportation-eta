import { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Close as CloseIcon } from "@mui/icons-material";
import { DialogTitle, Grid, IconButton, styled } from "@mui/material";
import { getCoIconByRouteObj } from "../../../../Utils/Utils";
import { companyIconMap } from "../../../../constants/Constants";
import { EtaContext } from "../../../../context/EtaContext";
import { etaExcluded, mtrLineColor, routeMap } from "../../../../constants/Mtr";
import { StopEta } from "../../StopEta";
import { MtrStopEta } from "../../MtrStopEta";
import { DbContext } from "../../../../context/DbContext";

export const Header = ({ handleDialogOnClose }) => {
  const { mapStopIdx } = useContext(EtaContext);
  const { gRouteList, gStopList } = useContext(DbContext);
  const { routeKey } = useParams();

  const routeData = routeKey ? gRouteList[routeKey] : [];
  const currRouteStopIdList = useMemo(
    () => routeData.stops && routeData.stops[Object.keys(routeData.stops)[0]],
    [routeKey]
  );
  const currRouteStopList = useMemo(
    () => currRouteStopIdList?.map((e) => gStopList[e]),
    [routeKey]
  );

  return (
    <DialogTitleRoot>
      <Grid>
        <div className="headerWrapper">
          <div className="coRoute">
            <div className="transportIconWrapper">
              <img
                className={`transportIcon ${routeData.route}`}
                src={companyIconMap[getCoIconByRouteObj(routeData)]}
                alt=""
              />
            </div>
            {routeData.co[0] === "mtr" && (
              <div className="routeWrapper">
                <div className={`route ${routeData.route}`}>
                  {routeMap[routeData.route]}
                </div>
              </div>
            )}
            <span className="route">
              {routeData.co[0] !== "mtr" && routeData.route}
            </span>
          </div>
          <div className="destSpecial">
            {routeData.orig?.zh}{" "}
            {routeData.co[0] === "mtr" ? (
              <> ←→ {routeData.dest?.zh}</>
            ) : (
              <>
                → <span className="dest">{routeData.dest?.zh}</span>
              </>
            )}
            {etaExcluded.includes(routeData.route) && (
              <span className="star"> 沒有相關班次資料</span>
            )}
            <span className="special">
              {" "}
              {parseInt(routeData.serviceType, 10) !== 1 && "特別班次"}
            </span>
          </div>
          {mapStopIdx !== -1 &&
            (routeData.co[0] === "mtr" ? (
              <MtrStopEta
                seq={mapStopIdx + 1}
                routeObj={routeData}
                stopObj={currRouteStopList[mapStopIdx]}
                MtrStopEtaRoot={MtrStopEtaRoot}
              />
            ) : (
              <StopEta
                seq={mapStopIdx + 1}
                routeObj={routeData}
                stopObj={currRouteStopList[mapStopIdx]}
                StopEtaRoot={StopEtaRoot}
              />
            ))}
        </div>
        <IconButton className="closeBtn" onClick={handleDialogOnClose}>
          <CloseIcon />
        </IconButton>
      </Grid>
    </DialogTitleRoot>
  );
};

const DialogTitleRoot = styled(DialogTitle)({
  background: "white",
  color: "black",
  padding: "4px 8px !important",
  ".MuiGrid-root": {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    fontSize: "14px",
    ".closeBtn": {
      position: "absolute",
      right: 0,
      color: "rgba(0, 0, 0, 0.54)",
    },
    ".headerWrapper": {
      width: "100%",
      fontWeight: "normal",
      ".coRoute": {
        display: "flex",
        alignItems: "center",
        ".transportIconWrapper": {
          display: "flex",
          ".transportIcon": {
            height: "18px",
            ...mtrLineColor,
          },
        },
        ".route": {
          fontWeight: "900",
          ...mtrLineColor,
        },
      },
      ".destSpecial": {
        fontSize: "13px",
        ".dest": {
          fontWeight: 900,
          fontSize: "15px",
        },
        ".special": {
          fontSize: "12px",
        },
      },
    },
  },
});

const MtrStopEtaRoot = styled("div")({
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  alignItems: "center",
  ".seq": {
    width: "35px",
  },
  ".stop": {
    width: "65px",
  },
  ".noEta": {
    textAlign: "center",
    width: "80%",
    padding: "4px 0",
  },
  ".etasWrapper": {
    width: "100%",
    ".etaWrapper": {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      ".arriveText": {
        width: "70px",
        ".dest": {
          paddingLeft: "4px",
        },
      },
      ".ttntWrapper": {
        width: "55%",
        display: "flex",
        flexDirection: "row",
        ".ttnt": {
          width: "33.33%",
        },
      },
    },
  },
});

const StopEtaRoot = styled("div")({
  display: "flex",
  fontSize: "13px",
  ".seq": {
    width: "8%",
  },
  ".stop": {
    display: "flex",
    flexGrow: "1",
  },
  ".etas": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: "5px",
    flexShrink: 0,
  },
});
