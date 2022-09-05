import { useContext, useMemo } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import { DialogTitle, Grid, IconButton, styled } from "@mui/material";
import { getCoByStopObj } from "../../Utils/Utils";
import { companyMap, companyColor } from "../../constants/Constants";
import { EtaContext } from "../../context/EtaContext";
import { etaExcluded, routeMap } from "../../constants/Mtr";
import { StopEta } from "../Search/StopEta";
import { MtrStopEta } from "../Search/MtrStopEta";
import { DbContext } from "../../context/DbContext";

export const Header = ({ handleDialogOnClose }) => {
  const { currRoute, mapStopIdx } = useContext(EtaContext);
  const { gStopList } = useContext(DbContext);

  const currRouteStopIdList = useMemo(
    () => currRoute.stops && currRoute.stops[Object.keys(currRoute.stops)[0]],
    [currRoute]
  );

  const currRouteStopList = useMemo(
    () => currRouteStopIdList?.map((e) => gStopList[e]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currRoute]
  );

  return (
    <DialogTitleRoot>
      <Grid>
        <div className="headerWrapper">
          <div className="coRoute">
            {getCoByStopObj(currRoute)
              .map((e, i) => (
                <span className={e} key={i}>
                  {companyMap[e]}
                  {currRoute.co[0] === "mtr" && (
                    <span className={`${currRoute.route}`}>
                      {" "}
                      {routeMap[currRoute.route]}
                    </span>
                  )}
                </span>
              ))
              .reduce((a, b) => [a, " + ", b])}{" "}
            <span className="route">
              {currRoute.co[0] !== "mtr" && currRoute.route}
            </span>
          </div>
          <div className="destSpecial">
            {currRoute.orig?.zh}{" "}
            {currRoute.co[0] === "mtr" ? (
              <> ←→ {currRoute.dest?.zh}</>
            ) : (
              <>
                → <span className="dest">{currRoute.dest?.zh}</span>
              </>
            )}
            {etaExcluded.includes(currRoute.route) && (
              <span className="star"> 沒有相關班次資料</span>
            )}
            <span className="special">
              {" "}
              {parseInt(currRoute.serviceType, 10) !== 1 && "特別班次"}
            </span>
          </div>
          {mapStopIdx !== -1 &&
            (currRoute.co[0] === "mtr" ? (
              <MtrStopEta
                seq={mapStopIdx + 1}
                routeObj={currRoute}
                stopObj={currRouteStopList[mapStopIdx]}
                MtrStopEtaRoot={MtrStopEtaRoot}
              />
            ) : (
              <StopEta
                seq={mapStopIdx + 1}
                routeObj={currRoute}
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
  padding: "4px 8px",
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
      ".coRoute": {
        ...companyColor,
        ".route": {
          fontWeight: "900",
        },
      },
      ".destSpecial": {
        ".dest": {
          fontWeight: 900,
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
  width: "100%",
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
    gap: "8px",
  },
});
