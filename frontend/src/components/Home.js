import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../services/auth-header";

const user = JSON.parse(localStorage.getItem("user"));

const Home = () => {
  const API_URL = "http://localhost:3000/feed/";
  const [content, setContent] = useState([]);

  useEffect(() => {
    const header = "Bearer " + user.token;
    console.log("auth: ", header);
    if (user && user.id) {
      axios
        .post(
          API_URL + "feedForId",
          {
            headers: {
              Authorization: header,
            },
          },
          {
            data: {
              id: user.id,
            },
          }
        )
        .then((response) => {
          setContent(response.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h1>Posts</h1>
      </header>
      <div>
        {content.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;

const PostCard = (props) => {
  const [postId, setPostId] = useState(props.post.id);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3000/comment/addComment",
        { headers: authHeader() },
        {
          data: {
            userId: user.id,
            username: user.username,
            email: user.email,
            postId: postId,
            content: content,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.log(err));
    setContent("");
  };

  const onContentChange = (e) => {
    setContent(e.target.value);
  };

  const showComments = () => {
    console.log(postId);
    axios
      .post(
        "http://localhost:3000/comment/getCommentsForPostId",
        { headers: authHeader() },
        {
          data: {
            postId: postId,
          },
        }
      )
      .then((response) => {
        console.log("comments: ", response.data);
        setComments(response.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="card" style={{ width: "60vw" }}>
        <div className="card-body">
          <h5 className="card-title">{props.post.username}</h5>
          <p className="card-text">{props.post.message}</p>

          <div className="input-group">
            <textarea
              className="form-control"
              aria-label="Comment"
              value={content}
              onChange={onContentChange}
            ></textarea>
          </div>
          <button onClick={addComment} className="btn btn-primary">
            Add Comment
          </button>
          <hr />
          <div>
            <button onClick={showComments} className="btn btn-secondary">
              Show comments
            </button>
            <hr />
            {comments.map((comment) => (
              <p key={comment.id}>{comment.content}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
