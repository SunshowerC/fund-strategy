import React, {Component} from 'react'
import { AmountProp } from './total-amount'
import { Chart, Axis, Tooltip, Geom } from 'bizcharts'
import { IndexData } from '@/utils/fund-stragegy/fetch-fund-data'
import { COLOR_NAME } from '@/utils/color'
import { roundToFix } from '@/utils/common'


interface MacdLineProp extends Omit<AmountProp, 'data'> {
  data: Record<string, IndexData>
}

// type MacdLineProp = Omit<AmountProp, 'data'> & {
//   data: Record<string, IndexData>
// }

export default class MacdLine extends Component<MacdLineProp> {

  getDataList() {
    const result =  Object.values(this.props.data).slice(0,30)
    result.forEach(item => {
      item.macd = roundToFix(item.macd, 2)
    })
    return result
  }

  render() {
    const {  textMap, commonProp } = this.props
    const commonChartProp = commonProp.chart
    const data = this.getDataList()
    console.log('macd line', data)
    const scale = {
      date: {
        type: 'timeCat'
      }
    }
    return <div >
      <h1 className="main-title" >
        MACD 趋势图
      </h1>
      <Chart  data={data} scale={scale}  {...commonChartProp} >
          <Axis name='date' />
          <Axis name='macd' />
          <Tooltip />
          <Geom type='interval' 
            color={['macd', (macd)=>{
              return macd > 0 ? COLOR_NAME.red : COLOR_NAME.green
            }]}
                position='date*macd' />
      </Chart>
    </div>
  }
}