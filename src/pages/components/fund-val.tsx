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
    if(text === 'profitRate') {
      return [text, (profitRate: any) => ({
        name: this.props.textMap[text],
        value: roundToFix(profitRate * 100, 2)  + '%'
      })] as [string, any]
    }
    return [text, (fundGrowthRate, totalBuyAmount) => {
      const buyTip =totalBuyAmount ? `(${this.props.textMap['totalBuyAmount']} ${totalBuyAmount})` : ''
      return {
        name: this.props.textMap['fundGrowthRate'] ,
        value: roundToFix(fundGrowthRate * 100, 2)  + '%' + buyTip,
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
          tooltip={this.getTooltipFormat(y + '*totalBuyAmount')}
        />

        <Geom
          type="line"
          position="date*profitRate"
          size={2}
          color={COLOR_PLATE_16[2]}
          tooltip={this.getTooltipFormat('profitRate')}
        />

        <Geom
          type="point"
          position={`${x}*${y}`}
          size={4}
          shape={"circle"}
          opacity={['totalBuyAmount', (totalBuyAmount) => {
            if (totalBuyAmount === 0) {
              return 0
            }
            return 1
          }]}
          tooltip={this.getTooltipFormat(y + '*totalBuyAmount')}
          style={[`totalBuyAmount`, {
            lineWidth: 2,
            fill(totalBuyAmount: number) {
              if (totalBuyAmount > 0) {
                return '#ff3000'
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