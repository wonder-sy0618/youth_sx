import React, { Component } from 'react';
import echarts from "echarts"
import map from "../res/map.png"

import geoJson from "echarts/map/json/province/shanxi1.json"
import chinaCityGeoJson from "echarts/map/json/china-cities.json"
import chinaContourGeoJson from "echarts/map/json/china-contour.json"
import china from "echarts/map/json/china.json"


export default class SxMap extends Component {


  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    echarts.registerMap('陕西省', geoJson);
    console.log(geoJson)
    console.log(chinaCityGeoJson.features.filter(i => /^61\d+/.test(i.id)))
    console.log(chinaContourGeoJson)
    console.log(china)

    myChart.setOption({
        backgroundColor: '#404a59',
        itemStyle:{
            normal:{label:{show:true}},
            emphasis:{label:{show:true}}
        },
        series: [
            {
                type: 'map',
                mapType: '陕西省',
                label: {
                    emphasis: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                animation: true,
                data : [
                  {name : '西安市', value : 123000}
                ]
                // animationDurationUpdate: 1000,
                // animationEasingUpdate: 'quinticInOut'
            }
        ],
        visualMap: {
            min: 800,
            max: 50000,
            text:['High','Low'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['lightskyblue','yellow', 'orangered']
            }
        }
    });
  }

  render() {
    return (
      <div id="main" style={{
        width: '100%',
        height: '600px'
      }}></div>
    )
  }
}
