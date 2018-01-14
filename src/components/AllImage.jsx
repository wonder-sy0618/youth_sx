import React, { Component } from 'react';

import Flex from "antd-mobile/lib/flex"
import WhiteSpace from "antd-mobile/lib/white-space"

import demo1 from "../res/demos/demo1.jpg"
import demo2 from "../res/demos/demo2.jpg"
import demo3 from "../res/demos/demo3.jpg"
import demo4 from "../res/demos/demo4.jpg"
import demo5 from "../res/demos/demo5.jpg"

export default class AllImage extends Component {

  render() {
    return (
      <Flex className="AllImage" align="start" >
        <Flex.Item>
          <div className="imgItem" ><img src={demo1} /></div>
          <div className="imgItem" ><img src={demo2} /></div>
        </Flex.Item>
        <Flex.Item>
          <div className="imgItem" ><img src={demo4} /></div>
          <div className="imgItem" ><img src={demo5} /></div>
          <div className="imgItem" ><img src={demo3} /></div>
        </Flex.Item>
      </Flex>
    );
  }

}
