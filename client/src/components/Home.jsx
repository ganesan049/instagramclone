import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import Axios from "axios";

const Home = () => {
  // useContext()
  const { state, dispatch } = useContext(UserContext);
  const [comment, setcomment] = useState("");
  const [data, setdata] = useState([]);
  const fetchData = async () => {
    //console.log("object");
    Axios.get("/allPosts", {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        console.log(res.data.posts);
        if (JSON.stringify(res.data.posts) !== JSON.stringify(data)) {
          setdata(res.data.posts);
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          //console.log(error.response);
          //console.log(error.response.data);
          //console.log(error.response.status);
          //console.log(error.response.headers);
          // M.toast({ html: "error" });
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          //console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          //console.log("Error", error.message);
        }
        //console.log(error.config);
      });
  };
  useEffect(() => {
    fetchData();
  }, [data]);
  const likePost = (id) => {
    Axios.put(
      "/like",
      { postId: id },
      {
        headers: {
          Authorization: "Bearer" + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        //console.log(res.data);
        fetchData();
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          //console.log(error.response);
          //console.log(error.response.data);
          //console.log(error.response.status);
          //console.log(error.response.headers);
          // M.toast({ html: "error" });
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          //console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          //console.log("Error", error.message);
        }
        //console.log(error.config);
      });
  };
  const unlikePost = (id) => {
    //console.log(id);
    Axios.put(
      "/unlike",
      { postId: id },
      {
        headers: {
          Authorization: "Bearer" + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        console.log(res.data);
        fetchData();
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          //console.log(error.response);
          //console.log(error.response.data);
          //console.log(error.response.status);
          //console.log(error.response.headers);
          // M.toast({ html: "error" });
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          //console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          //console.log("Error", error.message);
        }
        //console.log(error.config);
      });
  };
  const makeComment = (postId, text) => {
    Axios.put(
      "/comment",
      { postId, text },
      {
        headers: {
          Authorization: "Bearer" + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        //console.log(res.data);
        fetchData();
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          //console.log(error.response);
          //console.log(error.response.data);
          //console.log(error.response.status);
          //console.log(error.response.headers);
          // M.toast({ html: "error" });
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          //console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          //console.log("Error", error.message);
        }
        //console.log(error.config);
      });
  };
  const deletePost = (postId) => {
    console.log(postId);
    Axios.delete(`/deletePost/${postId}`, {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        console.log(res.data, " deletePost");
        fetchData();
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
          //console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          //console.log("Error", error.message);
        }
        //console.log(error.config);
      });
  };
  return (
    <div className="home">
      {data.length > 0 ? (
        data.map((item) => {
          console.log(item.likes);
          let likeCount = false,
            unLikeCount = false,
            deleteCount = true;
          // if
          if (
            item.likes.includes(JSON.parse(localStorage.getItem("user"))._id)
          ) {
            likeCount = true;
          }
          if (
            item.unLikes.includes(JSON.parse(localStorage.getItem("user"))._id)
          ) {
            unLikeCount = true;
          }
          console.log(
            item.postedBy._id.toString() ===
              JSON.parse(localStorage.getItem("user"))._id
          );
          if (
            item.postedBy._id.toString() ===
            JSON.parse(localStorage.getItem("user"))._id
          ) {
            deleteCount = false;
          }
          console.log(state);
          return (
            <div className="card home-card" key={item._id}>
              <h5 style={{ padding: "5px" }}>
                <Link
                  to={
                    state && state._id === item.postedBy._id
                      ? "/profile"
                      : "/profile/" + item.postedBy._id
                  }
                >
                  {item.postedBy.name}
                </Link>
                <button
                  className="material-icons"
                  style={{ float: "right" }}
                  disabled={deleteCount}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </button>
              </h5>
              <div className="card-image">
                <img src={`${item.photo}`} alt="profile_img" />
              </div>
              <div className="card-content">
                <a href="">
                  <button
                    className="material-icons"
                    disabled={likeCount}
                    onClick={(e) => {
                      e.preventDefault();
                      likePost(item._id);
                    }}
                    style={likeCount ? { color: "red" } : { color: "black" }}
                  >
                    thumb_up
                  </button>
                  <button
                    className="material-icons"
                    onClick={(e) => {
                      e.preventDefault();
                      unlikePost(item._id);
                    }}
                    disabled={unLikeCount}
                    style={unLikeCount ? { color: "red" } : { color: "black" }}
                  >
                    thumb_down
                  </button>
                </a>
                <h6>{item.likes.length} likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.map((record) => {
                  return (
                    <h6>
                      <span key={record._id}>
                        {record.text} by {record.postedBy.name}
                      </span>
                    </h6>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log(comment);
                    // setcomment(e.target[0].value)
                    makeComment(e.target[0].value, item._id);
                    //console.log(e.target[0].value, item._id);
                  }}
                >
                  <input
                    type="text"
                    name=""
                    placeholder="add a comment"
                    value={comment}
                    onChange={(e) => setcomment(e.target.value)}
                  />
                </form>
              </div>
            </div>
          );
        })
      ) : (
        <h1>no posts to show</h1>
      )}
    </div>
  );
};

export default Home;
