import { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Close as CloseIcon } from "@mui/icons-material";
import { DialogTitle, Grid, IconButton, styled } from "@mui/material";
import { getCoIconByRouteObj } from "../../Utils/Utils";
import { companyIconMap } from "../../constants/Constants";
import { EtaContext } from "../../context/EtaContext";
import { etaExcluded, mtrIconColor, routeMap } from "../../constants/Mtr";
import { StopEta } from "../Search/StopEta";
import { MtrStopEta } from "../Search/MtrStopEta";
import { DbContext } from "../../context/DbContext";

export const Header = ({ handleDialogOnClose }) => {
  const { mapStopIdx } = useContext(EtaContext);
  const { gRouteList, gStopList } = useContext(DbContext);
  const { routeKey } = useParams();

  const _currRoute = gRouteList[routeKey];
  const currRouteStopIdList = useMemo(() => _currRoute.stops && _currRoute.stops[Object.keys(_currRoute.stops)[0]], [routeKey]);
  const currRouteStopList = useMemo(() => currRouteStopIdList?.map((e) => gStopList[e]), [routeKey]);

  return (
    <DialogTitleRoot>
      <Grid>
        <div className="headerWrapper">
          <div className="coRoute">
            <div className="transportIconWrapper">
              <img className={`transportIcon ${_currRoute.route}`} src={companyIconMap[getCoIconByRouteObj(_currRoute)]} alt="" />
            </div>
            {_currRoute.co[0] === "mtr" && (
              <div className="routeWrapper">
                <div className={_currRoute.route}>{routeMap[_currRoute.route]}</div>
              </div>
            )}
            <span className="route">{_currRoute.co[0] !== "mtr" && _currRoute.route}</span>
          </div>
          <div className="destSpecial">
            {_currRoute.orig?.zh}{" "}
            {_currRoute.co[0] === "mtr" ? (
              <> ←→ {_currRoute.dest?.zh}</>
            ) : (
              <>
                → <span className="dest">{_currRoute.dest?.zh}</span>
              </>
            )}
            {etaExcluded.includes(_currRoute.route) && <span className="star"> 沒有相關班次資料</span>}
            <span className="special"> {parseInt(_currRoute.serviceType, 10) !== 1 && "特別班次"}</span>
          </div>
          {mapStopIdx !== -1 &&
            (_currRoute.co[0] === "mtr" ? (
              <MtrStopEta seq={mapStopIdx + 1} routeObj={_currRoute} stopObj={currRouteStopList[mapStopIdx]} MtrStopEtaRoot={MtrStopEtaRoot} />
            ) : (
              <StopEta seq={mapStopIdx + 1} routeObj={_currRoute} stopObj={currRouteStopList[mapStopIdx]} StopEtaRoot={StopEtaRoot} />
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
      ".coRoute": {
        display: "flex",
        alignItems: "center",
        ".transportIconWrapper": {
          display: "flex",
          ...mtrIconColor,
          ".transportIcon": {
            height: "18px",
          },
        },
        ".route": {
          fontWeight: "900",
        },
      },
      ".destSpecial": {
        ".dest": {
          fontWeight: 900,
          fontSize: "16px",
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
