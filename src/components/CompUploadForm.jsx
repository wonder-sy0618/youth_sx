import React, { Component } from 'react';

import Button from 'antd-mobile/lib/button';
import Card from 'antd-mobile/lib/card';
import WhiteSpace from 'antd-mobile/lib/white-space';
import List from "antd-mobile/lib/list"
import Picker from "antd-mobile/lib/picker"
import WingBlank from "antd-mobile/lib/wing-blank"
import ImagePicker from "antd-mobile/lib/image-picker"

import demo5 from "../res/demos/demo5.jpg"

export default (props) => {
  let uploadImage = (
    <img
      src={demo5}
      style={{
        width : '100%',
        height: '100%'
      }}
      ></img>
  )
  return (
    <Card style={{
      marginTop : "10px"
    }}>
      <Card.Header
        title="为陕西青年代言"
      />
      <Card.Body>
        <List style={{ backgroundColor: 'white' }} className="">
          <Picker
            title="我是"
            extra="请选择"
            data={[{
              label: '普通青年',
              value: 'thisYear',
            }, {
              label: '往届陕西好青年',
              value: 'beforeYear',
            }]} >
              <List.Item arrow="horizontal" >我是</List.Item>
          </Picker>
          <Picker
            title="我在"
            extra="请选择"
            data={[{
              label: '陕西省',
              value: '610000000000',
              children: [{
                label: '西安市',
                value: '610100000000',

                children : [{
                    label: '雁塔区',
                    value: '610113000000'
                }, {
                    label: '碑林区',
                    value: '610103000000'
                }]
              }, {
                label: '榆林市',
                value: '610800000000',
                children : [{
                    label: '市辖区',
                    value: '610801000000'
                }, {
                    label: '榆阳区',
                    value: '610802000000'
                }]
              }]
            }]} >
              <List.Item arrow="horizontal" >我在</List.Item>
            </Picker>
            <List.Item
              extra={
                <img
                  src={demo5}
                  style={{
                    width : '100%',
                    height: '100%'
                  }}
                  ></img>
              } >
              晒出你向上向善的样子
            </List.Item>
            <List.Item>
              <div style={{textAlign:'right'}}>
                <Button size="small" inline onClick={() => {
                  window.location.href = "#/"
                }} >返回</Button>
                <Button type="primary" size="small" inline disabled
                  style={{ marginLeft: '2.5px' }}
                  onClick={this.onSubmit}
                  >提交</Button>
              </div>
            </List.Item>
        </List>
      </Card.Body>
    </Card>
  )
}
