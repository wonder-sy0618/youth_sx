import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import jquery from "jquery"

import logo from "../res/logo.png"

import Button from 'antd-mobile/lib/button';
import Card from 'antd-mobile/lib/card';
import WhiteSpace from 'antd-mobile/lib/white-space';
import Icon from "antd-mobile/lib/icon"

import CompHeader from "./CompHeader"

export default (props) => {
  return (
    <CompHeader>
      <Card.Body>
        <div style={{
          textAlign : 'left',
          fontSize: '13px',
          lineHeight: '20px'
        }} >
          　　陕西好青年是由共青团陕西省委联合省委宣传部、省网信办、省文明办等十一家单位共同评选，
          本着“不求高大全，只求真善美”的原则，寻找、发现、推荐、宣传一批模范践行社会主义核心价值观、带头传播正能量的身边好青年，
          以可亲可信可学的榜样力量，引领全省广大青年见贤思齐、崇德向善，争做向上向善好青年，争做文明守法好网民。
        </div>
      </Card.Body>
      <Card.Footer
        extra={
          <div>
            <Button
              type="primary"
              inline={true}
              size="small"
              onClick={() => {
                window.location.href = "#/upload"
              }}
              >我也要为陕西好青年代言</Button>
            <div style={{
              position: 'fixed',
              right: 0,
              top: 0
            }}
            onClick={(() => {
              // 展开地图层
              jquery(".pageIndexDialog").show().animate({
                overflow: 'auto',
                marginLeft : 0,
                width : window.innerWidth,
                height : window.innerHeight,
                top : 0
              }, 800, () => {
              })
            }).bind(this)} >
              <Icon type="down" style={{width: 30}} />
            </div>
          </div>
        } >

        </Card.Footer>
    </CompHeader>
  )
}
