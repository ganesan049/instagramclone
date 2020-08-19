import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { UserContext } from "../App";

const Profile = () => {
  const { state, dispatch } = useContext(UserContext);
  const [data, setdata] = useState([]);
  // const [url, seturl] = useState("");
  useEffect(() => {
    Axios.get("/myPosts", {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        console.log(res.data);
        setdata(res.data.myPosts);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
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
  }, []);
  let upload = async (e) => {
    console.log(e.target.files[0]);
    let data = new FormData();
    // console.log(image)
    data.append("uploadImage", e.target.files[0]);
    await Axios.post("/upload/img", data, {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        console.log(res.data.message);
        fetch("/updateImg", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            url: res.data.message,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            let temp = JSON.stringify(result);
            console.log(typeof temp, typeof result, result, result.result.url);
            dispatch({ type: "UPDATEIMG", payload: result.result.url });
            localStorage.setItem(
              "user",
              JSON.stringify({ ...state, url: result.result.url })
            );
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
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
  let gallery = () => {
    return data.length > 0 ? (
      data.map((item) => {
        return (
          <img
            className="item"
            key={item._id}
            src={`/${item.photo}`}
            alt="profile_img"
          />
        );
      })
    ) : (
      <h3>no post have been posted by u</h3>
    );
  };
  if (state && state.email) {
    console.log(state.followers);
  }
  return (
    <>
      {state && state.name ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                src={
                  state.url
                    ? `/${state.url}`
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS4hCfoSjWSVgLonuMDQt9DagIUMBMGi6UPyw&usqp=CAU"
                }
                alt="profile_img"
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
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
                    // value={image.name}
                    placeholder="upload photo"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4>{state ? state.name : "..."}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>
                  {data.length && data.length > 0 ? data.length : 0} posts
                </h6>
                <h6>
                  {state.followers.length && state.followers.length > 0
                    ? state.followers.length
                    : 0}{" "}
                  followers
                </h6>
                <h6>
                  {state.following.length && state.following.length > 0
                    ? state.following.length
                    : 0}{" "}
                  following
                </h6>
              </div>
            </div>
          </div>
          <div className="gallery">{gallery()}</div>
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default Profile;
