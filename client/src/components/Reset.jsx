import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import M from "materialize-css";

const Reset = () => {
  const history = useHistory();
  const [email, setemail] = useState("");
  const [res, setres] = useState(null);
  let onSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    axios
      .post(
        "/resetPassword",
        { email: email },
        {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("jwt"),
          },
        }
      )
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
          type="text"
          className="input-field"
          placeholder="email"
          value={email}
          id="email"
          onChange={(e) => setemail(e.target.value)}
        />
        <a
          className="waves-effect waves-light btn btn-primary"
          onClick={(e) => onSubmit(e)}
        >
          Reset Password
        </a>
        {res ? <p>{res}</p> : null}
      </div>
    </div>
  );
};

export default Reset;
