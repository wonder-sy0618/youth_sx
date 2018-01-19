import React, { Component } from 'react';

import "./AllImageItem.css"

export default (props) => {
  return (
    <div className={props.item.imghdw < 1 ? "imgItem item_horizontal_1" : "imgItem item_vertical_1" } >
      <img src={props.item.imgid} />
      <div className="name" >我是陕西好青年<span>{props.item.iname}</span></div>
      <div className="local" >我在{props.item.iwhere.replace("陕西省,", "").replace(",", "")}</div>
      <div className="declaration_title" >我的青春宣言是：</div>
      <div className="declaration_content" >{props.item.itext}</div>
    </div>
  );
}
