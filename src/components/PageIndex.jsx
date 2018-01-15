import React, { Component } from 'react';

import SxMap from "../components/SxMap"
import ActInfo from "../components/ActInfo"
import AllImage from "../components/AllImage"

export default (props) => {
  return (
    <div className="PageIndex" >
      <ActInfo {...this.props} ></ActInfo>
      <AllImage {...this.props} ></AllImage>
    </div>
  )
}
