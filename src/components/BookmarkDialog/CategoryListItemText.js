import { styled } from "@mui/material/";
import { ListItemText } from "@mui/material/";
import { companyColor } from "../../constants/Constants";

export const CategoryListItemText = ({ e }) => (
  <ListItemTextRoot
    primary={e.title}
    secondary={
      e.data.length > 0 ? (
        e.data.map((f, j) => (
          <span className="routes" key={j}>
            {f.length > 0 ? (
              f
                .map((g, k) => (
                  <span key={k} className={g.co}>
                    {g.route}
                  </span>
                ))
                .reduce((a, b) => [a, " + ", b])
            ) : (
              <>未有路線</>
            )}
            <br />
          </span>
        ))
      ) : (
        <>未有組合</>
      )
    }
  />
);

const ListItemTextRoot = styled(ListItemText)({
  ".MuiListItemText-secondary": {
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    listStyleType: "disc",
    ...companyColor,
    ".routes": {
      display: "list-item",
      "&::marker": {
        fontSize: "8px",
      },
    },
  },
});
