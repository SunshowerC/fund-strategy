import React from 'react';
import styles from './index.css';
import { FundLine } from './components/fund-line'
export default function() {
  return (
    <div className={styles.normal}>
        <FundLine />
    </div>
  );
}
