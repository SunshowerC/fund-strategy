import React, { Component } from 'react';
import { Form, DatePicker, TimePicker, Button, Input, Card, Select } from 'antd';
import { WrappedFormUtils, FormComponentProps, GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import moment from 'moment';
import { dateFormat } from '@/utils/common';
import { FundInfo, getFundInfo } from '@/utils/fund-stragegy/fetch-fund-data';

const { MonthPicker, RangePicker } = DatePicker;
const {Option} = Select

export interface FundFormObj {
  fundId: string 
  dateRange: [any, any]
}

export interface FundSearchProp extends FormComponentProps<FundFormObj> {
  onSearch: (form: FundFormObj)=>any
}


export class InnerSearchForm extends Component<FundSearchProp, {
  searchFundData: FundInfo[]
}> {

  state = {
    searchFundData: [] as FundInfo[]
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

  private disabledDate = (date) => {
    const selectDate = new Date(date).getTime()
    const now = Date.now()
    return selectDate > now
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const {searchFundData} = this.state
    let [curYear, curMonth, curDate] = dateFormat(new Date()).split('-').map(Number)
    curMonth = Number(curMonth) - 1

    const formItemLayout = {
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
        {getFieldDecorator('fundId', {
          rules: [{required: true, message: '请输入基金编号'}]
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
        {getFieldDecorator('dateRange', rangeConfig)(
        <RangePicker 
          placeholder={['开始时间','结束时间']}
          ranges={{
            '最近一年': [moment([Number(curYear) - 1, curMonth, curDate]), moment([curYear, curMonth, curDate])],
            '最近两年': [moment([Number(curYear) - 2, curMonth, curDate]), moment([curYear, curMonth, curDate])],
            '最近三年': [moment([Number(curYear) - 3, curMonth, curDate]), moment([curYear, curMonth, curDate])],
            '最近五年': [moment([Number(curYear) - 5, curMonth, curDate]), moment([curYear, curMonth, curDate])],
          }}
          disabledDate={this.disabledDate} />)}
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
      </Form.Item>
    </Form> 
    </Card>
  }
}

export const SearchForm = Form.create<FundSearchProp>({ name: 'fund-search' })(InnerSearchForm);
