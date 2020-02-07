/**
 * 补仓策略表单
 */
import React, { Component, Fragment } from 'react';
import { FundFormObj } from './search-form';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Divider, InputNumber, Switch, Select, Row, Col } from 'antd';
import { IndexData, searchIndex, SearchIndexResp } from '@/utils/fund-stragegy/fetch-fund-data';
import {throttle} from 'lodash'
const {Option} = Select

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

export class BuyStragegyForm extends Component<FormComponentProps<FundFormObj>> {
  state = {
    searchIndexData:  [] as SearchIndexResp[] 
  }
  
  
  handleSearchIndex = throttle(async (value)=>{
    
    if (value) {
      const result = await searchIndex(value)
      this.setState({ searchIndexData: result });
    } else {
      this.setState({ searchIndexData: [] });
    }
  }, 1000)

  render() {
    const { searchIndexData } = this.state
    
    const { getFieldDecorator, getFieldsValue } = this.props.form;

    return <section>
      <Divider orientation="left">补仓策略 </Divider>
      <Form.Item {...formItemLayout} label="参考指数">
          {getFieldDecorator<FundFormObj>('referIndex')(
            <Select
              showSearch
              placeholder="输入指数名称或编号"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearchIndex}
              // onChange={this.handleChange}
              notFoundContent={null}
            >
              {searchIndexData.map((d, index) => <Option key={d.id}>{d.name}[{d.code}]</Option>)}
            </Select>
          )}
        </Form.Item>
        
        <Form.Item {...formItemLayout} label="指数 MACD 临界点">
        {getFieldDecorator<FundFormObj>('buyMacdPoint', {
          initialValue: 100
        })(
          <InputNumber style={{width: '100%'}} formatter={value => `${value}%`}
          parser={value => (value || '').replace('%', '')}  min={0} max={100} placeholder="macd 补仓点" />
        )
        }
        </Form.Item>
    </section>
  }
}



