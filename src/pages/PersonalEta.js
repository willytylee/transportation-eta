import React, { useState, useEffect } from "react";
import { Section } from "./../components/Section";
import { useParams } from "react-router-dom";
import { dataSet } from "./../data/DataSet";

export const PersonalEta = () => {
  const [data, setData] = useState(dataSet[0]);
  const { name } = useParams();

  useEffect(() => {
    setData(dataSet.find((o) => o.user === name));
  }, [name]);

  return (
    <>
      {data.transportData.map((item, i) => (
        <Section key={i} category={item} />
      ))}
    </>
  );
};
