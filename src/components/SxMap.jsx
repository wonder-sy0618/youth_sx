import React, { Component } from 'react';
import echarts from "echarts"
import echartsGl from "echarts-gl"
import geoJsonShanxi1 from "echarts/map/json/province/shanxi1.json"
import zeptojs from "zeptojs"
import logo from "../res/logo.png"

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
      data : demoData
    }
  }

  getAreaText(area) {
    if (!this.state.data) {
      return '';
    }
    if (!area) {
      area = "陕西省";
    }
    if (area.indexOf("陕西省") < 0) {
      area = "陕西省," + area;
    }
    let count = 0;
    for (let i=0; i<Object.keys(this.state.data.areas).length; i++) {
      let areaKey = Object.keys(this.state.data.areas)[i];
      if (areaKey.indexOf(area) >= 0) {
        count = count + this.state.data.areas[areaKey].length;
      }
    }
    area = area.indexOf(",") >= 0 ? area.substring(area.lastIndexOf(",")+1, area.length) : area;
    return "有"+count+"位"+area+"的好青年代言";
  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    let comp = this;
    let myChart = echarts.init(document.getElementById('main'));
    echarts.registerMap('shanxi1', geoJsonShanxi1);
    {
      let lastEventTime = new Date();
      myChart.on('click', function (params) {
        lastEventTime = new Date();
        var city = params.name;
        myChart.setOption({
          title: {
            text : comp.getAreaText(city)
          },
          // 非第一次刷新，不再显示动画
          series : [{
            progressiveThreshold : 1000000,
            progressive : 1000000
          }]
        });
      });
      zeptojs(document).on("click", "#main canvas", e => {
        if (new Date().getTime() - lastEventTime.getTime() < 500) {
          // 忽略点在地图内部的事件
          return false;
        }
        myChart.setOption({
          title: {
            text : comp.getAreaText()
          },
          // 非第一次刷新，不再显示动画
          series : [{
            progressiveThreshold : 1000000,
            progressive : 1000000
          }]
        });
      })
    }
    myChart.setOption({
      backgroundColor: '#404a59',
      title : {
          text : comp.getAreaText(),
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
          type: 'text',
          right: 40,
          bottom: 20,
          z: -10,
          bounding: 'raw',
          origin: [75, 75],
          style: {
              text: '点击进入',
              width: 150,
              height: 150,
              opacity: 0.4,
              font: 'bolder 1.2em "Microsoft YaHei", sans-serif'
          },
          onclick: () => {
            console.log("111")
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
              let arr = [];
              for (let i=0; i<Object.keys(comp.state.data.areas).length; i++) {
                let key = Object.keys(comp.state.data.areas)[i];
                arr = arr.concat(comp.state.data.areas[key])
              }
              return arr;
            })()
        }]
    });
  }

  render() {
    return (
      <div id="main" style={{
        width: '100%',
        height: '600px'
      }}>
      </div>
    )
  }
}
