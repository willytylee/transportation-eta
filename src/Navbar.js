import { Link, useMatch, useResolvedPath } from "react-router-dom"

export const Navbar = () => {
  return <nav className="nav">
  	<ul>
  		<CustomLink to="/willy">Willy</CustomLink>
  		<CustomLink to="/shan">Shan</CustomLink>
  	</ul>
  </nav>
}

const CustomLink = ({ to, children, ...props }) => {
	const resolvedPath = useResolvedPath(to)
	const isActive = useMatch({path: resolvedPath.pathname, end: true})
	return (
		<li className={isActive ? "active" : ""}>
			<Link to={to}>{children}</Link>
		</li>
	)
}