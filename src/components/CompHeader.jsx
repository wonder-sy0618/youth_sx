import React, { Component } from 'react';

import logo from "../res/logo.png"

import Button from 'antd-mobile/lib/button';
import Card from 'antd-mobile/lib/card';
import WhiteSpace from 'antd-mobile/lib/white-space';


export default (props) => {
  return (
    <div className="ActInfo">
      <WhiteSpace size="lg" />
      <Card full>
        <Card.Header
          title="陕西好青年·青春正能量"
          thumb={logo}
          thumbStyle={{width : 64}}
          extra={<span></span>}
        ></Card.Header>
        {props.children}
      </Card>
    </div>
  );
}
