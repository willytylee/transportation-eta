import { Dialog, styled } from "@mui/material/";
import { companyColor } from "../constants/Constants";

export const DialogRoot = styled(Dialog)({
  ".MuiList-root": {
    overflow: "auto",
    paddingTop: "8px",
  },
});

export const CategoryRoot = styled("div")({
  ".emptyMsg": {
    fontSize: "15px",
    textAlign: "center",
    padding: "20px 0",
  },
  ".MuiListItemText-root": {
    display: "flex",
    alignItems: "center",
    ".MuiListItemText-primary": {
      width: "70px",
    },
    ".MuiListItemText-secondary": {
      paddingLeft: "8px",
      fontSize: "12px",
      ...companyColor,
    },
  },
});

export const CategoryAddRoot = styled("div")({
  ".input": {
    display: "flex",
    padding: "36px 0px 18px 16px",
    ".MuiFormControl-root": {
      flexGrow: 1,
    },
  },
});

export const SectionRoot = styled("div")({
  ".MuiListItemText-root": {
    display: "flex",
    alignItems: "center",
    ".MuiListItemText-primary": {
      width: "70px",
    },
    ".MuiListItemText-secondary": {
      fontSize: "12px",
      li: {
        display: "flex",
        flexDirection: "column",
        ".route": {
          display: "inline-block",
          width: "50px",
        },
        ...companyColor,
      },
    },
  },
  ".emptyMsg": {
    fontSize: "15px",
    textAlign: "center",
    padding: "20px 0",
  },
});
