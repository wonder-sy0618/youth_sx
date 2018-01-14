import React, { Component } from 'react';
import './App.css';

import Button from 'antd/lib/button';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <Button>antd</Button>
        </p>
      </div>
    );
  }
}

export default App;
