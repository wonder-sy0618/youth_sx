import React, { Component } from 'react';

import SxMap from "../components/SxMap"
import ActInfo from "../components/ActInfo"
import AllImage from "../components/AllImage"

import PageIndexDialog from "./PageIndexDialog"

export default (props) => {
  return (
    <div className="PageIndex" >
      {/* <PageIndexDialog></PageIndexDialog> */}
      <ActInfo {...this.props} ></ActInfo>
      <AllImage {...this.props} ></AllImage>
    </div>
  )
}
