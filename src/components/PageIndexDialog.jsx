import React, { Component } from 'react';
import SxMap from "./SxMap"
import jquery from "jquery"

export default (props) => {
  return (
    <div className="pageIndexDialog"
    style={{
      position: 'fixed',
      top: 30,
      height: 10,
      zIndex: 100,
      width: 10,
      marginLeft: window.innerWidth - 10,
      display: 'none'
    }} >
      <SxMap {...props}
          onReady={(() => {
            // 展开地图层
            jquery(".pageIndexDialog").show().animate({
              overflow: 'auto',
              marginLeft : 0,
              top : 0,
              width : window.innerWidth,
              height : window.innerHeight
            }, 800, () => {
            })
            jquery("#main").css({backgroundColor: 'rgba(64, 74, 89, 0.9)'})
          }).bind(this)}
        ></SxMap>
    </div>
  )
}
