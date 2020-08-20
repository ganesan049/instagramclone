import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import M from "materialize-css";

const ResetPassword = () => {
  // const { state, dispatch } = useContext();
  const { token } = useParams();
  const history = useHistory();
  const [password, setpassword] = useState("");
  const [res, setres] = useState(null);
  console.log(token);
  let onSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/reset/${token}`, { password: password })
      .then((res) => {
        console.log(res);
        history.push("/signin");
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
          type="enter the new password"
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
          Change Password
        </a>
        {res ? <p>{res}</p> : null}
        <Link to="/signup">create new account?</Link>
      </div>
    </div>
  );
};

export default ResetPassword;
