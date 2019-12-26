import { Component } from "react";
import { AmountProp } from './total-amount';

import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
  ChartProps
} from "bizcharts";
import React from 'react';
import { COLOR_PLATE_16 } from '@/utils/color';

export class FundValChart extends Component<AmountProp> {
  getTooltipFormat(text: string) {
    return [text, (value: any) => ({
      name: this.props.textMap[text],
      value,
    })] as [string, any]
  }


  render() {
    const { data, textMap, commonProp } = this.props
    const commonChartProp = commonProp.chart

    return <div >
      <h1 className="main-title" >
        基金净值趋势图
      </h1>
      {/* <h2 className="sub-title"  >
        设置左右刻度数tickCount相同
      </h2> */}
      <Chart  data={data}  {...commonChartProp} >
        <Legend
          itemFormatter={val => {
            return textMap[val]
          }}
        />
        <Axis name="date" />
        <Axis name="fundVal" />

        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom
          type="line"
          position="date*fundVal"
          size={2}
          color={COLOR_PLATE_16[0]}
          tooltip={this.getTooltipFormat('fundVal')}
        />
         
        
        {/* <Geom
          type="point"
          position="date*totalAmount"
          size={2}
          shape={"circle"}
          style={{
            stroke: "#fff",
            lineWidth: 1
          }} 
        />*/}
      </Chart>
    </div>
  }
}