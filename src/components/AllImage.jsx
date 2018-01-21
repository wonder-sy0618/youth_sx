import React, { Component } from 'react';
import jquery from "jquery"
import config from "../config"

import Flex from "antd-mobile/lib/flex"
import WhiteSpace from "antd-mobile/lib/white-space"
import Infinite from 'react-infinite-loading'

import AllImageItem from "./AllImageItem"

export default class AllImage extends Component {

  constructor() {
    super();
    this.state = {
      oriList : [],
      list1 : [],
      list2 : [],
      hasnext : true,
      loading : false
    }
  }

  loadData() {
    let comp = this;
    comp.setState({
      loading : true
    })
    jquery.ajax({
      url : config.apiBase + "list?page=10&lastid=" + (comp.state.oriList.length > 0 ? comp.state.oriList[comp.state.oriList.length-1].id : '99999999'),
      dataType : 'json',
      success : function(json) {
        if (json.length <= 0) {
          comp.setState({
            hasnext : false,
            loading : false
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
            if (item.imgid == '' || item.imgid == 'undefined') {
              return;
            }
            if (allSize(newList1) < allSize(newList2)) {
              newList1.push(item)
            } else {
              newList2.push(item)
            }
          })
          comp.setState({
            oriList : json,
            list1 : newList1,
            list2 : newList2,
            loading : false,
            hasnext : json.length >= 10
          })
        }
      }
    })
  }

  componentDidMount() {
    this.loadData()
  }

  render() {
    let domList1 = [], domList2 = []
    let domItemRender = (item) => {
      return <AllImageItem key={"image_item_" + item.id} item={item} ></AllImageItem>;
    }
    this.state.list1.forEach(item => domList1.push(domItemRender(item)))
    this.state.list2.forEach(item => domList2.push(domItemRender(item)))
    return (
      <Infinite handleLoading={this.loadData.bind(this)} loading={this.state.loading || !this.state.hasnext} scrollThreshold={100} >
        <Flex className="AllImage" align="start" >
          <Flex.Item>
            {domList1}
          </Flex.Item>
          <Flex.Item>
            {domList2}
          </Flex.Item>
        </Flex>
      </Infinite>
    );
  }

}
