import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import socketIOClient from "socket.io-client";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import People from "./components/People";

const ENDPOINT = "http://localhost:3001";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);

      const socket = socketIOClient(ENDPOINT);

      socket.on("connect", (data) => {
        socket.emit("room", user.id);
      });

      socket.on(user.id, (data) => {
        setResponse(data);
      });

      socket.on("notification", (data) => {
        setResponse(data);
        window.scrollTo(0, 0);
      });
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            bSocial
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Posts
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/people"} className="nav-link">
                People
              </Link>
            </li>
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>
        <div
          className="alert alert-primary"
          role="alert"
          onClick={() => setResponse("")}
        >
          {response}

          {response && <p>click to dismiss</p>}
        </div>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/people" component={People} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
