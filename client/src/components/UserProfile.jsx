import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { state, dispatch } = useContext(UserContext);
  const [userprofile, setuserprofile] = useState(null);
  const { id } = useParams();
  const [follow, setfollow] = useState(false);
  console.log(id);
  const fethData = () => {
    Axios.get(`/user/${id}`, {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        console.log(res);
        setuserprofile(res.data);
        let found = res.data.user.followers.filter(
          (elem) => elem === state._id
        );
        console.log(found);
        found.length > 0 ? setfollow(true) : setfollow(false);
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
  useEffect(() => {
    fethData();
  }, [id]);
  let gallery = () => {
    return userprofile && userprofile.post.length > 0 ? (
      userprofile.post.map((item) => {
        return (
          <img
            className="item"
            key={item._id}
            src={`${item.photo}`}
            alt="profile_img"
          />
        );
      })
    ) : (
      <h3>no post have been posted by u</h3>
    );
  };
  const unFollowUser = async () => {
    await fetch(`/unFollow/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        dispatch({
          type: "UPDATE",
          payload: {
            following: result.mainUser.following,
            followers: result.mainUser.followers,
          },
        });
        console.log(JSON.stringify(result.mainUser));
        localStorage.setItem("user", JSON.stringify(result.mainUser));
      })
      .catch((err) => {
        console.log(err);
      });
    fethData();
  };
  const followUser = async () => {
    await fetch(`/follow/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        dispatch({
          type: "UPDATE",
          payload: {
            following: result.mainUser.following,
            followers: result.mainUser.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(result.mainUser));
        setfollow(true);
      })
      .catch((err) => {
        console.log(err);
      });
    fethData();
  };
  console.log(userprofile);
  return (
    <>
      {userprofile ? (
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
                  userprofile.user.url
                    ? `${userprofile.user.url}`
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS4hCfoSjWSVgLonuMDQt9DagIUMBMGi6UPyw&usqp=CAU"
                }
                alt="profile_img"
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
              />
            </div>
            <div>
              <h4>{userprofile.user.name}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>
                  {userprofile.post.length > 0 ? userprofile.post.length : 0}{" "}
                  Posts
                </h6>
                <h6>
                  {userprofile.user.followers.length > 0
                    ? userprofile.user.followers.length
                    : 0}{" "}
                  followers
                </h6>
                <h6>
                  {userprofile.user.following.length > 0
                    ? userprofile.user.following.length
                    : 0}{" "}
                  following
                </h6>
                {follow ? (
                  <button
                    className="waves-effect waves-light btn btn-primary"
                    onClick={() => unFollowUser()}
                  >
                    unFollow
                  </button>
                ) : (
                  <button
                    className="waves-effect waves-light btn btn-primary"
                    onClick={() => followUser()}
                  >
                    follow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="gallery">{gallery()}</div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  );
};

export default UserProfile;
