/**************************
 * 投资类 描述了 指定策略下的投资过程
 * 投资快照类 描述了投资过程中，某一天的状态
 **************************/

import { FundJson, FundDataItem } from "../../tools/get-fund-data-json"
import { dateFormat, roundToFix } from "../utils/common"

interface FundTransaction {
  /** 
   * 份额 
   * */
  portion: number 
  /** 
   * 基金净值
   * */
  val: number 
  /** 
   * 金额
   * */
  amount: number
}

/**
 * 基金的长期投资计划
 */
class InvestmentStrategy {
  totalAmount: number // 初始资本，存量
  salary: number // 工资，每月增量资金
  
  fixedInvestment: {
    amount: number // 每次定投金额
    dateOrWeek: number // 每周周几，每月几号定投
    period: 'weekly' | 'monthly'   // 每周，每月，每 2 周定投
  } // 定投周期

  /**
   * 当前投资的状态
   */
  latestInvestment: InvestDateSnapshot

  beginDate: string // 开始投资的日子
  fundJson: FundJson // 基金源数据
  
  buyFeeRate: number // 买入的手续费， 一般是 0.15%
  sellFeeRate: number // 卖出的手续费， 一般是 0.5%
  
  // 止盈点， 
  stop: {
    rate: number  // 基金涨了 5 % 就止盈一部分
    minAmount: number // 止盈的最低 持仓临界线，如低于 10% 
  }

  // 做 T 时的配置信息
  tInvest: {
    rate: number // 自上次止盈后， 降幅 rate 幅度后 做 T
    amount: number // 补仓 份额 （买）
  }

  /**
   * 该基金策略下运行的每个交易日的数据
   */
  data: InvestDateSnapshot[]
}

/**
 * 投资周期中，某一天的持仓快照
 */
class InvestDateSnapshot {
  /**
   * 基金投资策略
   */
  fundStrategy: InvestmentStrategy 

  /** 
   * 持仓成本 单价
   * */ 
  cost: number // 每天操作后计算赋值
   

  /**
   * 持仓成本金额
   */
  get costAmount():number {
    return this.cost * this.portion
  }

  /** 
   * 持仓份额  
   * */
  portion:number // 每天操作后计算赋值
   

  /**
   * 持仓金额 = 当前净值 * 持有份额
   */
  get fundAmount():number {
    return this.curFund.val * this.portion
  } 

  /** 
   * 持有收益 = （当前净值 - 持有成本）* 持仓份额  
   * */
  get profit():number {
    return (this.curFund.val - this.cost) * this.portion
  } 
  /** 
   * 持有收益率 = （当前净值 / 成本价）- 1 
   * */
  get profitRate():number {
    return this.curFund.val / this.cost
  }
  /**
   * 资金弹药，还剩下多少钱可以加仓，可用资金
   * = 上一个交易日的 leftAmount + (今日加减仓)
   */
  leftAmount:number 
  
  /**
   * 总资产 = 资金弹药 +  持仓金额
   */
  get totalAmount(): number  {
    return this.leftAmount + this.fundAmount
  }
  
  date: string // 当前日期

  get shouldFixedInvest():boolean {
    const now = new Date()
    const fixedInvestment = this.fundStrategy.fixedInvestment
    if(fixedInvestment.period === 'monthly') {
      return now.getDate() === fixedInvestment.dateOrWeek
    }

    if(fixedInvestment.period === 'weekly') {
      return now.getDay() === fixedInvestment.dateOrWeek
    }
  }

  /**
   * 当前基金数据
   */
  curFund: FundDataItem 

  fixedBuy: FundTransaction|null// 被动定投买入份额，金额。 金额 = 份额 * 基金净值
  profitSell: FundTransaction|null // 被动触发条件 卖出止盈的，份额，金额，
  buyWhenDecline: FundTransaction|null // 主动补仓买入份额，金额
  sellWhenRise: FundTransaction|null // 卖出补仓做 T 的份额，金额，

  /**
   * @param options 
   */
  constructor(options: Pick<InvestDateSnapshot, 'date'|'fundStrategy'|'cost'|'leftAmount'|'portion'>) {
    // 每天的操作，只需要手动更新：date, cost，portion, leftAmount
    this.date = options.date ? dateFormat(options.date) : dateFormat(Date.now())
    this.fundStrategy = options.fundStrategy
    this.curFund = this.fundStrategy.fundJson[this.date]

    this.operate()
  }

