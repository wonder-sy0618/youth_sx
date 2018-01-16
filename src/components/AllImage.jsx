import React, { Component } from 'react';
import zeptojs from "zeptojs"
import config from "../config"

import Flex from "antd-mobile/lib/flex"
import WhiteSpace from "antd-mobile/lib/white-space"
import PullToRefresh from "antd-mobile/lib/pull-to-refresh"

import demo1 from "../res/demos/demo1.jpg"
import demo2 from "../res/demos/demo2.jpg"
import demo3 from "../res/demos/demo3.jpg"
import demo4 from "../res/demos/demo4.jpg"
import demo5 from "../res/demos/demo5.jpg"

export default class AllImage extends Component {

  constructor() {
    super();
    this.state = {
      list1 : [],
      list2 : [],
      hasnext : true
    }
  }

  componentDidMount() {
    let comp = this;
    zeptojs.ajax({
      url : config.apiBase + "list",
      dataType : 'json',
      success : function(json) {
        console.log(json)
        if (json.lensth <= 0) {
          this.setState({
            hasnext : false
          })
        } else {
          let allSize = (list) => {
            let size = 0;
            list.forEach(item => {
              size += window.innerWidth * item.imghdw
            })
            return size;
          }
          let newList1 = comp.state.list1;
          let newList2 = comp.state.list2;
          json.forEach(item => {
            if (allSize(newList1) < allSize(newList2)) {
              newList1.push(item)
            } else {
              newList2.push(item)
            }
          })
          comp.setState({
            list1 : newList1,
            list2 : newList2
          })
        }
      }
    })
  }

  render() {
    let domList1 = [], domList2 = []
    let domItemRender = (item) => {
      return <div className="imgItem" ><img src={item.imgid} /></div>;
    }
    this.state.list1.forEach(item => domList1.push(domItemRender(item)))
    this.state.list2.forEach(item => domList2.push(domItemRender(item)))
    return (
      <PullToRefresh>
        <Flex className="AllImage" align="start" >
          <Flex.Item>
            {domList1}
          </Flex.Item>
          <Flex.Item>
            {domList2}
          </Flex.Item>
        </Flex>
      </PullToRefresh>
    );
  }

}
