import React, { useState, useEffect } from "react";
import { Section } from "./../components/Section";
import { useParams } from "react-router-dom";
import { dataSet } from "./../data/DataSet";
import { getLocalStorage } from "../Utils";

export const PersonalEta = () => {
  const [data, setData] = useState(dataSet[0]);
  const { name } = useParams();

  const gStopList = getLocalStorage("stopList");

  useEffect(() => {
    setData(dataSet.find((o) => o.user === name));
  }, [name]);

  return (
    <>
      {data.transportData.map((e, i) => (
        <Section key={i} category={e} gStopList={gStopList} />
      ))}
    </>
  );
};
