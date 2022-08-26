import { useContext } from "react";
import { ListItemText } from "@mui/material/";
import { DbContext } from "../../context/DbContext";

export const SectionListItemText = ({ i, e }) => {
  const { gStopList } = useContext(DbContext);

  return (
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
};
