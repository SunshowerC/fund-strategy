
/* 
图表
1. 总资产 totalAmount
2. 基金资产 fundAmount
3. 剩余可用资金 leftAmount 【是否爆仓】
4. 基金净值 fundVal + 买入红点，卖出蓝点
5. 收益率profitRate + 累计盈亏 profit 
6. 
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

const investment = new InvestmentStrategy({
  // fundJson: FundDataJson as FundJson,
  // range: ['2019-01-01', '2019-12-01'],
  totalAmount: 20000,
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

investment.buy(10000, '2019-01-01')
// .buy(10000, '2019-06-01')
.buy(0, '2019-11-01')
console.log('investment', investment)
export class FundLine extends Component {
  render() {
    // const data = [
    //   {
    //       month: "Jan",
    //       city: "Tokyo",
    //       temperature: 7
    //   }
    // ];

    const investmentData = investment.data.map(item=>{
      return {
        origin: item,
        totalAmount: item.totalAmount,
        leftAmount: item.leftAmount,
        date: item.date,
        profit: item.profit,
        profitRate: item.profitRate,
        fundAmount: item.fundAmount,
        fundVal: Number(item.curFund.val)
      }
    })
    let  data = investmentData
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
      profitRate: '收益率',
      profit: '累计收益',
      fundAmount: '基金持有金额',
      fundVal: '基金净值'
    }
    console.log('源数据', data)
    return (
      <div>
        <Chart height={400} data={data}  forceFit>
          <Legend 
            itemFormatter={val => {
              return keyTextMap[val]
            }}
          />
          <Axis name="date" />
          <Axis
            name="fundAmount"
            // label={{
            //   formatter: val => `${val} 元`
            // }}
          />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="line"
            position="date*totalAmount" // x 轴是 month , y 是 temperature
            size={2}
          />
          {/* <Geom
            type="line"
            position="date*fundAmount" // x 轴是 month , y 是 temperature
            size={2}
            color="#ff0000"
          /> */}
          
          {/* <Geom
            type="point"
            position="date*totalAmount"
            size={2}
            shape={"circle"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          /> */}
        </Chart>


        <Chart height={400} data={data}  forceFit>
          <Legend 
            itemFormatter={val => {
              return keyTextMap[val]
            }}
          />
          <Axis name="date" />
           
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          
          <Geom
            type="line"
            position="date*fundAmount" // x 轴是 month , y 是 temperature
            size={2}
          />
          
        </Chart>

        <Chart height={400} data={data}  forceFit>
          <Legend 
            itemFormatter={val => {
              return keyTextMap[val]
            }}
          />
          <Axis name="date" />
           
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          
          <Geom
            type="line"
            position="date*fundVal" // x 轴是 month , y 是 temperature
            size={2}
          />
          
        </Chart>

        <Chart height={400} data={data}  forceFit>
          <Legend 
            itemFormatter={val => {
              return keyTextMap[val]
            }}
          />
          <Axis name="date" />
           
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          
          <Geom
            type="line"
            position="date*profitRate" // x 轴是 month , y 是 temperature
            size={2}
          />

          <Geom
            type="line"
            position="date*profit" // x 轴是 month , y 是 temperature
            size={2}
            color="#ff0000"
          />
          
        </Chart>
      </div>
    );
  }
}
