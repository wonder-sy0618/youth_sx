import React, { Component } from 'react';
import jquery from "jquery"
import config from "../config"
import imgtreat from "../common/imgtreat/"
import qrcode from "qrcode"

import Result from "antd-mobile/lib/result"
import Icon from "antd-mobile/lib/icon"

import Konva from "konva"
import iconLocal from "../res/ic_local.png"

const conf = {
  width : 1242,
  heightAdd : 400,
  bgColor : "white",
  bgImageBorder : 30,
  iTextMarginBottom : 50,
  qrcodeSize : 360
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
      itext = itext + itext
      let itextFontFamily = "LiSu";
      let itextFontSize = 60;
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
      // 转换二维码
      return qrcode.toDataURL(
        window.location.href.substring(0, window.location.href.indexOf("#") >= 0
                                            ? window.location.href.indexOf("#")
                                            : window.location.href.length),
          {
            margin : 2,
            width : 128,
            height : 128
          }
        )

    }).then(url => {
      // 加载二维码图片
      return this.loadImage(url)

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
      w = w - conf.qrcodeSize

    }).then(() => {
      // 加载位置图标
      return comp.loadImage(iconLocal);

    }).then(img => {
      // 输出位置图标
      layer.add(new Konva.Image({
        x: x,
        y: y + conf.qrcodeSize - 70,
        width : 50,
        height : 50,
        image: img
      }))
      // 输出位置
      layer.add(new Konva.Text({
        x: x + 50,
        y: y + conf.qrcodeSize - 50,
        text: "我是" + comp.state.item.iwhere.replace("陕西省,","").replace(",","") + "第" + comp.state.item.iwhereid + "位陕西好青年代言人",
        fontSize: 36,
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
          message="请长按下方的图片，保存到手机"
        />
        <div id="container" style={{"display" : "none"}} ></div>
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
