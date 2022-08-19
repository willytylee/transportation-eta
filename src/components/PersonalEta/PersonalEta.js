import { styled } from "@mui/material";
import { dataSet } from "../../data/DataSet";
import { Section } from "./Section";

export const PersonalEta = ({ userId }) => {
  const data = dataSet.find((o) => o.userId === userId);

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
