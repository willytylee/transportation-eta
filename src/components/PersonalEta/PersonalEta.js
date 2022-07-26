import React, { useState, useEffect, useContext, useMemo } from "react";
import { dataSet } from "../../data/DataSet";
import { getLocalStorage } from "../../Utils";
import { AppContext } from "../../context/AppContext";
import { Section } from "./Section";

export const PersonalEta = ({ name }) => {
  const [data, setData] = useState([]);
  const { dbVersion } = useContext(AppContext);

  const gStopList = useMemo(() => {
    return getLocalStorage("stopList");
  }, [dbVersion]);

  const gRouteList = useMemo(() => {
    return getLocalStorage("routeList");
  }, [dbVersion]);

  useEffect(() => {
    setData(dataSet.find((o) => o.user === name));
  }, [name]);

  return (
    <div className="personalEta">
      {data?.transportData?.map((e, i) => (
        <Section
          key={i}
          category={e}
          gStopList={gStopList}
          gRouteList={gRouteList}
        />
      ))}
    </div>
  );
};
