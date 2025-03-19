import React from 'react';
import styles from '../styles/Filter.module.css';

const Filter = ({ options, selected, onChange }) => {
  return (
    <div className={styles.filterContainer}>
      <label htmlFor="filter">Filter by Category:</label>
      <select id="filter" value={selected} onChange={onChange} className={styles.filterSelect}>
        <option value="">All Categories</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
