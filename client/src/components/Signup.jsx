import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import M from "materialize-css";

const Signup = () => {
  const history = useHistory();
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [res, setres] = useState(null);
  const [image, setimage] = useState("");
  const [url, seturl] = useState("undefined");
  // let changeHandler = (e) => {
  const [load, setload] = useState(true);
  //   console.log(e.target.id);
  //   setname(e.target.value);
  //   console.log(name)
  // };
  useEffect(() => {}, [load]);
  let upload = async (e) => {
    console.log(e.target.files[0]);
    setimage(e.target.files[0]);
    let data = new FormData();
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dt1u4najy");
    data.append("file", e.target.files[0]);
    // data.append("uploadImage", e.target.files[0]); multer

    fetch("https://api.cloudinary.com/v1_1/dt1u4najy/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.url) {
          seturl(res.url);
          setload(false);
        } else {
          console.log(res.error);
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          setres(error.response.data.message);
          // M.toast({ html: "error" });
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
  let onSubmit = (e) => {
    e.preventDefault();
    // console.log(name, password, email);
    let signup = {
      name,
      password,
      email,
      url,
    };
    console.log(signup);
    axios
      .post("/signup", signup)
      .then((res) => {
        console.log(res);
        M.toast({ html: res.data.message });
        setres(res.data.message);
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
          placeholder="name"
          value={name}
          id="name"
          onChange={(e) => setname(e.target.value)}
        />
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
        <div className="file-field input-field">
          <div className="btn">
            <span>File</span>
            <input
              type="file"
              onChange={(e) => {
                upload(e);
              }}
            />
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate"
              type="text"
              value={image.name}
              placeholder="upload photo"
            />
          </div>
        </div>
        <a
          className="waves-effect waves-light btn btn-primary"
          onClick={(e) => onSubmit(e)}
          // disabled={load}
        >
          button
        </a>
        {res ? <p>{res}</p> : null}
        <h5>
          <Link to="/signin">Already have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
