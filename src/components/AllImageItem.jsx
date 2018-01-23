import React, { Component } from 'react';

import "./AllImageItem.css"
import iconLocal from "../res/ic_local.png"

export default (props) => {
  return (
    <div className={props.item.imghdw < 1 ? "imgItem item_horizontal_1" : "imgItem item_vertical_1" } >
      <img src={props.item.imgid} />
      <div className="itemTextBox" >
        <div className="itemTextContent" >
          我是陕西好青年，{props.item.itext}
        </div>
        <div className="itemTextName" >
          -- {props.item.iname}
        </div>
        <div className="itemTextLocal" >
          <img src={iconLocal} />
          我在{props.item.iwhere.replace("陕西省,", "").replace(",", "")}
        </div>
      </div>
    </div>
  );
}
