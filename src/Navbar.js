export const Navbar = (props) => {
  const { handleLink } = props;

  return (
    <nav className="nav">
      <ul>
        <li onClick={(e) => handleLink(e)} id="willy">
          Willy
        </li>
        <li onClick={(e) => handleLink(e)} id="shan">
          Shan
        </li>
      </ul>
    </nav>
  );
};
