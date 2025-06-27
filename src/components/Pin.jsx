import { useContext } from "react";
import { styled, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material/";
import { EtaContext } from "../context/EtaContext";
import { DbContext } from "../context/DbContext";
import { getCoIconByRouteObj } from "../Utils/Utils";
import { companyColor, companyIconMap } from "../constants/Constants";
import { mtrLineColor } from "../constants/Mtr";
import { Eta } from "./Search/RouteList/Eta";

export const Pin = () => {
  const { pinList, updatePinList } = useContext(EtaContext);
  const { gRouteList, gStopList } = useContext(DbContext);

  const handleRemovePinItem = (index) => {
    updatePinList(pinList.filter((_, i) => i !== index));
  };

  return (
    <PinRoot>
      {pinList &&
        pinList.map((e, i) => {
          const routeData = gRouteList[e.routeKey];
          return (
            <div className="pinItem" key={i}>
              <div className="text">
                <div className="top">
                  <img
                    className={`transportIcon ${routeData.route}`}
                    src={companyIconMap[getCoIconByRouteObj(routeData)]}
                  />
                  <div className="route">{routeData.route}</div>
                  <div className="path">
                    <span>{routeData.orig.zh}</span>→
                    <span className="dest">{routeData.dest.zh}</span>
                  </div>
                </div>
                <div className="bottom">
                  <div className="stop">
                    <div>{gStopList[e.stopId].name.zh}</div>
                  </div>
                  <div className="etas">
                    <Eta seq={e.seq} routeObj={routeData} slice={3} />
                  </div>
                </div>
              </div>
              <IconButton
                className="delete"
                onClick={() => handleRemovePinItem(i)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          );
        })}
    </PinRoot>
  );
};

const PinRoot = styled("div")({
  ".pinItem": {
    padding: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgb(200, 200, 200)",
    fontSize: "12px",
    gap: "2px",
    ...companyColor,
    ...mtrLineColor,
    ".text": {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      ".top": {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        paddingBottom: "4px",
        ".transportIcon": {
          height: "16px",
        },
        ".route": {
          fontSize: "16px",
          width: "10%",
          fontWeight: 900,
        },
        ".path": {
          display: "flex",
          gap: "2px",
          alignItems: "center",
          ".dest": {
            fontWeight: 900,
          },
        },
      },
      ".bottom": {
        display: "flex",
        ".stop": {
          width: "50%",
        },
        ".etas": {
          display: "flex",
          width: "50%",
          ".eta": {
            width: "33%",
          },
        },
      },
    },
    ".delete": {
      width: "8%",
    },
  },
});
