import React, {Component} from 'react'
import commonStyle from '../index.css'
import {CompareSearchForm} from './search-form'

export default class CompareStragegyChart extends Component {

  render() {
    return <div className={commonStyle.normal}>
      <CompareSearchForm />
    </div>
  }
}