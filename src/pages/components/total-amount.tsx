import { Component } from "react";

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
import { COLOR_PLATE_8 } from '@/utils/color';


export interface AmountProp {
  data: any[]
  textMap: Record<string, string>

  commonProp: {
    chart: {
      forceFit: ChartProps['forceFit']
      height: ChartProps['height']
      padding: ChartProps['padding']
    }
  }
}

export interface AmountState {

}


const commonScale = {
  min: 0,
  max: 30000
}

export class TotalAmountChart extends Component<AmountProp> {

  readonly state = {
    scale: {
      totalAmount: {
        ...commonScale
      },
      fundAmount: {
        ...commonScale
      },
      leftAmount: {
        ...commonScale
      },
    }
  }

  getTooltipFormat(text: string) {
    return [text, (value: any) => ({
      name: this.props.textMap[text],
      value,
    })] as [string, any]
  }

  render() {
    const { data, textMap, commonProp } = this.props
    const commonChartProp = commonProp.chart
    const { scale } = this.state
    return <div >
      <h1 className="main-title" >
        资产增长趋势图
      </h1>
      {/* <h2 className="sub-title"  >
        设置左右刻度数tickCount相同
      </h2> */}
      <Chart  data={data} scale={scale} {...commonChartProp} >
        <Legend
          itemFormatter={val => {
            return textMap[val]
          }}
        />
        <Axis name="date" />
        <Axis name="totalAmount" />
        <Axis name="leftAmount" visible={false} />
        <Axis name="fundAmount" visible={false} />

        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom
          type="line"
          position="date*totalAmount"
          size={2}
          color={COLOR_PLATE_8[0]}
          tooltip={this.getTooltipFormat('totalAmount')}
        />
        <Geom
          type="line"
          position="date*leftAmount"
          size={2}
          color={COLOR_PLATE_8[1]}
          tooltip={this.getTooltipFormat('leftAmount')}
        />
        <Geom
          type="line"
          position="date*fundAmount"
          size={2}
          color={COLOR_PLATE_8[7]}
          tooltip={this.getTooltipFormat('fundAmount')}
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
