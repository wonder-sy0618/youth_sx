import React, { Component } from 'react';
import jquery from "jquery"
import config from "../config"
import imgtreat from "../common/imgtreat/"

import Result from "antd-mobile/lib/result"
import Icon from "antd-mobile/lib/icon"

import Konva from "konva"
import iconLocal from "../res/ic_local.png"
import qrcode from "../res/qrcode.png"

const scale = 0.5
const conf = {
  scale : 0.5,
  width : 1242 * scale,
  heightAdd : 400 * scale,
  bgColor : "white",
  bgImageBorder : 30 * scale,
  iTextMarginBottom : 50 * scale,
  qrcodeSize : 360 * scale
}

export default class ImgProview extends Component {

  constructor() {
      super();
      this.state = {
          item : undefined
      }
  }

  loadData() {
    let comp = this;
    return new Promise((resolve, reject) => {
      jquery.ajax({
        url : config.apiBase + "list?id=" + comp.props.match.params.id,
        dataType : 'json',
        success : function(json) {
          let item = json.length > 0 ? json[0] : undefined;
          comp.setState({
            item : item
          })
          resolve(item)
        }
      });
    })
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      let imageObj = new Image();
      imageObj.onload = function() {
        resolve(imageObj)
      }
      imageObj.onerror  = function(e) {
        alert("load image error > ", e)
      }
      imageObj.setAttribute("crossOrigin",'Anonymous');
      imageObj.src = src;
    });
  }

  buildText(text, maxWidth, fontSize, fontFamily) {
    let lines = [""]
    for (var i=0; i<text.length; i++) {
      let str = lines[lines.length-1] + text[i];
      if (new Konva.Text({
        x: 0,
        y: 0,
        text: str,
        fontSize: fontSize,
        fontFamily: fontFamily
      }).width() <= maxWidth) {
        lines[lines.length-1] = lines[lines.length-1] + text[i]

      } else {
        lines[lines.length-1] = lines[lines.length-1]
        lines.push("")
      }
    }
    return lines.join("\n");
  }

  drawElement(layer, x, y, w, h) {
    let comp = this;
    return new Promise(resolve => {
        resolve();
    }).then(() => {
      // 宣言文字
      let itext = "我是陕西好青年" + comp.state.item.iname + ", " + comp.state.item.itext;
      let itextFontFamily = "LiSu";
      let itextFontSize = 60 * scale;
      let kt = new Konva.Text({
        x: x,
        y: y,
        text: comp.buildText(itext, w - conf.qrcodeSize, itextFontSize, itextFontFamily),
        fontSize: itextFontSize,
        fontFamily: itextFontFamily,
        fill: 'black'
      });
      layer.add(kt);
      y = y;
      h = h - kt.height() + conf.iTextMarginBottom;

    }).then(() => {
      // 加载二维码图片
      return this.loadImage(qrcode)

    }).then(imageQrcode => {
      // 绘制图片
      let ki = new Konva.Image({
        x: x + w - conf.qrcodeSize,
        y: y,
        width : conf.qrcodeSize,
        height : conf.qrcodeSize,
        image: imageQrcode
      });
      layer.add(ki)
      w = w - conf.qrcodeSize * scale

    }).then(() => {
      // 加载位置图标
      return comp.loadImage(iconLocal);

    }).then(img => {
      // 输出位置图标
      layer.add(new Konva.Image({
        x: x,
        y: y + conf.qrcodeSize - 60 * scale,
        width : 50 * scale,
        height : 50 * scale,
        image: img
      }))
      // 输出位置
      layer.add(new Konva.Text({
        x: x + 55 * scale,
        y: y + conf.qrcodeSize - 40 * scale,
        text: "我是" + comp.state.item.iwhere.replace("陕西省,","").replace(",","") + "第" + comp.state.item.iwhereid + "位陕西好青年代言人",
        fontSize: 36 * scale,
        fontFamily: "微软雅黑",
        fill: 'black'
      }))

    })

  }

  draw() {
    let comp = this;
    return this.loadImage(this.state.item.imgid).then(imageBg => {
      var stage = new Konva.Stage({
        container: 'container',
        width: conf.width,
        height: ((conf.width - conf.bgImageBorder * 2) * comp.state.item.imghdw + conf.heightAdd + conf.bgImageBorder * 2)
      });
      var layer = new Konva.Layer();
      // 背景色
      layer.add(new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        fill: conf.bgColor
      }));
      // 主图
      layer.add(new Konva.Image({
        x: conf.bgImageBorder,
        y: conf.bgImageBorder,
        image: imageBg,
        width: (stage.width() - conf.bgImageBorder * 2),
        height: (stage.width() - conf.bgImageBorder * 2) * comp.state.item.imghdw
      }));
      // 绘制其它元素
      this.drawElement(
        layer,
        conf.bgImageBorder,       // 其它元素空间x
        conf.bgImageBorder * 2 + (stage.width() - conf.bgImageBorder * 2) * comp.state.item.imghdw,   // 其它元素空间y
        stage.width() - conf.bgImageBorder * 2,   // 元素空间宽度
        conf.heightAdd        // 元素空间高度
      ).then(() => {
        // 输出
        stage.add(layer);
        // 转换
        var imageDataUrl = jquery("#container canvas")[0].toDataURL();
        comp.setState({
          proview : imageDataUrl
        })
      })
    })
  }

  componentDidMount() {
    let comp = this;
    this.loadData().then(() => {
      comp.draw();
    })
  }

  render() {
    if (!this.state.item) {
      return <div></div>
    }
    return (
      <div className="ImgProview" >
        <Result
          img={<Icon type="check-circle" className="spe" style={{ fill: '#1F90E6' }} />}
          title="上传成功"
          message={
            <div>
              <div style={{
                padding: '12px 0px',
                fontSize: 13
              }}>
                听说，身边的好青年都关注了→
                  <a href="http://mp.weixin.qq.com/s/Ywxn_F3aDRy_igf3kW4upQ" style={{
                    color: 'red',
                    fontSize: 16,
                    margin: 6,
                    fontWeight: 'bold'
                  }}
                  >三秦青年</a>
              </div>
              <div>请长按下方的图片，保存到手机</div>
            </div>
          }
        />
        <div id="container" style={{"display":"none"}} ></div>
        <div style={{ padding: 10 }}>
          <img src={this.state.proview}
              style={{
                width: '100%',
                height: '100%'
              }}/>
        </div>
        <div style={{ padding: 10, textAlign: 'center' }}>
          <a href="#/" >返回首页</a>
          <br/><br/><br/>
        </div>
      </div>
    )
  }

}
