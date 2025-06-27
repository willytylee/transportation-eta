import { useContext } from "react";
import { styled, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material/";
import { EtaContext } from "../context/EtaContext";
import { DbContext } from "../context/DbContext";
import { getFirstCoByRouteObj } from "../Utils/Utils";
import { companyColor } from "../constants/Constants";
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
          const co = getFirstCoByRouteObj(routeData);
          return (
            <div className="pinItem" key={i}>
              <div className={`route ${co}`}>{routeData.route}</div>
              <div className="stop">
                <div>
                  {routeData.orig.zh} → {routeData.dest.zh}
                </div>
                <div>{gStopList[e.stopId].name.zh}</div>
              </div>
              <div className="etas">
                <Eta seq={e.seq} routeObj={routeData} slice={3} />
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
    borderBottom: "1px solid rgb(200, 200, 200)",
    fontSize: "12px",
    alignItems: "center",
    gap: "2px",
    ...companyColor,
    ...mtrLineColor,
    ".route": {
      fontSize: "16px",
      width: "10%",
    },
    ".stop": {
      width: "42%",
    },
    ".etas": {
      display: "flex",
      width: "40%",
      ".eta": {
        width: "33%",
      },
    },
    ".delete": {
      width: "8%",
    },
  },
});
