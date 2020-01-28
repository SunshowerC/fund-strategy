import React, { Component } from 'react';
import styles from './index.css';
import { FundChart } from './components/fund-line'
import { SearchForm, FundFormObj } from './components/search-form'
import 'antd/dist/antd.css'
import { getFundData, FundJson } from '@/utils/fund-stragegy/fetch-fund-data';
import { InvestmentStrategy, InvestDateSnapshot } from '@/utils/fund-stragegy';
import { notification } from 'antd';
import moment from 'moment'
// TODO: 动态查询实时上证指数数据
import shangZhengData from '../utils/fund-stragegy/static/shanghai.json'
import { dateFormat, roundToFix } from '@/utils/common';


export default class App extends Component<{}, {fundData: InvestDateSnapshot[]}> {
  
  state = {
    fundData: [] as InvestDateSnapshot[]
  }


  /**
   * 基金数据查询
   */
  getFundData = async (formData: FundFormObj) => {
    console.log('基金表单参数', formData)

    const result = await getFundData(formData.fundId, formData.dateRange)
    console.log('result', result)
    const startDate = new Date( Object.keys(result.all).pop()! )
    if(startDate.getTime() > new Date(formData.dateRange[0]).getTime()) {
      formData.dateRange[0] = moment(startDate)
    }
    try {
      this.createInvestStragegy(result, formData)
    } catch(e) {
      notification.error({
        message: '基金创建错误',
        description: e.message
      })
      throw new Error(e)
    }
  }

  createInvestStragegy(fundData: FundJson, formData: FundFormObj) {
    console.log('form', formData)
    const investment = new InvestmentStrategy({
      // fundJson: FundDataJson as FundJson,
      // range: ['2019-01-01', '2019-12-01'],
      totalAmount: formData.totalAmount + formData.purchasedFundAmount,
      salary: formData.salary,
      shangZhengData,
      
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
      fundJson: fundData,
      onEachDay(this: InvestmentStrategy, curDate: number){
        const dateStr  = dateFormat(curDate)
        const latestInvestment = this.latestInvestment
        // console.log('this day', dateFormat(curDate), this.annualizedRate.totalProfit)
        const curSzIndex = this.getFundByDate(dateStr, {
          origin: shangZhengData
        })

        // 上证指数大于3000
        if(curSzIndex.val > 3000) {
          // console.log('指数大于3000', dateStr)
        }
        const level =  roundToFix(latestInvestment.fundAmount / latestInvestment.totalAmount, 2)
        // 仓位大于
        if(level > 0.7) {
          // console.log('仓位大于 7 层', dateStr)
        }

        if(latestInvestment.maxAccumulatedProfit.date === latestInvestment.date) {
          console.log('当前收益历史新高', dateStr, latestInvestment.maxAccumulatedProfit.amount)
        }
      }
    })
    
    // investment
    //   .buy(0, '2018-12-26')
    //   .buy(5000, '2018-12-27')
    //   .sell('all', '2019-03-01')
    //   .buy(5000, '2019-08-01')
    //   .sell(2000, '2019-09-01')
    //   .buy(5000, '2019-12-01')
    investment
    .buy(formData.purchasedFundAmount, formData.dateRange[0])
    .fixedInvest({
      fixedInvestment: {
        period: formData.period[0],
        amount: formData.fixedAmount,
        dateOrWeek: formData.period[1]
      },
      range: formData.dateRange
    })
    console.log('investment', investment)
    
    this.setState({
      fundData: investment.data
    })
  }
  
  render() {


    return (
      <div className={styles.normal}>
          <SearchForm onSearch={this.getFundData} />
          {this.state.fundData.length === 0 ? '' : <FundChart data={this.state.fundData} />}
      </div>
    );
  }
}

 