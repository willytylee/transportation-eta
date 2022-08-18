import { useContext, useMemo } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import { DialogTitle, Grid, IconButton, styled } from "@mui/material";
import { getCoByStopObj } from "../../Utils";
import { companyMap, companyColor } from "../../constants/Constants";
import { useCorrectBound } from "../../hooks/Bound";
import { EtaContext } from "../../context/EtaContext";
import { etaExcluded, routeMap } from "../../constants/Mtr";
import { StopEta } from "../Search/StopEta";
import { MtrStopEta } from "../Search/MtrStopEta";
import { DbContext } from "../../context/DbContext";

export const Header = ({ handleDialogOnClose }) => {
  const { currRoute, mapStopIdx } = useContext(EtaContext);
  const { gStopList } = useContext(DbContext);
  const { correctBound, isBoundLoading } = useCorrectBound({
    routeObj: currRoute,
  });

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
              .map((e, i) => {
                return (
                  <span className={e} key={i}>
                    {companyMap[e]}
                    {currRoute.co[0] === "mtr" && (
                      <span className={`${currRoute.route}`}>
                        {" "}
                        {routeMap[currRoute.route]}
                      </span>
                    )}
                  </span>
                );
              })
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
              <div className="mtrStopEtaWrapper">
                <div className="seqStop">
                  {mapStopIdx + 1}. {currRouteStopList[mapStopIdx]?.name.zh}
                </div>
                {etaExcluded.includes(currRoute.route) ? (
                  <div className="noEta">沒有相關班次資料</div>
                ) : (
                  <MtrStopEta
                    seq={mapStopIdx + 1}
                    routeObj={currRoute}
                    stopObj={currRouteStopList[mapStopIdx]}
                    MtrStopEtaRoot={MtrStopEtaRoot}
                  />
                )}
              </div>
            ) : (
              <StopEta
                seq={mapStopIdx + 1}
                routeObj={currRoute}
                stopObj={currRouteStopList[mapStopIdx]}
                bound={correctBound}
                isBoundLoading={isBoundLoading}
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
  padding: "4px 8px",
  ".MuiGrid-root": {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    fontSize: "14px",
    ".closeBtn": {
      position: "absolute",
      right: 0,
    },
    ".headerWrapper": {
      width: "100%",
      ".coRoute": {
        ...companyColor,
        ".route": {
          fontWeight: "900",
          letterSpacing: "-0.5px",
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
      ".mtrStopEtaWrapper": {
        display: "flex",
        width: "100%",
        alignItems: "center",
        margin: 0,
        ".seqStop": {
          width: "90px",
          paddingRight: "10px",
        },
        ".noEta": {
          textAlign: "right",
          width: "80%",
          padding: "4px 0",
        },
      },
    },
  },
});

const MtrStopEtaRoot = styled("div")({
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  ".etaWrapper": {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    ".arriveText": {
      width: "25%",
    },
    ".ttntWrapper": {
      width: "65%",
      display: "flex",
      flexDirection: "row",
      ".ttnt": {
        width: "33.33%",
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
