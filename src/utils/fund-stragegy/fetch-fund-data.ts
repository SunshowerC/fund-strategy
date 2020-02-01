
import axios from 'axios'
import { notification } from 'antd'
import { dateFormat } from '../common'

// TODO: 使用 fetch-jsonp
const getJSONP = window['getJSONP']

export interface FundDataItem {
  date: string
  val: number
  accumulatedVal: number
  growthRate: number
  bonus: number
  isBonusPortion?: boolean // FHSP: "每份基金份额折算1.020420194份"

}

export interface FundJson {
  all: Record<string, FundDataItem>
  bonus: Record<string, FundDataItem>,
}

/**
 * 上证指数数据
 */
export type ShangZhengData = Record<string, Pick< FundDataItem, 'date'|'val'>>

/**
 * 拉取数据, 260108
 */
export const getFundData = async (fundCode: string | number, size: number | [any, any]): Promise<FundJson> => {
  const page = 1
  let pageSize:number 
  let startDate = '', endDate = ''
  if (Array.isArray(size)) {
    pageSize = (new Date(size[1]).getTime() - new Date(size[0]).getTime()) / 1000 / 60 / 60 / 24
    startDate = dateFormat(new Date(size[0])) 
    endDate = dateFormat(new Date(size[1])) 
  } else {
    pageSize = size
  }

  const path = `http://api.fund.eastmoney.com/f10/lsjz?fundCode=${fundCode}&pageIndex=${page}&pageSize=${Math.floor(pageSize)}&startDate=${startDate}&endDate=${endDate}&_=${Date.now()}`

  return new Promise((resolve) => {
    getJSONP(path, (resp) => {
      let json = resp
      const historyVal = json.Data.LSJZList // 历史净值
      // 日期    FSRQ，  date
      // 单位净值 DWJZ，  val
      // 累计净值 LJJX，  accumulatedVal
      // 日增长率 JZZZL   growthRate
      // 分红送配 FHFCZ  bonus
      // FHSP: "每份基金份额折算1.020420194份"

      let previousItem 
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
          
          // 分红分为 分红派送，以及份额折算两种
          if((item.FHSP as string).startsWith('每份基金份额折算')) {
            curFundObj.isBonusPortion = true
            // curFundObj.bonus = previousItem.val * (1 + curFundObj.growthRate / 100) * (1 - 1 / curFundObj.bonus)
          }
        }

        previousItem = curFundObj

        return result
      }, {
        bonus: {},
        all: {}
      })

      resolve(formatResult)
    })

  })
  

  


}

export interface FundInfo {
  code: string
  name: string
}
export const getFundInfo = async (key):Promise<FundInfo[]>=>{
  return new Promise((resolve)=>{
    const path = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=10&t=700&IsNeedBaseInfo=0&IsNeedZTInfo=0&key=${key}&_=${Date.now()}`

    getJSONP(path, (resp) => {
      const result = resp.Datas.map(item => {
        return {
          code: item.CODE,
          name: item.NAME
        }
      })

      resolve(result)
    })
  })

}
