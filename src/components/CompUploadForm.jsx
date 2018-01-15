import React, { Component } from 'react';

import zeptojs from "zeptojs"
import { regionData } from "element-china-area-data"

import Button from 'antd-mobile/lib/button';
import Card from 'antd-mobile/lib/card';
import WhiteSpace from 'antd-mobile/lib/white-space';
import List from "antd-mobile/lib/list"
import Picker from "antd-mobile/lib/picker"
import WingBlank from "antd-mobile/lib/wing-blank"
import ImagePicker from "antd-mobile/lib/image-picker"
import TextareaItem from "antd-mobile/lib/textarea-item"

import demo5 from "../res/demos/demo5.jpg"

const apiBase = "http://104.236.134.159:8000/api/"

export default class CompUploadForm extends Component {
  render() {
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
              cols={1}
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
              data={regionData.filter(item => item.label === '陕西省')} >
                <List.Item arrow="horizontal" >我在</List.Item>
              </Picker>
              <TextareaItem
                title="我的青春宣言是"
                placeholder=""
                maxlength={30}
                autoHeight
              />
              <List.Item
                extra={
                  <img
                    src={demo5}
                    style={{
                      width : '100%',
                      height: '100%'
                    }}
                    onClick={this.uploadToken.bind(this)}
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

  uploadToken() {
    zeptojs.ajax({
      url : apiBase + "upload_token",
      type : 'GET',
      dataType : 'json',
      success : function(json) {
        console.log(json)
      }
    })
  }

}
