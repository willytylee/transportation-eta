import { Link } from "react-router-dom";
import { dataSet } from "./data/DataSet";

export const Navbar = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/search">Search</Link>
        </li>
      </ul>
      <ul>
        {dataSet
          .filter((e) => e.display)
          .map((e, i) => {
            return (
              <li key={i}>
                <Link to={`/eta/${e.user}`}>{e.name}</Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
};
