import React, {Component} from 'react'
import { AmountProp } from '../components/total-amount'
import { CommonFundLine, CommonFundLineProp } from '../components/common-line'
import { keyTextMap } from '../components/fund-line'
import {ChartSnapshot} from './compare'
import { InvestDateSnapshot } from '@/utils/fund-stragegy'
import { formatPercentVal } from '@/utils/common'
const commonProp:AmountProp['commonProp'] = {
  chart: {
    forceFit: true,
    height: 450, 
    padding: [
      20, 80, 100, 80
    ]
  }
}

/**
 * 需要百分比展示的数据
 */
const percentProp: (keyof ChartSnapshot)[] = ['fundGrowthRate','profitRate', 'totalProfitRate']

export interface StragegyItem {
  name: string, 
  data: ChartSnapshot[] 
}

export interface CompareChartProp {
  data: StragegyItem[]
  /**
   * 需要展示的图表列表
   */
  chartList: string[]
}

export class CompareChart extends Component<CompareChartProp> {

  

  render() {
    const {data} = this.props
    if(!data || data.length === 0) {
      return null
    }
    const allData = data.reduce<ChartSnapshot[]>((resule, item) => {
      return [
        ...resule,
        ...item.data
      ]
    }, [])
    // const first = this.props.data[0].data
    const {chartList} = this.props

    return <div>
      {
        chartList.map((chartProp: any,index) => {
          const prop:CommonFundLineProp = {
            y: chartProp,
            data: allData,
            textMap: keyTextMap,
            commonProp,
            formatVal: percentProp.includes(chartProp) ? formatPercentVal : undefined
          }
        return <CommonFundLine  key={index} {...prop} />
        })
      }
    </div>
  }
}