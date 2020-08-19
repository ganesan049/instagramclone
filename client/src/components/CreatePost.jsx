import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Axios from "axios";

const CreatePost = () => {
  const history = useHistory();
  const [title, settitle] = useState("");
  const [load, setload] = useState(true);
  const [body, setbody] = useState("");
  const [image, setimage] = useState("");
  const [url, seturl] = useState("");
  const [res, setres] = useState("");
  // const [formdata, setformdata] = useState("");
  useEffect(() => {
    console.log(title, load, body, image, url);
  }, [load]);
  let upload = async (e) => {
    console.log(e.target.files[0]);
    setimage(e.target.files[0]);
    let data = new FormData();
    // console.log(image)
    data.append("uploadImage", e.target.files[0]);
    // setformdata(data);

    await Axios.post("/upload/img", data, {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        console.log(res.data);
        seturl(res.data.message);
        setload(false);
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

  let handleSubmit = (e) => {
    e.preventDefault();
    // console.log('object')
    // console.log(formdata);

    console.log(body, title, url);
    if (body !== "" && title !== "" && url !== "") {
      fetch("/createPost", {
        method: "post",
        headers: {
          Authorization: "Bearer" + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body, title, url }),
      })
        .then((res) => {
          console.log(res);
          history.push("/profile");
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
    // Axios.post()
  };

  return (
    <div className="card input-field auth-card">
      <input
        type="text"
        value={title}
        placeholder="title"
        onChange={(e) => settitle(e.target.value)}
      />
      <input
        type="text"
        value={body}
        placeholder="body"
        onChange={(e) => setbody(e.target.value)}
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
            // onChange={upload}
          />
        </div>
      </div>

      <button
        className="waves-effect waves-light btn btn-primary"
        onClick={(e) => handleSubmit(e)}
        disabled={load}
      >
        submit
      </button>
    </div>
  );
};

export default CreatePost;
