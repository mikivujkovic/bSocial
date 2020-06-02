import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../services/auth-header";

const user = JSON.parse(localStorage.getItem("user"));

const People = () => {
  const API_URL = "http://localhost:3000/feed/";
  const [content, setContent] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      console.log("user id: ", user.id);
      axios
        .post(
          API_URL + "noFollow",
          { headers: authHeader() },
          {
            data: {
              id: user.id,
            },
          }
        )
        .then((response) => {
          setContent(response.data);
          console.log("people i don't follow: ", content);
        })
        .catch((err) => console.log(err));
    }
  }, [refresh]);

  return (
    <div className="container">
      <header className="jumbotron">
        <h1>People</h1>
      </header>
      <div>
        {content.map((people) => (
          <PeopleCard key={people.id} user={people} refresh={setRefresh} />
        ))}
      </div>
    </div>
  );
};

export default People;

const PeopleCard = (props) => {
  const [peopleId, setPeopleId] = useState(props.user.id);

  const addFollow = () => {
    console.log(peopleId);
    axios
      .post(
        "http://localhost:3000/follows/addFollow",
        { headers: authHeader() },
        {
          data: {
            followerId: user.id,
            followingId: peopleId,
          },
        }
      )
      .then((response) => {
        props.refresh();
        console.log("follows : ", response.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="card" style={{ width: "60vw" }}>
        <div className="card-body">
          <h5 className="card-title">{props.user.username}</h5>
          <p className="card-text">
            {props.user.firstname} {props.user.lastname}
          </p>

          <hr />
          <div>
            <button onClick={addFollow} className="btn btn-primary">
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
