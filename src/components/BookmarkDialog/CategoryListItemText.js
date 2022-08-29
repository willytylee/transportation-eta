import { styled } from "@mui/material/";
import { ListItemText } from "@mui/material/";
import { companyColor } from "../../constants/Constants";
import { mtrLineColor, stationMap } from "../../constants/Mtr";

export const CategoryListItemText = ({ e }) => (
  <ListItemTextRoot
    primary={e.title}
    secondary={
      e.data.length > 0 ? (
        e.data.map((routes, j) => (
          <span className="routes" key={j}>
            {routes.length > 0 ? (
              routes
                .map((route, k) =>
                  route.co === "mtr" ? (
                    <span key={k} className={route.route}>
                      {stationMap[route.stopId]}
                    </span>
                  ) : (
                    <span key={k} className={route.co}>
                      {route.route}
                    </span>
                  )
                )
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
    ...mtrLineColor,
    ".routes": {
      display: "list-item",
      "&::marker": {
        fontSize: "8px",
      },
    },
  },
});
