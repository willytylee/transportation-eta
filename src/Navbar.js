import { Link, useMatch, useResolvedPath } from "react-router-dom";

export const Navbar = (props) => {
  const { handleLink } = props;

  return (
    <nav className="nav">
      <ul>
        {/* <li onClick={(e) => handleLink(e)} id="willy">
          Willy
        </li>
        <li onClick={(e) => handleLink(e)} id="shan">
          Shan
        </li> */}
        <li>
          <Link to="/eta/willy">Willy</Link>
        </li>
        <li>
          <Link to="/eta/shan">Shan</Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="/search">Search</Link>
        </li>
      </ul>
    </nav>
  );
};
