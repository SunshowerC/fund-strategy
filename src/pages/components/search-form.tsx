import React, { Component } from 'react';
import { Form, DatePicker, TimePicker, Button, Input, Card } from 'antd';
import { WrappedFormUtils, FormComponentProps, GetFieldDecoratorOptions } from 'antd/lib/form/Form';

const { MonthPicker, RangePicker } = DatePicker;


export interface FundFormObj {
  fundId: string 
  dateRange: [any, any]
}

export interface FundSearchProp extends FormComponentProps<FundFormObj> {
  onSearch: (form: FundFormObj)=>any
}


export class InnerSearchForm extends Component<FundSearchProp> {

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
        })(<Input />)}
      </Form.Item>

      <Form.Item label="时间范围">
        {getFieldDecorator('dateRange', rangeConfig)(<RangePicker disabledDate={this.disabledDate} />)}
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
