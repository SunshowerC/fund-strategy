
/* 
图表
done 1. 总资产 totalAmount  基金资产 fundAmount 3. 剩余可用资金 leftAmount 【是否爆仓】


done 4. 基金净值 fundVal + 买入红点，卖出蓝点
done 5. 收益率profitRate + 累计盈亏 profit 
6. TODO: 仓位 = 资金资产 / 总资产

7. 结果值：平均年化收益率， 最大回撤
*/
import React, { Component } from 'react';
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
  Util
} from "bizcharts";
import FundDataJson from '@/utils/fund-stragegy/static/景顺长城新兴成长混合260108.json'
import { InvestmentStrategy, InvestDateSnapshot } from '@/utils/fund-stragegy/index.ts';
import { FundJson } from 'tools/get-fund-data-json';
import { TotalAmountChart, AmountProp } from './total-amount'
import { FundValChart } from './fund-val'
import { RateChart } from './rate'
import {CommonFundLine} from './common-line'

/**
 * 数据映射表
 */
export const keyTextMap = {
  totalAmount: '总资产',
  leftAmount: '剩余可用资金',
  profitRate: '持有收益率',
  profit: '持有收益',
  fundAmount: '基金持有金额',
  fundVal: '基金净值',
  fundGrowthRate: '基金涨幅',
  dateBuyAmount: '买入金额',
  dateSellAmount: '卖出金额',
  accumulatedProfit: '累计盈亏',
  maxPrincipal: '累计本金',
  totalProfitRate: '累计收益率',
}


export class FundChart extends Component<{data: InvestDateSnapshot[]}> {

  commonProp: AmountProp['commonProp'] = {
    chart: {
      forceFit: true,
      height: 450, 
      padding: [
        20, 80, 100, 80
      ]
    }
  }

  render() {

    const investmentData = this.props.data.map(item => {
      return {
        // ...item,
        // fundVal: Number(item.curFund.val),
        origin: item,
        totalAmount: item.totalAmount,
        leftAmount: item.leftAmount,
        date: item.date,
        profit: item.profit,
        profitRate: item.profitRate,
        fundAmount: item.fundAmount,
        fundVal: Number(item.curFund.val),
        fundGrowthRate: item.fundGrowthRate,
        dateBuyAmount: item.dateBuyAmount,
        dateSellAmount: item.dateSellAmount,
        accumulatedProfit: item.accumulatedProfit,
        maxPrincipal: item.maxPrincipal,
        totalProfitRate: item.totalProfitRate
      }
    })
    let data = investmentData as any as InvestDateSnapshot[]
    const cols = {
      date: {
        // x 轴的比例尺
        // 如果是 [0,1]: 在视图内展示所有数据
        // 如果是 [0,2]: 在2倍视图内展示所有数据
        // [0, 0.5]: 在 0.5 倍视图内展示所有数据
        range: [0, 1]
      }
    };
    
    console.log('源数据', data)
    return (
      <div >
        <FundValChart data={data} textMap={keyTextMap} commonProp={this.commonProp}  />

        <RateChart data={data} textMap={keyTextMap} commonProp={this.commonProp} />

        <TotalAmountChart data={data} textMap={keyTextMap} commonProp={this.commonProp} />

        <CommonFundLine 
          y='totalAmount'
          data={data} textMap={keyTextMap} commonProp={this.commonProp} />
      </div>
    );
  }
}
