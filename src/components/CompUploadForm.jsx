import React, { Component } from 'react';

import zeptojs from "zeptojs"
import moment from "moment"
import { regionData } from "element-china-area-data"
import config from "../config"

import Button from 'antd-mobile/lib/button';
import Card from 'antd-mobile/lib/card';
import WhiteSpace from 'antd-mobile/lib/white-space';
import List from "antd-mobile/lib/list"
import Picker from "antd-mobile/lib/picker"
import WingBlank from "antd-mobile/lib/wing-blank"
import ImagePicker from "antd-mobile/lib/image-picker"
import TextareaItem from "antd-mobile/lib/textarea-item"
import InputItem from "antd-mobile/lib/input-item"

import demo5 from "../res/demos/demo5.jpg"

const BMap = window.BMap;
const BMAP_STATUS_SUCCESS = window.BMAP_STATUS_SUCCESS;


export default class CompUploadForm extends Component {

  constructor() {
    super()
    this.state = {
      uploading : false,
      imgid : undefined,
      iname : undefined,
      imghdw : 1,
      iam : undefined,
      iwhere : undefined,
      igps : undefined,
      itext : ''
    }
  }

  componentDidMount() {
    let comp = this;
    // 百度地图API功能
  	var map = new BMap.Map("allmap");
  	var point = new BMap.Point(108.953507,34.265846);
  	map.centerAndZoom(point,12);
    map.disableDragging();     //禁止拖拽

  	var geolocation = new BMap.Geolocation();
  	geolocation.getCurrentPosition(function(r){
  		if(this.getStatus() == BMAP_STATUS_SUCCESS){
  			var mk = new BMap.Marker(r.point);
  			map.addOverlay(mk);
        // 移动地图
  			map.panTo(r.point);

        // 获取地市
        var gc = new BMap.Geocoder();
        gc.getLocation(r.point, function(rs){
            var addComp = rs.addressComponents;
            var address =  addComp.province +  addComp.city + addComp.district + addComp.street + addComp.streetNumber;//获取地址
            //
            comp.setState({
              igps : r.point.lng+','+r.point.lat,
              iwhere : addComp.province + "," + addComp.city + "," + addComp.district
            })
        });
  		}
  		else {
  			alert('failed'+this.getStatus());
  		}
  	},{enableHighAccuracy: true})
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
            <InputItem
              type="text"
              onChange={(val => {
                this.setState({
                  iname : val
                })
              }).bind(this)}
              value={this.state.iname}
            >我的名字</InputItem>
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
              <List.Item className="form_item_igps" >
      	           <div id="allmap" style={{height: 200}}></div>
              </List.Item>
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
    //
    if (!this.state.imgid || this.state.imgid.length <= 0) {
      alert("请上传照片")
      return;
    }
    //
    // this.setState({
    //   uploading : true
    // })
    let obj = this.state;
    obj.uid = this.props.uid;
    zeptojs.ajax({
      url : config.apiBase + "upload",
      type : 'POST',
      data : obj,
      dataType : 'json',
      success : function(json) {
        window.location.href = "#/"
      }
    })
  }

  uploadFile() {
    if (this.state.uploading) return;
    // this.setState({
    //   uploading : true
    // })
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
        img.onload = () => {
          var canvas = document.createElement('canvas');
          // 设置大小
          if (img.width > img.height) {
            if (img.width > config.imageMaxSize) {
              canvas.width = config.imageMaxSize
              canvas.height = img.height * config.imageMaxSize / img.width
            } else {
              canvas.width = img.width
              canvas.height = img.height
            }
          } else {
            if (img.height > config.imageMaxSize) {
              canvas.height = config.imageMaxSize
              canvas.width = img.width * config.imageMaxSize / img.height
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
              //
              let fileName = token.dir + moment().format("YYYYMMDDHHmmss") + Math.ceil(Math.random()*1000) + ".jpg";
              let url = config.resBase + fileName;
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
                      imghdw : canvas.height / canvas.width,
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
            }).catch(err => alert("error : " + err))
          }, "image/jpeg", config.pictureQuality);
        }
        img.src = base64;
      };
      reader.readAsDataURL(e.target.files[0]);
    })
    dom.click();
  }

  uploadToken() {
    return new Promise((resolve, reject) => {
      zeptojs.ajax({
        url : config.apiBase + "upload_token",
        type : 'GET',
        dataType : 'jsonp',
        success : resolve,
        error : reject
      })
    })
  }

}
