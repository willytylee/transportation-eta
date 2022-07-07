import { Link } from "react-router-dom";

export const Navbar = (props) => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/search">Search</Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="/eta/willy">Willy</Link>
        </li>
        <li>
          <Link to="/eta/shan">Shan</Link>
        </li>
      </ul>
    </nav>
  );
};
