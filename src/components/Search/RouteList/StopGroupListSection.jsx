import { useState, useEffect, useContext } from "react";
import { buildRouteObjForEta } from "../../../Utils/Utils";
import { DbContext } from "../../../context/DbContext";
import { StopGroupListSectionItem } from "./StopGroupListSectionItem";

export const StopGroupListSection = ({ category, setNearbyDialogOpen }) => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const [etasResult, setEtasResult] = useState([]);

  useEffect(() => {
    const intervalContent = async () => {
      const categoryEtas = await buildRouteObjForEta(
        gStopList,
        gRouteList,
        category.routes
      );
      setEtasResult(categoryEtas);
    };

    intervalContent();
    const interval = setInterval(intervalContent, 30000);

    return () => clearInterval(interval);
  }, [category]);

  return (
    <>
      {etasResult
        .sort((a, b) => {
          if (a.etas.length === 0) {
            return 1;
          }
          if (b.etas.length === 0) {
            return -1;
          }
          return false;
        })
        .map((eta, i) => (
          <StopGroupListSectionItem
            key={i}
            eta={eta}
            setNearbyDialogOpen={setNearbyDialogOpen}
          />
        ))}
    </>
  );
};
