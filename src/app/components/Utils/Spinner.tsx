import React from 'react';
import styles from '../Utils/Spinner.module.css';

interface spinnerProps {
    width:number
    height:number;
  }

const Spinner = ({width,height}:spinnerProps) => {
  return (
    <div className={styles.spinner} style={{width:width,height:height}}></div>
  );
};

export default Spinner;