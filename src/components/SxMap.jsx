import React, { Component } from 'react';
import echarts from "echarts"
import echartsGl from "echarts-gl"
import geoJsonShanxi1 from "echarts/map/json/province/shanxi1.json"
import jquery from "jquery"
import config from "../config"
import logo from "../res/logo.png"
import moment from "moment"

const demoData = {
  areas : {
    '陕西省,西安市,雁塔区' : [
      [109.0841744134,34.4766581299],
      [109.0841744134,34.4766581299],
      [109.0841744134,34.4766581299],
    ],
    '陕西省,安康市,市辖区' : [
      [109.0841744134,32.4766581299],
      [109.0841744134,32.4766581299],
      [109.0841744134,32.4766581299],
    ]
  }
}

export default class SxMap extends Component {

  constructor() {
    super();
    this.state = {
      data : undefined,
      chart : undefined
    }
  }

  getAreaText(data, area) {
    if (!data) {
      return '';
    }
    if (!area) {
      area = "陕西省";
    }
    if (area.indexOf("陕西省") < 0) {
      area = "陕西省," + area;
    }
    let count = 0;
    for (let i=0; i<Object.keys(data.areas).length; i++) {
      let areaKey = Object.keys(data.areas)[i];
      if (areaKey.indexOf(area) >= 0) {
        count = count + data.areas[areaKey].length;
      }
    }
    area = area.indexOf(",") >= 0 ? area.substring(area.lastIndexOf(",")+1, area.length) : area;
    return "有"+count+"位"+area+"的好青年代言";
  }

  updateCahrt(data) {
    let comp = this;
    this.state.chart.setOption({
      backgroundColor: '#404a59',
      title : {
          text : this.getAreaText(this.state.data),
          left: 'center',
          top: 'top',
          textStyle: {
              color: '#fff'
          }
      },
      geo: {
          map: 'shanxi1',
          label: {
              emphasis: {
                  show: false
              }
          },
          roam: true,
          itemStyle: {
              normal: {
                  areaColor: '#323c48',
                  borderColor: '#404a59'
              },
              emphasis: {
                  areaColor: '#2a333d'
              }
          }
      },
      graphic: [{
        type : 'rect',
        shape : {
          width : 120,
          height : 30
        },
        style : {
          fill : "#cecece",
          lineWidth : 1,
          stroke : "#d9d9d9"
        },
        right : 10,
        bottom : 10,
        onclick: () => {
          // 折叠
          jquery(".pageIndexDialog").animate({
            overflow: 'auto',
            marginLeft : window.innerWidth - 20,
            width : 10,
            height : 10,
            top : 30
          }, 800, () => {
            jquery(".pageIndexDialog").hide();
            localStorage.showLastTime = moment().format('YYYYMMDD')
          })
        }
      }, {
          type: 'text',
          right: 50,
          bottom: 20,
          bounding: 'raw',
          origin: [75, 75],
          style: {
              text: '点击进入',
              fill: '#000',
              stroke: '#000',
              width : 120,
              height : 30,
              opacity: 0.4,
              font: 'bolder 1.2em "Microsoft YaHei", sans-serif'
          }
      }],
      series: [{
            type: 'scatterGL',
            coordinateSystem: 'geo',
            mapType: 'shanxi1',
            symbolSize: 2,
            blendMode: 'lighter',
            itemStyle: {
                normal: {
                  shadowBlur: 2,
                  shadowColor: 'rgba(14, 241, 242, 0.8)',
                  color: 'rgba(14, 241, 242, 0.8)'
                }
            },
            progressiveThreshold: 100,  // 启用渐进渲染的阈值，渐进渲染可以让你在加载画面的过程中不会有阻塞。
            progressive: 100,           // 渐进渲染每次渲染的数据量。
            data: (() => {
              console.log(data)
              if (!data) return [];
              let arr = [];
              for (let i=0; i<Object.keys(data.areas).length; i++) {
                let key = Object.keys(data.areas)[i];
                arr = arr.concat(data.areas[key])
              }
              return arr;
            })()
        }]
    });
  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    let comp = this;
    this.state.chart = echarts.init(document.getElementById('main'));
    echarts.registerMap('shanxi1', geoJsonShanxi1);
    {
      let lastEventTime = new Date();
      this.state.chart.on('click', function (params) {
        lastEventTime = new Date();
        var city = params.name;
        comp.state.chart.setOption({
          title: {
            text : comp.getAreaText(comp.state.data, city)
          },
          // 非第一次刷新，不再显示动画
          series : [{
            progressiveThreshold : 1000000,
            progressive : 1000000
          }]
        });
      });
      comp.updateCahrt(comp.state.data)
      jquery(document).on("click", "#main canvas", e => {
        if (new Date().getTime() - lastEventTime.getTime() < 500) {
          // 忽略点在地图内部的事件
          return false;
        }
        this.state.chart.setOption({
          title: {
            text : comp.getAreaText(comp.state.data)
          },
          // 非第一次刷新，不再显示动画
          series : [{
            progressiveThreshold : 1000000,
            progressive : 1000000
          }]
        });
      })
    }

    if (!this.state.data) {
      this.state.chart.showLoading();
      jquery.getJSON(config.apiBase+"mapdata", json => {
        this.setState({
          data: json
        })
        comp.updateCahrt(json)
        comp.state.chart.hideLoading();
        if (!localStorage.showLastTime || localStorage.showLastTime != moment().format('YYYYMMDD')) {
          comp.props.onReady();
        }
      })
    } else {
      comp.state.chart.hideLoading();
    }
  }

  render() {
    return (
      <div id="main" style={{
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 'rgba(64, 74, 89, 0.85)'
      }}>
      </div>
    )
  }
}
