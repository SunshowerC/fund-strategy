
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


export enum IndexFund {
  ShangZheng = 'zs_000001',
}

/**
 * 获取指数基金
 * */ 
export const getIndexFundData = async (opt: {
  code: string, 
  range: [number|string, number|string]
}) => {
  // http://img1.money.126.net/data/hs/kline/day/history/2020/0000001.json
  /* 数据结构
  ["20200123",3037.95,2976.53,3045.04,2955.35,27276323400,-2.75]
  日期，今开，今日收盘价，最高，最低，成交量，跌幅
   */

  // q.stock.sohu.com/hisHq?code=zs_000001&start=20130930&end=20200201&stat=1&order=D&period=d&rt=jsonp
  // ["2020-01-23", "3037.95", "2976.53", "-84.23", "-2.75%", "2955.35", "3045.04", "272763232",32749038.00]
  // 日期，今开，收盘，下跌，跌幅，最低，最高，成交量/手，成交额/万
  let [start,end] = opt.range.map(item => dateFormat(item, 'yyyyMMdd'))
  const savedData = JSON.parse(localStorage.getItem(opt.code)||'{}') 
  const dateList = Object.keys(savedData)
  const [savedStart, savedEnd] = [dateList[dateList.length-1], dateList[0]]
  if((new Date(opt.range[0]) >= new Date(savedStart)) && (new Date(opt.range[1]) <= new Date(savedEnd))) {
    return savedData
  } else {
    if(new Date(opt.range[0]) >= new Date(savedStart)) {
      start = dateFormat(savedEnd, 'yyyyMMdd') 
    }
    if(new Date(opt.range[1]) <= new Date(savedEnd)) {
      end = dateFormat(savedStart, 'yyyyMMdd')  
    }
  }
  return new Promise((resolve)=>{
    getJSONP(`//q.stock.sohu.com/hisHq?code=${opt.code}&start=${start}&end=${end}&stat=1&order=D&period=d&rt=jsonp`, (res)=>{
      console.log(`指数基金 响应`, res[0].hq)
      const list = res[0].hq
      const indexFundData = list.reduce((result, cur)=>{
        const [date, ,val] = cur
        result[date] = {
          date,
          val
        }
        return result 
      }, {})
      
      const mergedData = {
        ...savedData,
        ...indexFundData
      }
      localStorage.setItem(opt.code, JSON.stringify(mergedData))

      resolve(mergedData)
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
