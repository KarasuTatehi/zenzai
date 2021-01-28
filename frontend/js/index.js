import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Guild from "./guild";
import User from "./user";

const App = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={Index} />
      <Route exact path="/dash/:guildRoom" component={Guild} />
      <Route exact path="/user/:userRoom" component={User} />
      <Redirect to="/" />
    </Switch>
  </HashRouter>
);

const Index = () => {
  useEffect(() => {
    location.href = "https://blog.k2sk.com/posts/oscillco-tutorial/";
  }, []);
  return <div>redicret...</div>;
};

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
