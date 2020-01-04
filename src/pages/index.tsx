import React, { Component } from 'react';
import styles from './index.css';
import { FundChart } from './components/fund-line'
import { SearchForm, FundFormObj } from './components/search-form'
import 'antd/dist/antd.css'
import { getFundData, FundJson } from '@/utils/fund-stragegy/fetch-fund-data';
import { InvestmentStrategy, InvestDateSnapshot } from '@/utils/fund-stragegy';



export default class App extends Component<{}, {fundData: InvestDateSnapshot[]}> {
  
  state = {
    fundData: [] as InvestDateSnapshot[]
  }

  getFundData = async (formData: FundFormObj) => {
    console.log('基金情书', formData)

    const result = await getFundData(formData.fundId, formData.dateRange)
    console.log('result', result)
    this.createInvestStragegy(result, formData)
  }

  createInvestStragegy(fundData: FundJson, formData: FundFormObj) {
    const investment = new InvestmentStrategy({
      // fundJson: FundDataJson as FundJson,
      // range: ['2019-01-01', '2019-12-01'],
      totalAmount: 10000,
      salary: 10000,
      
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
      fundJson: fundData 
    })
    
    // investment
    //   .buy(0, '2018-12-26')
    //   .buy(5000, '2018-12-27')
    //   .sell('all', '2019-03-01')
    //   .buy(5000, '2019-08-01')
    //   .sell(2000, '2019-09-01')
    //   .buy(5000, '2019-12-01')
    investment.fixedInvest({
      fixedInvestment: {
        period: 'weekly',
        amount: 1200,
        dateOrWeek: 4
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

 