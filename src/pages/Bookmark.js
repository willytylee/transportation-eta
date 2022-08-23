import { useEffect } from "react";
import {
  compress as compressJson,
  decompress as decompressJson,
} from "lzutf8-light";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material";
import { Section } from "../components/Bookmark/Category";
import { dataSet } from "../data/DataSet";

export const Bookmark = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const userId = JSON.parse(localStorage.getItem("user"))?.userId || null;
  const data = dataSet.find((o) => o.userId === userId);

  let newTransportData;

  if (localStorage.getItem("bookmark")) {
    newTransportData = JSON.parse(
      decompressJson(localStorage.getItem("bookmark"), {
        inputEncoding: "Base64",
      })
    );
  } else {
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(data.transportData), {
        outputEncoding: "Base64",
      })
    );
    newTransportData = data.transportData;
  }

  useEffect(() => {
    if (!userId) {
      enqueueSnackbar("請選擇用戶", {
        variant: "warning",
      });
      navigate("/settings", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <BookmarkRoot>
      {newTransportData.map((e, i) => (
        <Section key={i} category={e} />
      ))}
    </BookmarkRoot>
  );
};

const BookmarkRoot = styled("div")({
  overflow: "auto",
});
