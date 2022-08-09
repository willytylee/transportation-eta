import { useContext, useMemo } from "react";
import { Section } from "../components/PersonalEta/Section";
import { AppContext } from "../context/AppContext";
import { getLocalStorage } from "../Utils";

export const Compare = () => {
  const { dbVersion } = useContext(AppContext);

  const gStopList = useMemo(() => getLocalStorage("stopList"), [dbVersion]);
  const gRouteList = useMemo(() => getLocalStorage("routeList"), [dbVersion]);

  const data = [
    {
      seq: 11,
      co: "kmb",
      route: "13X",
      stopId: "AA97FFC49AE957A5",
    },
    {
      seq: 26,
      co: "kmb",
      route: "213X",
      stopId: "AA97FFC49AE957A5",
    },
    {
      seq: 15,
      co: "kmb",
      route: "224X",
      stopId: "AA97FFC49AE957A5",
    },
  ];
  const category = {
    title: "路線比較",
    data: [data],
  };
  return (
    <>
      <Section
        category={category}
        gStopList={gStopList}
        gRouteList={gRouteList}
      />
    </>
  );
};
