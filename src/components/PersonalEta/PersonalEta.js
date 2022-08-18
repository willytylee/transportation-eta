import { useState, useEffect } from "react";
import { styled } from "@mui/material";
import { dataSet } from "../../data/DataSet";
import { Section } from "./Section";

export const PersonalEta = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(dataSet.find((o) => o.userId === userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <PersonalEtaRoot>
      {data?.transportData?.map((e, i) => (
        <Section key={i} category={e} />
      ))}
    </PersonalEtaRoot>
  );
};

const PersonalEtaRoot = styled("div")({
  overflow: "auto",
});
