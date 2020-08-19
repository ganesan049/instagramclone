import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  console.log(state);
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/profile">profile</Link>
        </li>,
        <li>
          <Link to="/create">create post</Link>
        </li>,
        <li>
          <Link to="/myFOllowersPost">My Following post</Link>
        </li>,
        <li>
          <a
            className="waves-effect waves-light btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            logout
          </a>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">login</Link>
        </li>,
        <li>
          <Link to="/signup">signup</Link>
        </li>,
      ];
    }
  };
  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper white justify-content-center">
          <Link to={state ? "/" : "/signin"} className="brand-logo left">
            Instagram
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
