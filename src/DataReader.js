import { useState, useEffect } from "react";
import { Buses } from "./components/Bus/Buses.js";
import { MTRs } from "./components/MTR/MTRs.js";
import { dataSet } from "./data/DataSet.js";

export const DataReader = (props) => {
  const { name } = props;

  let data;

  if (name) {
    data = dataSet.find((o) => o.user === name);
  } else {
    data = dataSet[0];
  }

  return (
    <>
      {data.transportData.map((category, i) => {
        return (
          <div className="section" key={i} id={i}>
            <div>{category.title}</div>
            {category.data.map((section, j) => {
              const firstUrl = section[0].url[0];
              if (firstUrl.includes("citybus") || firstUrl.includes("kmb")) {
                return <Buses key={j} section={section} />;
              } else {
                return <MTRs key={j} section={section} />;
              }
            })}
          </div>
        );
      })}
    </>
  );
};
