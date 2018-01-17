import React, { Component } from 'react';
import zeptojs from "zeptojs"
import config from "../config"

import List from "antd-mobile/lib/list"
import SwipeAction from "antd-mobile/lib/swipe-action"

import demo3 from "../res/demos/demo3.jpg"
import demo5 from "../res/demos/demo5.jpg"

export default class CompUploadHistory extends Component {

  constructor() {
    super();
    this.state = {
      history : []
    }
  }

  componentDidMount() {
    let comp = this;
    zeptojs.ajax({
      url : config.apiBase + "list?uid=" + this.props.uid,
      dataType : 'json',
      success : function(json) {
        comp.setState({
          history : json
        })
      }
    });
  }

  render() {
    let comp = this;
    let array = [];
    this.state.history.forEach(item => {
      array.push(
        <SwipeAction
          key={"history_" + item.id}
          style={{ backgroundColor: 'gray' }}
          autoClose
          left={[
            {
              text: '删除',
              onPress: () => {
                let history = this.state.history;
                history.splice(history.indexOf(item),1)
                comp.setState({
                  history : history
                })
                zeptojs.ajax({
                  url : config.apiBase + "delete?uid=" + comp.props.uid + "&id=" + item.id,
                  dataType : 'json',
                  success : function(json) {
                    console.log(json)
                  }
                });
              },
              style: { backgroundColor: '#F4333C', color: 'white' },
            },
          ]}
        >
          <List.Item
            multipleLine
            className="CompUploadHistory"
          >
            <div className="historyItemImage" >
              <img src={item.imgid} style={{
                width : '100%',
                height : '100%'
              }} ></img>
            </div>
            <div className="historyItemText" >
              {item.itext}
              <div className="textTag" >
                <span>{item.iwhere}</span>
                <span>第{item.id}号宣言</span>
              </div>
            </div>
          </List.Item>
        </SwipeAction>
      )
    })
    return (
      <div style={{
        marginTop : "10px"
      }}>
          {array}
      </div>
    )
  }
}
