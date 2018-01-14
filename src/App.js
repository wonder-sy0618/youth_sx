import React, { Component } from 'react';
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'
import './App.css';

import PageIndex from "./components/PageIndex"
import PageUpload from "./components/PageUpload"

export default (props) => {
  return (
    <div className="App" >

      <HashRouter>
          <Switch >
              <Route exact path='/' render={(props) => (<PageIndex></PageIndex>)} />
              <Route exact path='/index' render={(props) => (<PageIndex></PageIndex>)} />
              <Route exact path='/upload' render={(props) => (<PageUpload></PageUpload>)} />
          </Switch>
      </HashRouter>
    </div>
  )
};
