import React, { Component } from 'react';

import zeptojs from "zeptojs"
import moment from "moment"
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
const resBase = "http://testactive.oss-cn-beijing.aliyuncs.com/"
const imageMaxSize = 1000
const pictureQuality = 0.3

export default class CompUploadForm extends Component {

  constructor() {
    super()
    this.state = {
      uploading : false,
      imgid : undefined,
      iam : undefined,
      iwhere : undefined,
      itext : ''
    }
  }
  render() {
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
              value={this.state.iam ? [this.state.iam] : []}
              data={[{
                label: '普通青年',
                value: '普通青年',
              }, {
                label: '往届陕西好青年',
                value: '往届陕西好青年',
              }]}
              onChange={((sel) => {
                this.setState({
                  iam : sel[0]
                })
              }).bind(this)} >
                <List.Item arrow="horizontal" className="form_item_iam" >我是</List.Item>
            </Picker>
            <Picker
              title="我在"
              extra="请选择"
              data={regionData
                .filter(item => item.label === '陕西省')
                .map(i1 => {
                  i1.value = i1.label
                  if (i1.children) {
                    i1.children.forEach(i2 => {
                      i2.value = i2.label
                      if (i2.children) {
                        i2.children.forEach(i3 => {
                          i3.value = i3.label
                        })
                      }
                    })
                  }
                  return i1;
                })}
              value={this.state.iwhere ? this.state.iwhere.split(",") : []}
              onChange={((sel) => {
                this.setState({
                  iwhere : sel.join(",")
                })
              }).bind(this)} >
                <List.Item arrow="horizontal" className="form_item_iwhere" >我在</List.Item>
              </Picker>
              <TextareaItem
                title="我的青春宣言是"
                placeholder=""
                maxLength={30}
                autoHeight
                value={this.state.itext}
                onChange={(text => {
                  this.setState({
                    itext : text
                  })
                }).bind(this)}
              />
              <List.Item
                extra={
                  this.state.imgid ?
                  <img
                    src={this.state.imgid}
                    style={{
                      width : '100%',
                      height: '100%'
                    }}
                    onClick={this.uploadFile.bind(this)}
                    ></img>
                  :
                  <Button
                    size="small"
                    onClick={this.uploadFile.bind(this)}
                    >上传</Button>
                } >
                晒出你向上向善的样子
              </List.Item>
              <List.Item>
                <div style={{textAlign:'right'}}>
                  <Button size="small" inline onClick={() => {
                    window.location.href = "#/"
                  }} >返回</Button>
                  <Button type="primary" size="small" inline
                    style={{ marginLeft: '2.5px' }}
                    onClick={this.onSubmit.bind(this)}
                    >提交</Button>
                </div>
              </List.Item>
          </List>
        </Card.Body>
      </Card>
    )
  }

  onSubmit() {
    if (this.state.uploading) return;
    this.setState({
      uploading : true
    })
    let obj = this.state;
    obj.uid = this.props.uid;
    zeptojs.ajax({
      url : apiBase + "upload",
      data : obj,
      dataType : 'json',
      success : function(json) {
        window.location.href = "#/"
      }
    })
  }

  uploadFile() {
    if (this.state.uploading) return;
    this.setState({
      uploading : true
    })
    let dom = zeptojs("input[type=file][name=tmp_image_upload]");
    if (dom.length > 0) {
      dom.remove();
    }
    dom = zeptojs("<input type='file' name='tmp_image_upload' style='display:none;' accept='image/*' />").appendTo("body");
    dom.change(e => {
      let reader = new FileReader();
      reader.onload = () => {
        let base64 = reader.result;
        // 压缩图片
        let img = new Image();
        img.src = base64;
        img.onload = () => {
          var canvas = document.createElement('canvas');
          // 设置大小
          if (img.width > img.height) {
            if (img.width > imageMaxSize) {
              canvas.width = imageMaxSize
              canvas.height = img.height * imageMaxSize / img.width
            } else {
              canvas.width = img.width
              canvas.height = img.height
            }
          } else {
            if (img.height > imageMaxSize) {
              canvas.height = imageMaxSize
              canvas.width = img.width * imageMaxSize / img.height
            } else {
              canvas.width = img.width
              canvas.height = img.height
            }
          }
          //
          let context = canvas.getContext('2d');
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          // canvas转为blob并上传
          canvas.toBlob(blob => {
            // 开始上传
            this.uploadToken().then(token => {
              console.log(token)
              //
              let fileName = token.dir + moment().format("YYYYMMDDHHmmss") + Math.ceil(Math.random()*1000) + ".jpg";
              let url = resBase + fileName;
              // 图片ajax上传
              let xhr = new XMLHttpRequest();
              xhr.open("POST", token.host, true);
              let form = new FormData();
              form.append("OSSAccessKeyId", token.accessid)
              form.append("policy", token.policy)
              form.append("Signature", token.signature)
              form.append("key", fileName)
              form.append("file", blob)
              xhr.onreadystatechange = (e) => {
                if (xhr.readyState == 4) {
                  if (xhr.status == 204 || xhr.status == 200) {
                    this.setState({
                      imgid : url,
                      uploading : false
                    })
                  } else {
                    this.setState({
                      uploading : false
                    })
                    alert("图片上传失败 : " + xhr.status)
                  }
                }
              }
              xhr.send(form);
            })
          }, "image/jpeg", pictureQuality);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    })
    dom.click();
  }

  uploadToken() {
    return new Promise((resolve, reject) => {
      zeptojs.ajax({
        url : apiBase + "upload_token",
        type : 'GET',
        dataType : 'json',
        success : resolve,
        error : reject
      })
    })
  }

}
