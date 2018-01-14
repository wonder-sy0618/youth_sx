import React, { Component } from 'react';

import map from "../res/map.png"

export default (props) => {
  return (
    <div style={{
      textAlign: 'center',
      margin: 10,
    }} >
      <img src={map} />
    </div>
  )
}
