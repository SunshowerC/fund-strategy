

import React, { Component, Fragment } from 'react';

import {Button, Popover, Tag, Modal, Input} from 'antd';
import { FundFormObj } from './search-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';

interface SavedSearchProp {
  /**
   * 点击保存当前搜索选项
   */
  onSave?: (val)=>void 
  /**
   * 选中已保存了的选项
   */
  onSelected: (name: string, value: FundFormObj)=>void

  form: WrappedFormUtils<FundFormObj>
}
/**
 * 保存在 localstorage 的数据结构
 */
export type StorageSearch = Record<string, FundFormObj>

const tagColors = ["magenta","red","volcano","orange","gold","lime","green","cyan","blue","geekblue","purple"]

const SAVED_FORM_KEY = 'saved-fund-form'
let allSavedConditionStr = localStorage.getItem(SAVED_FORM_KEY) || '{}'
export const allSavedCondition = JSON.parse(allSavedConditionStr) as StorageSearch

export class SavedSearchCondition extends Component<SavedSearchProp, SavedSearchCondition["state"]> {

  state = {
    allSavedCondition,
    selectedName: ''
  }

  private deleteCondition(e: Event, tagName: string) {
    e.preventDefault()
    e.stopPropagation()
    console.log('tag name', tagName)
    delete this.state.allSavedCondition[tagName]
    
    this.saveStorage()
  }

  /**
   * 保存到 localstorage， 并更新视图
   */
  private saveStorage() {
    localStorage.setItem(SAVED_FORM_KEY, JSON.stringify(this.state.allSavedCondition))

    this.setState({
      allSavedCondition: this.state.allSavedCondition
    })
  }
  
  private saveSearchForm = () => {
    const selectedName = this.state.selectedName
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let conditionName = selectedName
        Modal.confirm({
          title: '请给当前搜索条件命名',
          content: <Input defaultValue={selectedName} placeholder="如名称重复，将会覆盖原有搜索条件" onChange={(e => {conditionName = e.target.value})} />,
          onOk: ()=> {
            this.setState({
              selectedName: conditionName
            })
            this.state.allSavedCondition[conditionName] = values
            this.saveStorage()
            this.props.onSave && this.props.onSave(values)
          }
        })
      }
    });    

  }

  /**
   * 处理 tag 选择
   * @param name 选择的tag 名
   * @param value 该 tag 名对应的 搜索条件
   */
  private handleSelectedTag(name: string, value:any) {
    this.setState({
      selectedName: name
    })
    this.props.onSelected(name, value)
  }

  /**
   * 以保存的列表内容
   */
  private content() {
    
    const allSavedCondition: StorageSearch = this.state.allSavedCondition
    return <div style={{width: 500}}>
      {
        Object.keys(allSavedCondition).map((name,index) => {
          return <Tag closable key={index} style={{
            marginBottom: 10
          }} color={tagColors[index%tagColors.length]} 
            onClose={(e)=>this.deleteCondition(e, name)}
            onClick={()=>this.handleSelectedTag(name, allSavedCondition[name])}
          >{name}</Tag>
        })
      }
      
    </div>
  }

  render() {
    return <Fragment>
      <Button type="default" onClick={this.saveSearchForm} style={{marginRight: 10}}>保存</Button>

      <Popover placement="bottomRight" content={this.content()} title="已保存的基金策略" trigger="hover">
        <Button type="primary">我的保存项</Button>
      </Popover>
    </Fragment>
  }
}