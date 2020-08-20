import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

const Navbar = () => {
  const [search, setsearch] = useState("");
  const [userDetails, setuserDetails] = useState([]);
  const searchModal = useRef(null);
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <button data-target="modal1" className="modal-trigger material-icons">
            search
          </button>
        </li>,
        <li key="2">
          <Link to="/profile">profile</Link>
        </li>,
        <li key="3">
          <Link to="/create">create post</Link>
        </li>,
        <li key="4">
          <Link to="/myFOllowersPost">My Following post</Link>
        </li>,
        <li key="5">
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
        <li key="1">
          <Link to="/signin">login</Link>
        </li>,
        <li key="2">
          <Link to="/signup">signup</Link>
        </li>,
      ];
    }
  };
  const fetchUser = (e) => {
    console.log(e.target.value);
    setsearch(e.target.value);
    fetch("/serchUser", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: e.target.value }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setuserDetails(result);
      });
  };
  const Collection = () => {
    return userDetails.map((item) => {
      return (
        <Link
          to={state._id === item._id ? "/profile" : `/profile/${item._id}`}
          onClick={() => {
            setsearch("");
            return M.Modal.getInstance(searchModal.current).close();
          }}
        >
          <li className="collection-item">{item.email}</li>
        </Link>
      );
    });
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
        <div
          id="modal1"
          className="modal modal-fixed-footer"
          style={{ color: "black" }}
          ref={searchModal}
        >
          <div className="modal-content">
            <input
              type="text"
              className="input-field"
              placeholder="search a user..."
              value={search}
              onChange={(e) => fetchUser(e)}
            />
            <ul className="collection">{Collection()}</ul>
          </div>
          <div className="modal-footer">
            <button
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => {
                setsearch("");
                setuserDetails([]);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
