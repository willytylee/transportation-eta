import { useParams } from "react-router-dom";
import { styled } from "@mui/material";
import { Category } from "../components/Bookmark/Category";
import { dataSet } from "../data/DataSet";

export const Playground = () => {
  const { userId } = useParams();
  const data = dataSet.find((o) => o.userId === userId);

  return (
    <BookmarkRoot>
      {data.transportData.map((e, i) => (
        <Category key={i} category={e} />
      ))}
    </BookmarkRoot>
  );
};

const BookmarkRoot = styled("div")({
  overflow: "auto",
  ".emptyMsg": {
    fontSize: "14px",
    textAlign: "center",
    padding: "14px",
  },
});
