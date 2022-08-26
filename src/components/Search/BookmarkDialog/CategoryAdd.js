import { useState } from "react";
import { compress as compressJson } from "lzutf8-light";
import {
  Grid,
  IconButton,
  DialogTitle,
  TextField,
  styled,
} from "@mui/material/";
import {
  Close as CloseIcon,
  KeyboardReturn as KeyboardReturnIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
} from "@mui/icons-material";
import { getLocalStorage } from "../../../Utils/Utils";

export const CategoryAdd = ({
  setCategoryIdx,
  setBookmarkDialogMode,
  handleDialogCloseBtnOnClick,
}) => {
  const [categoryValue, setCategoryValue] = useState("");

  const transportData = getLocalStorage("bookmark") || [];

  const handleCategoryAddBackBtnOnClick = () => {
    setBookmarkDialogMode("category");
  };

  const handleCategoryAddKeyPress = (e) => {
    e.key === "Enter" && handleCategoryConfirmBtnOnClick();
  };

  const handleCategoryConfirmBtnOnClick = () => {
    transportData.push({
      title: categoryValue,
      data: [],
    });
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(transportData), { outputEncoding: "Base64" })
    );
    setBookmarkDialogMode("category");
    setCategoryValue("");
  };

  return (
    <CategoryAddRoot>
      <DialogTitle>
        <Grid>
          <div className="leftBtnGroup">
            <IconButton onClick={handleCategoryAddBackBtnOnClick}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </div>
          <div className="title">請輸入類別名稱</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleDialogCloseBtnOnClick}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>

      <div className="input">
        <TextField
          variant="standard"
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
          onKeyPress={(e) => handleCategoryAddKeyPress(e)}
          autoComplete="off"
        />
        <IconButton onClick={handleCategoryConfirmBtnOnClick}>
          <KeyboardReturnIcon />
        </IconButton>
      </div>
    </CategoryAddRoot>
  );
};

const CategoryAddRoot = styled("div")({
  ".input": {
    display: "flex",
    padding: "36px 0px 18px 16px",
    ".MuiFormControl-root": {
      flexGrow: 1,
    },
  },
});
