import React, { useState, useEffect, useContext, useMemo } from "react";
import { Section } from "./../components/Section";
import { useParams } from "react-router-dom";
import { dataSet } from "./../data/DataSet";
import { getLocalStorage } from "../Utils";
import { AppContext } from "../context/AppContext";

export const PersonalEta = () => {
  const [data, setData] = useState(dataSet[0]);
  const { dbVersion } = useContext(AppContext);
  const { name } = useParams();

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
    <>
      {data.transportData.map((e, i) => (
        <Section
          key={i}
          category={e}
          gStopList={gStopList}
          gRouteList={gRouteList}
        />
      ))}
    </>
  );
};
