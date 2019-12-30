
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
import { InvestmentStrategy } from '@/utils/fund-stragegy/index.ts';
import { FundJson } from 'tools/get-fund-data-json';
import { TotalAmountChart, AmountProp } from './total-amount'
import { FundValChart } from './fund-val'
import { RateChart } from './rate'

const investment = new InvestmentStrategy({
  // fundJson: FundDataJson as FundJson,
  // range: ['2019-01-01', '2019-12-01'],
  totalAmount: 10000,
  salary: 0,
  fixedInvestment: {
    amount: 300,
    period: 'weekly',
    dateOrWeek: 4,
  },
  // buyFeeRate: 0.0015,
  // sellFeeRate: 0.005,
  stop: {
    rate: 0.05,
    minAmount: 50000,
  },

  tInvest: {
    rate: 0.05,
    amount: 1000
  },
  fundJson: FundDataJson as any as FundJson
})

investment
  .buy(0, '2018-12-26')
  .buy(5000, '2018-12-27')
  .sell(3000, '2019-03-01')
  .buy(5000, '2019-08-01')
  .sell(2000, '2019-09-01')
  // .sell('all', '2019-03-02')
  // .buy(5000, '2019-06-01')

  // .buy(0, '2019-03-02')
console.log('investment', investment)
export class FundLine extends Component {

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
    // const data = [
    //   {
    //       month: "Jan",
    //       city: "Tokyo",
    //       temperature: 7
    //   }
    // ];

    const investmentData = investment.data.map(item => {
      return {
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
        accumulatedProfit: item.accumulatedProfit
      }
    })
    let data = investmentData
    const cols = {
      date: {
        // x 轴的比例尺
        // 如果是 [0,1]: 在视图内展示所有数据
        // 如果是 [0,2]: 在2倍视图内展示所有数据
        // [0, 0.5]: 在 0.5 倍视图内展示所有数据
        range: [0, 1]
      }
    };
    const keyTextMap = {
      totalAmount: '总资产',
      leftAmount: '剩余可用资金',
      profitRate: '持有收益率',
      profit: '持有收益',
      totalProfit: '累计收益',
      fundAmount: '基金持有金额',
      fundVal: '基金净值',
      fundGrowthRate: '基金涨幅',
      dateBuyAmount: '买入金额',
      dateSellAmount: '卖出金额',
      accumulatedProfit: '累计收益',
    }
    console.log('源数据', data)
    return (
      <div style={{
        margin: "0 auto",
        maxWidth: '1200px'
      }}>
        <FundValChart data={data} textMap={keyTextMap} commonProp={this.commonProp}  />

        <TotalAmountChart data={data} textMap={keyTextMap} commonProp={this.commonProp} />

        <RateChart data={data} textMap={keyTextMap} commonProp={this.commonProp} />
      </div>
    );
  }
}
