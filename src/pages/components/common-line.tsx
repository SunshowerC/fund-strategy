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
import { InvestDateSnapshot } from '@/utils/fund-stragegy';

export interface CommonFundLineProp extends AmountProp {
  title?: string
  subTitle?: string
  /* 
   * y 轴数据属性
   */
  y: string 
}

export class CommonFundLine extends Component<CommonFundLineProp> {
  
  private getTooltipFormat(text: string) {
    return [text, (value: any) => ({
      name: this.props.textMap[text],
      value,
    })] as [string, any]
  }


  render() {
    const { title,subTitle, y, data, textMap, commonProp } = this.props
    const commonChartProp = commonProp.chart

      return <div >
      <h1 className="main-title" >
        {title || textMap[y]}
      </h1>
      { subTitle ? <h2 className="sub-title"  >
        {subTitle}
      </h2>: ''}

      <Chart  data={data}  {...commonChartProp} >
        <Legend
          itemFormatter={val => {
            return textMap[val]
          }}
        />
        <Axis name="date" /> 

        <Tooltip
          crosshairs={{
            type: "y"
          }}
        /> 
        <Geom
          type="line"
          position={'date*' + y}
          size={2}
          color={COLOR_PLATE_16[0]}
          tooltip={this.getTooltipFormat(y)}
        />
         
      </Chart>
    </div>
  }
}