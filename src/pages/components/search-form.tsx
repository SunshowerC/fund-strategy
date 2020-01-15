import React, { Component, Fragment } from 'react';
import { Form, DatePicker, TimePicker, Button, Input, Card, Select, InputNumber, Cascader, Divider } from 'antd';
import { WrappedFormUtils, FormComponentProps, GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import moment from 'moment';
import { dateFormat } from '@/utils/common';
import { FundInfo, getFundInfo } from '@/utils/fund-stragegy/fetch-fund-data';
import styles from '../index.css';

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select

export interface FundFormObj {
  /**
   * 基金 id
   */
  fundId: string
  /**
   * 时间范围
   */
  dateRange: [any, any]

  /**
   * 定投周期 + 定投时间
   */
  period: ['weekly' | 'monthly', number]

  /**
   * 初始资产
   */
  totalAmount: number
  /**
   * 工资
   */
  salary: number
  /**
   * 定投资金
   */
  fixedAmount: number
  /**
   * 已买入基金
   */
  purchasedFundAmount: number
}

export interface FundSearchProp extends FormComponentProps<FundFormObj> {
  onSearch: (form: FundFormObj) => any
}


export class InnerSearchForm extends Component<FundSearchProp, {
  searchFundData: FundInfo[]
}> {

  state = {
    searchFundData: [] as FundInfo[]
  }
  private weekOpt = ['一', `二`, `三`, `四`, `五`].map((item, index) => {
    return {
      value: index + 1 as any as string,
      label: `周` + item
    }
  })

  private monthOpt = Array(28).fill('').map((item,index) => {
    return {
      value: index+1 as any as string,
      label: `${index + 1}号`
    }
  })


  get periodOpts()  {
    return [{
      value: 'weekly',
      label: '每周',
      children: this.weekOpt
    }, {
      value: 'monthly',
      label: '每月',
      children: this.monthOpt
    }]
  } 
  

  handleSearch = async (value) => {
    if (value) {
      const result = await getFundInfo(value)
      this.setState({ searchFundData: result });
    } else {
      this.setState({ searchFundData: [] });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSearch(values)
      }
    });
  }

  reset = () => {
    this.props.form.resetFields()
  }

  private disabledDate = (date) => {
    const selectDate = new Date(date).getTime()
    const now = Date.now()
    return selectDate > now
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { searchFundData } = this.state
    let [curYear, curMonth, curDate] = dateFormat(new Date()).split('-').map(Number)
    curMonth = Number(curMonth) - 1

    const formItemLayout = {
      style: {
        width: 500
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const rangeConfig: GetFieldDecoratorOptions = {
      rules: [{ type: 'array', required: true, message: '请选择时间范围' }],
    };

    return <Card title="基金选项" style={{
      textAlign: 'initial',
      margin: '20px 0'
    }} >

      <Form {...formItemLayout} onSubmit={this.handleSubmit} >
        <Form.Item label="基金编号">
          {getFieldDecorator<FundFormObj>('fundId', {
            rules: [{ required: true, message: '请输入基金编号' }]
          })(
            // <Input />
            <Select
              showSearch
              placeholder="输入基金名称或基金编号"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearch}
              // onChange={this.handleChange}
              notFoundContent={null}
            >
              {searchFundData.map(d => <Option key={d.code}>{d.name}[{d.code}]</Option>)}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="时间范围">
          {getFieldDecorator<FundFormObj>('dateRange', rangeConfig)(
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              ranges={{
                '最近一年': [moment([Number(curYear) - 1, curMonth, curDate]), moment([curYear, curMonth, curDate])],
                '最近两年': [moment([Number(curYear) - 2, curMonth, curDate]), moment([curYear, curMonth, curDate])],
                '最近三年': [moment([Number(curYear) - 3, curMonth, curDate]), moment([curYear, curMonth, curDate])],
                '最近五年': [moment([Number(curYear) - 5, curMonth, curDate]), moment([curYear, curMonth, curDate])],
              }}
              disabledDate={this.disabledDate} />)}
        </Form.Item>

        {/* 投资策略 */}
        <Divider orientation="left">投资策略 <span className={styles.hint}>默认[分红方式：红利复投][买入费率:0.15%][卖出费率0.5%]</span></Divider>
        <Form.Item label="初始本金">
        {getFieldDecorator<FundFormObj>('totalAmount', {
          initialValue: 10000,
          rules: [{required: true, message: '请输入本金'}]
        })(
          <InputNumber style={{width: '100%'}} min={0}  />
        )}
        </Form.Item>

        <Form.Item label="月工资[每月增量资金]">
        {getFieldDecorator<FundFormObj>('salary', {
          initialValue: 10000,
          rules: [{required: true, message: '请输入月工资'}]
        })(
          <InputNumber style={{width: '100%'}} min={0}  />
        )}
        </Form.Item>

        <Form.Item label="初始持有基金金额">
        {getFieldDecorator<FundFormObj>('purchasedFundAmount', {
          initialValue: 0,
          rules: [{required: true, message: '输入持有基金金额, 从0开始定投则填0'}]
        })(
          <InputNumber style={{width: '100%'}} min={0} placeholder="投资开始时持有的基金金额"  />
        )}
        </Form.Item>

        <Form.Item label="定投金额">
        {getFieldDecorator<FundFormObj>('fixedAmount', {
          rules: [{required: true, message: '输入定投金额'}],
          initialValue: 1000,
        })(
          <InputNumber style={{width: '100%'}} min={0}  />
        )}
        </Form.Item>

        <Form.Item label="定投周期">
        {getFieldDecorator<FundFormObj>('period', {
          initialValue: ['monthly', 1],
          rules: [{required: true, }],
        })(
          <Cascader options={this.periodOpts} placeholder="选择定投周期" />,
        )}
         
        </Form.Item>

        

        <Form.Item wrapperCol={{
          sm: {
            span: 16,
            offset: 8
          }
        }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>

          <Button style={{
            marginLeft: 20
          }} onClick={this.reset} >
            重置
          </Button>
        </Form.Item>

        {/* 投资策略 */}
        <Divider orientation="left">止盈策略 </Divider>
        


      </Form>
    </Card>
  }
}

export const SearchForm = Form.create<FundSearchProp>({ name: 'fund-search' })(InnerSearchForm);
