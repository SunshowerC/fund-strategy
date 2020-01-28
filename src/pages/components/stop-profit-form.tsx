import React, { Component, Fragment } from 'react';
import { FundFormObj } from './search-form';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Divider, InputNumber, Switch } from 'antd';

interface StopProfitFormProp {
  // form: 
}

export class StopProfitForm extends Component<FormComponentProps<FundFormObj>>{


  render() {
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
    const { getFieldDecorator } = this.props.form;

    return <Fragment>
      {/* 投资策略 */}
      <Divider orientation="left">止盈策略 </Divider>

      <Form.Item {...formItemLayout} label='上证指数'>
        {getFieldDecorator<FundFormObj>('shCompositeIndex', {
          initialValue: 3000,
        })(
          <InputNumber style={{width: '100%'}} min={0} placeholder="大于上证指数的点，则开始进行止盈"  />
        )}
      </Form.Item>

      <Form.Item {...formItemLayout} label='持有仓位'>
      {getFieldDecorator<FundFormObj>('fundPosition', {
          initialValue: 70,
        })(
          <InputNumber style={{width: '100%'}} 
          formatter={value => `${value}%`}
          parser={value => value ? value.replace('%', '') : ''}
          min={1} max={100} placeholder="持仓大于多少时开始止盈"  />
        )}
      </Form.Item>

      <Form.Item {...formItemLayout} label='是否历史最高点止盈'>
      {getFieldDecorator<FundFormObj>('sellAtTop', {
          initialValue: true,
          valuePropName: 'checked' 
        })(
          <Switch checkedChildren="是" unCheckedChildren="否"  />
        )}
      </Form.Item>

    </Fragment>
  }
}