
import axios from 'axios'
import { notification } from 'antd'
import { dateFormat } from '../common'

const getJSONP = window['getJSONP']

export interface FundDataItem {
  date: string
  val: number
  accumulatedVal: number
  growthRate: number
  bonus: number
}

export interface FundJson {
  all: Record<string, FundDataItem>
  bonus: Record<string, FundDataItem>,
}

/**
 * 拉取数据, 260108
 */
export const getFundData = async (fundCode: string | number, size: number | [any, any]): Promise<FundJson> => {
  const page = 1
  let pageSize = size
  let startDate = '', endDate = ''
  if (Array.isArray(size)) {
    pageSize = (new Date(size[1]).getTime() - new Date(size[0]).getTime()) / 1000 / 60 / 60 / 24
    startDate = dateFormat(new Date(size[0])) 
    endDate = dateFormat(new Date(size[1])) 
  }

  const path = `http://api.fund.eastmoney.com/f10/lsjz?fundCode=${fundCode}&pageIndex=${page}&pageSize=${pageSize}&startDate${startDate}=&endDate=${endDate}&_=${Date.now()}`

  return new Promise((resolve) => {
    getJSONP(path, (resp) => {
      let json = resp
      const historyVal = json.Data.LSJZList // 历史净值
      // 日期    FSRQ，  date
      // 单位净值 DWJZ，  val
      // 累计净值 LJJX，  accumulatedVal
      // 日增长率 JZZZL   growthRate
      // 分红送配 FHFCZ  bonus

      const formatResult = historyVal.reduce((result, item) => {
        const curFundObj: FundDataItem = {
          date: item.FSRQ,
          val: item.DWJZ,
          accumulatedVal: item.LJJZ,
          growthRate: item.JZZZL,
          bonus: item.FHFCZ
        }
        result.all[curFundObj.date] = curFundObj

        if (curFundObj.bonus) {
          result.bonus[curFundObj.date] = curFundObj
        }

        return result
      }, {
        bonus: {},
        all: {}
      })

      resolve(formatResult)
    })

  })
  

  


}


