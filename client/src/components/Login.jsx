import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import M from "materialize-css";
import { UserContext } from "../App";

const Login = () => {
  // const { state, dispatch } = useContext();
  const context = useContext(UserContext);
  console.log(context);
  const history = useHistory();
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [res, setres] = useState(null);
  let onSubmit = (e) => {
    e.preventDefault();
    let signin = {
      password,
      email,
    };
    console.log(signin);
    axios
      .post(
        "/signin",
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Accept: "application/json",
        //   },
        // },
        signin
      )
      .then((res) => {
        console.log(res);
        console.log(JSON.stringify(res.data.user));
        // M.toast({ html: res.data.message });
        // setres(res.data.message);
        localStorage.setItem("jwt", res.data.token);
        // localStorage.setItem("user", res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        context.dispatch({ type: "USER", payload: res.data.user });
        history.push("/");
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          setres(error.response.data.message);
          M.toast({ html: "error" });
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };
  return (
    <div className="my-card">
      <div className="card auth-card">
        <h2 className="brand-logo">Instagram</h2>
        <input
          type="text"
          className="input-field"
          placeholder="email"
          value={email}
          id="email"
          onChange={(e) => setemail(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          value={password}
          placeholder="password"
          id="password"
          onChange={(e) => setpassword(e.target.value)}
        />
        <a
          className="waves-effect waves-light btn btn-primary"
          onClick={(e) => onSubmit(e)}
        >
          button
        </a>
        {res ? <p>{res}</p> : null}
        <Link to="/signup">create new account?</Link>
      </div>
    </div>
  );
};

export default Login;
