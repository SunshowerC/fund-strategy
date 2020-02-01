import React, { Component, Fragment } from 'react';
import { FundFormObj } from './search-form';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Divider, InputNumber, Switch, Select, Row, Col } from 'antd';
const { Option } = Select
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
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const fieldsVal = getFieldsValue()
    // 最大止盈卖出
    const maxSell = fieldsVal.sellUnit === 'fundPercent' ? 100 : undefined

    return <Fragment>
      {/* 投资策略 */}
      <Divider orientation="left">止盈策略 </Divider>

      <Form.Item {...formItemLayout} label='上证指数大于'>
        {getFieldDecorator<FundFormObj>('shCompositeIndex', {
          initialValue: 3000,
        })(
          <InputNumber style={{ width: '100%' }} min={0} placeholder="大于上证指数的点，则开始进行止盈" />
        )}
      </Form.Item>

      <Form.Item {...formItemLayout} label='持有仓位大于'>
        {getFieldDecorator<FundFormObj>('fundPosition', {
          initialValue: 70,
        })(
          <InputNumber style={{ width: '100%' }}
            formatter={value => `${value}%`}
            parser={value => value ? value.replace('%', '') : ''}
            min={1} max={100} placeholder="持仓大于多少时开始止盈" />
        )}
      </Form.Item>

      <Form.Item {...formItemLayout} label='是否收益新高'>
        {getFieldDecorator<FundFormObj>('sellAtTop', {
          initialValue: true,
          valuePropName: 'checked'
        })(
          <Switch checkedChildren="是" unCheckedChildren="否" />
        )}
      </Form.Item>

      <Form.Item {...formItemLayout} label='卖出金额'>
        <Row>
          <Col span={12}>
            {getFieldDecorator<FundFormObj>('sellNum', {
              initialValue: 10,
            })(
              <InputNumber style={{width: '100%'}} min={0} max={maxSell} placeholder="止盈时卖出多少" />
            )}
          </Col>
          <Col span={12}>
            {getFieldDecorator<FundFormObj>('sellUnit', {
              initialValue: 'fundPercent',
            })(
              <Select >
                <Option value="amount">元</Option>
                <Option value="fundPercent">% 持有份额</Option>
              </Select>
            )}
          </Col>
        </Row>
      </Form.Item>
    </Fragment>
  }
}