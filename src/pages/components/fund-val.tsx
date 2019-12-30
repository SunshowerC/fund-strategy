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
import { COLOR_PLATE_16, COLOR_PLATE_8 } from '@/utils/color';
import { roundToFix } from '@/utils/common';

export class FundValChart extends Component<AmountProp> {
  getTooltipFormat(text: string) {
    if(text === 'profitRate*profit') {
      return [text, (profitRate: any, profit: number) => ({
        name: '持有收益',
        value: roundToFix(profitRate * 100, 2)  + '%' + `(${profit}元)`
      })] as [string, any]
    }
    return [text, (fundGrowthRate, dateBuyAmount, dateSellAmount) => {
      const buyTip =dateBuyAmount ? `(${this.props.textMap['dateBuyAmount']} ${dateBuyAmount})` : ''
      const sellTip =dateSellAmount ? `(${this.props.textMap['dateSellAmount']} ${dateSellAmount})` : ''
      return {
        name: this.props.textMap['fundGrowthRate'] ,
        value: roundToFix(fundGrowthRate * 100, 2)  + '%' + buyTip + sellTip,
      }
    }] as [string, any]
  }

  xy = {
    x: 'date',
    y: 'fundGrowthRate'
  }

  render() {
    const { data, textMap, commonProp } = this.props
    const commonChartProp = commonProp.chart
    const { x, y } = this.xy
    const scale = {
      profitRate: {
        min: 0,
        max: 1
      },
      fundGrowthRate: {
        min: 0,
        max: 1
      }
    }
    return <div >
      <h1 className="main-title" >
        基金业绩走势
      </h1>
      {/* TODO: 买入卖出点点 */}
      
      <Chart data={data} scale={scale}  {...commonChartProp} >
        <Legend
          itemFormatter={val => {
            return textMap[val]
          }}
        />
        <Axis name={x} />
        <Axis name="fundGrowthRate" />
        <Axis name="profitRate" visible={false} />

        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom
          type="line"
          position={`${x}*${y}`}
          size={2}
          color={COLOR_PLATE_16[0]}
          tooltip={this.getTooltipFormat('fundGrowthRate*dateBuyAmount*dateSellAmount')}
        />

        <Geom
          type="line"
          position="date*profitRate"
          size={2}
          color={COLOR_PLATE_16[2]}
          tooltip={this.getTooltipFormat('profitRate*profit')}
        />

        <Geom
          type="point"
          position={`${x}*${y}`}
          size={4}
          shape={"circle"}
          opacity={['dateBuyAmount*dateSellAmount', (...arg) => {
            const dateBuyAmount = arg[0],
            dateSellAmount = (arg as any)[1]

            if (dateBuyAmount === 0 && dateSellAmount === 0) {
              return 0
            }
            return 1
          }]}
          tooltip={this.getTooltipFormat(y + '*dateBuyAmount')}
          style={[`dateBuyAmount*dateSellAmount`, {
            lineWidth: 2,
            fill(dateBuyAmount: number, dateSellAmount: number) {
              if(dateSellAmount > 0){
                return COLOR_PLATE_8[2]
              } else if (dateBuyAmount > 0) {
                return COLOR_PLATE_8[7]
              } else {
                return "#fff"
              }
            },
            stroke: "#fff"
          }]}
        />
      </Chart>
    </div>
  }
}