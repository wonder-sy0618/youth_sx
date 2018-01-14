import React, { Component } from 'react';

import List from "antd-mobile/lib/list"
import SwipeAction from "antd-mobile/lib/swipe-action"

import demo3 from "../res/demos/demo3.jpg"
import demo5 from "../res/demos/demo5.jpg"

export default (props) => {
  return (
    <div style={{
      marginTop : "10px"
    }}>
      <SwipeAction
        style={{ backgroundColor: 'gray' }}
        autoClose
        left={[
          {
            text: '删除',
            onPress: () => console.log('删除'),
            style: { backgroundColor: '#F4333C', color: 'white' },
          },
        ]}
        onOpen={() => console.log('global open')}
        onClose={() => console.log('global close')}
      >
        <List.Item
          multipleLine
          className="CompUploadHistory"
        >
          <div className="historyItemImage" >
            <img src={demo3} style={{
              width : '100%',
              height : '100%'
            }} ></img>
          </div>
          <div className="historyItemText" >
            这是我的青春宣言
            <div className="textTag" >
              <span>西安市 雁塔区</span>
              <span>第10001号宣言</span>
            </div>
          </div>
        </List.Item>
      </SwipeAction>
      <List.Item
        multipleLine
        className="CompUploadHistory"
      >
        <div className="historyItemImage" >
          <img src={demo5} style={{
            width : '100%',
            height : '100%'
          }} ></img>
        </div>
        <div className="historyItemText" >
          这是我的青春宣言
          <div className="textTag" >
            <span>西安市 雁塔区</span>
            <span>第10002号宣言</span>
          </div>
        </div>
      </List.Item>
    </div>
  )
}
