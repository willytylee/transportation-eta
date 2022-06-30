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
      {data.transportData.map((category, i) => (
        <Section key={i} category={category} />
      ))}
      <div className="refresh-wrapper">
        <button onClick={() => window.location.reload()}>
          Refresh to update the app
        </button>
      </div>
    </>
  );
};
