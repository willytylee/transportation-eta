import { ListItemText } from "@mui/material/";

export const CategoryListItemText = ({ e }) => (
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
