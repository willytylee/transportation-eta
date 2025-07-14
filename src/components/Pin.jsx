import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  styled,
  IconButton,
  List,
  ListItemButton,
  ListItem,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material/";
import { EtaContext } from "../context/EtaContext";
import { DbContext } from "../context/DbContext";
import { companyColor } from "../constants/Constants";
import { TransportSign } from "./Direction/Box/TransportSign";
import { StopEta } from "./Search/StopEta";
import { MtrStopEta } from "./Search/MtrStopEta";

export const Pin = () => {
  const navigate = useNavigate();
  const { pinList, updatePinList } = useContext(EtaContext);
  const { gRouteList, gStopList } = useContext(DbContext);

  const handleRemovePinItem = (index) => {
    updatePinList(pinList.filter((_, i) => i !== index));
  };

  const handlePinItemOnClick = (routeKey, stopId) => {
    navigate("/search/" + routeKey + "/" + stopId, {
      replace: true,
    });
  };

  const mtrStopEtaChildStyles = {
    paddingTop: 0,
    paddingBottom: 0,
    ".etaWrapper": {
      paddingTop: "0 !important",
      paddingBottom: "0 !important",
      ".ttntWrapper": { width: "150px !important;" },
    },
  };

  const stopEtaChildStyles = {
    paddingTop: 0,
    paddingBottom: 0,
    ".etas": {
      width: "120px",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      ".eta": {
        width: "33.33%",
      },
    },
  };

  return (
    <PinRoot>
      <List disablePadding>
        {pinList &&
          pinList.map((e, i) => {
            const routeData = gRouteList[e.routeKey];
            return (
              <ListItem
                key={i}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    className="delete"
                    onClick={() => handleRemovePinItem(i)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  className="pinItem"
                  onClick={() => handlePinItemOnClick(e.routeKey, e.stopId)}
                >
                  <div className="text">
                    <div className="top">
                      <TransportSign routeObj={routeData} />
                      <div className="path">
                        <span>{routeData.orig.zh}</span>→
                        <span className="dest">{routeData.dest.zh}</span>
                      </div>
                    </div>
                    <div className="bottom">
                      {routeData.co[0] === "mtr" ? (
                        <MtrStopEta
                          seq={e.seq}
                          routeObj={routeData}
                          stopObj={gStopList[e.stopId]}
                          childStyles={mtrStopEtaChildStyles}
                        />
                      ) : (
                        <StopEta
                          seq={e.seq}
                          routeObj={routeData}
                          stopObj={gStopList[e.stopId]}
                          slice={3}
                          childStyles={stopEtaChildStyles}
                        />
                      )}
                    </div>
                  </div>
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </PinRoot>
  );
};

const PinRoot = styled("div")({
  maxHeight: "130px",
  overflowY: "auto",
  overflowX: "hidden",
  ".pinItem": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgb(200, 200, 200)",
    fontSize: "12px",
    gap: "2px",
    paddingTop: "3px",
    paddingBottom: "0px",
    paddingLeft: "8px",
    ...companyColor,
    ".text": {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      ".top": {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        paddingBottom: "0",
        ".route": {
          fontSize: "15px",
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
    },
    ".delete": {
      width: "8%",
    },
  },
});