  /**
   * 该日期基金操作行为
   */
  operate() {
    this.income()
    // TODO: 
    // 分红日？重新计算 成本和 份额。【分红后，收益不变，净值变低。 所以 持仓成本 = 分红后净值/ （profitRate+1）】【份额 = fundAmount / 分红后净值】
    
    // 定投日? 买入定投金额
    if(this.shouldFixedInvest) {
      this.buy(this.fundStrategy.fixedInvestment.amount)
    }
    
    // TODO: 触发补仓？

    // TODO: 触发止盈？

    // TODO: 触发卖出补仓份额？

    

    // 剩余资金小于 0， 即为爆仓
    if(this.fundAmount < 0) {
  
    }

    this.fundStrategy.latestInvestment = this

    
  }

  /**
   * 发工资，增加可用资金
   */
  private income() {
    const latestInvestment = this.fundStrategy.latestInvestment
    const salaryDate = 1
    // 发薪日
    if(new Date().getDate() === salaryDate) {
      this.leftAmount += latestInvestment.leftAmount + this.fundStrategy.salary
    }
  }
  
  /**
   * 填充满买入时交易相关数据
   * @param txn 交易数据
   */
  private fulfillBuyTxn(txn:Partial<FundTransaction>): FundTransaction{
    txn.val = txn.val || this.curFund.val
    if(txn.amount && !txn.portion) {
      // 除去买入费率的 净申购金额 (参考 支付宝基金买入申购计算)
      txn.amount = roundToFix( txn.amount / (1 + this.fundStrategy.buyFeeRate), 2 )
      txn.portion = roundToFix(txn.amount / txn.val, 2)
    }
 
    return txn as FundTransaction
  }

  /**
   * 填充满卖出时交易相关数据
   * @param txn 交易数据
   */
  private fulfillSellTxn(txn:Partial<FundTransaction>): FundTransaction{
    txn.val = txn.val || this.curFund.val
    let portion:number 
    // 卖出只能用份额计算
    // 如果是卖出 指定 amount，转换成份额
    if(txn.amount && !txn.portion) {
      portion = roundToFix(txn.amount / txn.val, 2)
    } else if(!txn.amount && txn.portion) {
      // 如果是卖出指定 份额
      portion = txn.portion
    } else {
      throw new Error('txn.portion 和 txn.amount 必须有且只有一个值')
    }
    txn.portion = portion

    // 卖出的真实 到账金额
    txn.amount = txn.val * portion * (1 - this.fundStrategy.sellFeeRate)
 
    return txn as FundTransaction
  }
 
  /**
   * 买入基金行为，买入金额
   * @param amount 金额
   */
  buy(amount:number) {
    const buyTxn = this.fulfillBuyTxn({
      amount
    })
    
    const latestInvestment = this.fundStrategy.latestInvestment
    // 最新份额 = 上一次的 份额，加最新买入的份额
    this.portion = latestInvestment.portion + buyTxn.portion

    // 买入行为后，持仓成本 = (之前持仓成本金额 + 买入金额) / 基金总份额
    this.cost = (latestInvestment.costAmount + buyTxn.amount)  / this.portion

    // 买入后从剩余资金扣除
    this.leftAmount = latestInvestment.leftAmount - buyTxn.amount
    
  }
  /**
   * 卖出基金
   * @param txn 卖出信息
   */
  sell(txn:Partial<FundTransaction>) {
    const sellTxn = this.fulfillSellTxn(txn)
    const latestInvestment = this.fundStrategy.latestInvestment

    // 最新份额 = 上一次的 份额 - 最新卖出的份额
    this.portion = latestInvestment.portion - sellTxn.portion

    // 卖出行为后，持仓成本 = (之前持仓成本金额 - 卖出金额) / 基金总份额
    this.cost = (latestInvestment.costAmount - sellTxn.amount)  / this.portion

    // 买入后从剩余资金扣除
    this.leftAmount = latestInvestment.leftAmount + sellTxn.amount
  }

}

// TODO: 某个时间点到某个时间点之间的 涨幅比较
// 普通场景 涨幅： Tb / Ta - 1 
// 中间存在 分红点： Tb / fh * (fh + 派送金额) / Ta - 1 
