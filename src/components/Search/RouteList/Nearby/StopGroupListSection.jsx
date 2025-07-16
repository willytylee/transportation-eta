import { useState, useEffect, useContext } from "react";
import { buildRouteObjForEta } from "../../../../Utils/Utils";
import { DbContext } from "../../../../context/DbContext";
import { StopGroupListSectionItem } from "./StopGroupListSectionItem";

export const StopGroupListSection = ({
  category,
  setNearbyDialogOpen,
  showNoEta,
  transportCo,
}) => {
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
        .filter((e) => !(!showNoEta && e.etas.length === 0))
        .filter((e) => transportCo.includes(e.co))
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
