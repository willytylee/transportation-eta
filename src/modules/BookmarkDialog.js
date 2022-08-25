import { Dialog, styled, ListItemText } from "@mui/material/";
import { companyColor } from "../constants/Constants";

export const CategoryListItemText = (e) => (
  <ListItemText
    primary={e.title}
    secondary={
      e.data.length > 0 ? (
        e.data.map((f, j) => (
          <span key={j}>
            {f.length > 0 &&
              f
                .map((g, k) => (
                  <span key={k} className={g.co}>
                    {g.route}
                  </span>
                ))
                .reduce((a, b) => [a, " + ", b])}
            <br />
          </span>
        ))
      ) : (
        <>未有組合</>
      )
    }
  />
);

export const SectionListItemText = ({ i, e, gStopList }) => (
  <ListItemText
    primary={`組合${i + 1}`}
    secondary={
      <li>
        {e.map((f, j) => (
          <span key={j}>
            <span className={`route ${f.co}`}>{f.route}</span>
            <span className="stopName">{gStopList[f.stopId].name.zh}</span>
          </span>
        ))}
      </li>
    }
  />
);

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
