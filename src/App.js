import React, { Component } from 'react';
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'
import './App.css';

import uuidV1 from "uuid/v1"

import PageIndex from "./components/PageIndex"
import PageUpload from "./components/PageUpload"

export default (props) => {
  let uid = window.localStorage ? window.localStorage['uid'] : undefined
  if (!uid) {
    uid = uuidV1();
    window.localStorage['uid'] = uid
  }
  //
  return (
    <div className="App" >
      <HashRouter>
          <Switch >
              <Route exact path='/' render={(props) => (<PageIndex></PageIndex>)} />
              <Route exact path='/index' render={(props) => (<PageIndex uid={uid} ></PageIndex>)} />
              <Route exact path='/upload' render={(props) => (<PageUpload uid={uid} ></PageUpload>)} />
          </Switch>
      </HashRouter>
    </div>
  )
};
