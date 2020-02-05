import React, {Component} from 'react'
import { AmountProp } from './total-amount'
import { Chart, Axis, Tooltip, Geom } from 'bizcharts'
import { IndexData } from '@/utils/fund-stragegy/fetch-fund-data'
import { COLOR_NAME } from '@/utils/color'
import { roundToFix } from '@/utils/common'


interface MacdLineProp extends Omit<AmountProp, 'data'> {
  data: Record<string, IndexData>
  title?: string
}

// type MacdLineProp = Omit<AmountProp, 'data'> & {
//   data: Record<string, IndexData>
// }

export default class MacdLine extends Component<MacdLineProp> {

  getDataList() {
    const result =  Object.values(this.props.data).slice(0,100)
    let min = 0,max = 0
    result.forEach(item => {
      item.macd = roundToFix(item.macd, 2)
      item.diff = roundToFix(item.diff, 2)
      item.dea = roundToFix(item.dea, 2)
      const [curMin, curMax] = [Math.min(item.macd, item.diff, item.dea), Math.max(item.macd, item.diff, item.dea)]
      min = min < curMin ? min : curMin
      max = max > curMax ? max : curMax
    })
    return {result, min, max}
  }

  render() {
    const {  textMap, commonProp, title } = this.props
    const commonChartProp = commonProp.chart
    const {result: data, min, max} = this.getDataList()
    console.log('macd line', data)
    const commonLineScale = {
      min,
      max
    }
    const scale = {
      date: {
        type: 'timeCat'
      },
      macd: commonLineScale,
      diff: commonLineScale,
      dea: commonLineScale,
    }
    return <div >
      <h1 className="main-title" >
        {title} MACD 趋势图
      </h1>
      <Chart  data={data} scale={scale}  {...commonChartProp} >
          <Axis name='date' />
          <Axis name='macd' />
          <Axis name="diff" visible={false} />
          <Axis name="dea" visible={false} />

          <Tooltip />
          <Geom type='interval' 
            color={['macd', (macd)=>{
              return macd > 0 ? COLOR_NAME.red : COLOR_NAME.green
            }]}
                position='date*macd' />
          <Geom type='line' position='date*diff' color={COLOR_NAME.yellow} />
          <Geom type='line' position='date*dea' color={COLOR_NAME.blue} />
      </Chart>
    </div>
  }
}