import React, { Component } from 'react';
import zeptojs from "zeptojs"
import config from "../config"
import imgtreat from "../common/imgtreat/"
import qrcode from "qrcode"

import Result from "antd-mobile/lib/result"
import Icon from "antd-mobile/lib/icon"

export default class ImgProview extends Component {

  constructor() {
      super();
      this.state = {
          item : undefined
      }
  }

  qrcode(canvas, item) {
    imgtreat.textDraw(canvas, "邀请您关注",
      102, canvas.height - 98, {
        fillStyle : "white",
        font : '50px FZShuTi,STXihei,Arial',
        lineSpacing : 1.2,
        middlePos : false
      })
    imgtreat.textDraw(canvas, "邀请您关注",
      100, canvas.height - 100, {
        fillStyle : "black",
        font : '50px FZShuTi,STXihei,Arial',
        lineSpacing : 1.2,
        middlePos : false
      })
    {
      let ctx = canvas.getContext("2d");
      ctx.lineJoin = "round";
      ctx.lineWidth = 4;
      ctx.strokeStyle="white";
      ctx.strokeRect(375, canvas.height - 90, 260, 64);
    }
    imgtreat.textDraw(canvas, "陕西好青年",
      380, canvas.height - 100, {
        fillStyle : "rgba(195, 177, 0, 0.89)",
        font : '50px FZShuTi,STXihei,Arial',
        lineSpacing : 1.2,
        middlePos : false
      })
    imgtreat.textDraw(canvas, "➤",
      660, canvas.height - 100, {
        fillStyle : "white",
        font : '50px FZShuTi,STXihei,Arial',
        lineSpacing : 1.2,
        middlePos : false
      })
    let url = window.location.href.substring(0, window.location.href.indexOf("#") >= 0
                                        ? window.location.href.indexOf("#")
                                        : window.location.href.length)
    return qrcode.toDataURL(
        url,
        {
          margin : 2,
          width : 128,
          height : 128
        }
      ).then(url => imgtreat.imageOpen(
        url
      )).then(img => {
        canvas.getContext('2d').drawImage(img, 730, canvas.height - img.height - 10, img.width, img.height)
      })
  }

  // 横图
  imageHorizontal(canvas, item) {
    imgtreat.textDraw(canvas, "我是" + item.iwhere.replace("陕西省,","").replace(",","") + "第" + item.iwhereid + "位陕西好青年代言人",
        canvas.width - 40, 10, {
          fillStyle : "white",
          font : '20px Arial',
          lineSpacing : 1.2,
          middlePos : false,
          isVertical : true
        })
    //
    imgtreat.textDraw(canvas, "我是陕西好青年",
        80, 100, {
          fillStyle : "black",
          font : '40px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    imgtreat.textDraw(canvas, "我是陕西好青年",
        75, 95, {
          fillStyle : "white",
          font : '40px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    //
    imgtreat.textDraw(canvas, item.iname,
        380, 70, {
          fillStyle : "blue",
          font : '60px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    //
    imgtreat.textDraw(canvas, "我在" + item.iwhere.replace("陕西省,","").replace(",",""),
        285, 175, {
          fillStyle : "black",
          font : '40px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    imgtreat.textDraw(canvas, "我在" + item.iwhere.replace("陕西省,","").replace(",",""),
        280, 170, {
          fillStyle : "white",
          font : '40px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    //
    imgtreat.textDraw(canvas, "我的青春宣言是",
        71, 291, {
          fillStyle : "white",
          font : '46px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    imgtreat.textDraw(canvas, "我的青春宣言是",
        70, 290, {
          fillStyle : "red",
          font : '46px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    //
    imgtreat.textDraw(canvas, item.itext.replace("，", "，\n").replace(",", "，\n"),
        171, 371, {
          fillStyle : "white",
          font : '46px STKaiti,SimHei,"STXinwei","微软雅黑",sans-serif',
          lineSpacing : 1.2,
          middlePos : false
        })
    imgtreat.textDraw(canvas, item.itext.replace("，", "，\n").replace(",", "，\n"),
        170, 370, {
          fillStyle : "red",
          font : '46px STKaiti,SimHei,"STXinwei","微软雅黑",sans-serif',
          lineSpacing : 1.2,
          middlePos : false
        })
    return this.qrcode(canvas, item);
  }

  // 纵图
  imageVertical(canvas, item) {
    imgtreat.textDraw(canvas, "我是" + item.iwhere.replace("陕西省,","").replace(",","") + "第" + item.iwhereid + "位陕西好青年代言人",
        canvas.width - 60, 10, {
          fillStyle : "white",
          font : '40px Arial',
          lineSpacing : 1.2,
          isVertical : true
        })
    //
    imgtreat.textDraw(canvas, "我是陕西好青年",
        80, 130, {
          fillStyle : "black",
          font : '40px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    imgtreat.textDraw(canvas, "我是陕西好青年",
        75, 125, {
          fillStyle : "white",
          font : '40px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    //
    imgtreat.textDraw(canvas, item.iname,
        380, 100, {
          fillStyle : "blue",
          font : '60px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    //
    imgtreat.textDraw(canvas, "我在" + item.iwhere.replace("陕西省,","").replace(",",""),
        285, 205, {
          fillStyle : "black",
          font : '40px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    imgtreat.textDraw(canvas, "我在" + item.iwhere.replace("陕西省,","").replace(",",""),
        280, 200, {
          fillStyle : "white",
          font : '40px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    //
    imgtreat.textDraw(canvas, "我的青春宣言是",
        71, 621, {
          fillStyle : "white",
          font : '46px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    imgtreat.textDraw(canvas, "我的青春宣言是",
        70, 620, {
          fillStyle : "red",
          font : '46px Arial',
          lineSpacing : 1.2,
          middlePos : false
        })
    //
    imgtreat.textDraw(canvas, item.itext.replace("，", "，\n").replace(",", "，\n"),
        171, 701, {
          fillStyle : "white",
          font : '46px STKaiti,SimHei,"STXinwei","微软雅黑",sans-serif',
          lineSpacing : 1.2,
          middlePos : false
        })
    imgtreat.textDraw(canvas, item.itext.replace("，", "，\n").replace(",", "，\n"),
        170, 700, {
          fillStyle : "red",
          font : '46px STKaiti,SimHei,"STXinwei","微软雅黑",sans-serif',
          lineSpacing : 1.2,
          middlePos : false
        })
    return this.qrcode(canvas, item);
  }

  componentDidMount() {
    let comp = this;
    zeptojs.ajax({
      url : config.apiBase + "list?id=" + comp.props.match.params.id,
      dataType : 'json',
      success : function(json) {
        let item = json.length > 0 ? json[0] : undefined;
        comp.setState({
          item : item
        })
        imgtreat.imageOpen(
          item.imgid
        ).then(img => {
          // 计算宽高
          // let width = window.innerWidth * 2;
          let width = 1000;
          let height = img.height * width / img.width
          //
          imgtreat.create(
            width, height
          ).then(canvas => {
            // 底图
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
            //
            if (item.imghdw > 1) {
              // 纵图
              comp.imageVertical
                .apply(comp, [canvas, item])
                .then(() => {
                  // 输出图片
                  comp.setState({
                    proview : canvas.toDataURL("image/png")
                  })
                })
            } else {
              // 横图
              comp.imageHorizontal
                .apply(comp, [canvas, item])
                .then(() => {
                  // 输出图片
                  comp.setState({
                    proview : canvas.toDataURL("image/png")
                  })
                })
            }
            // 输出图片
            comp.setState({
              proview : canvas.toDataURL("image/png")
            })
          })
        })
      }
    });
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
