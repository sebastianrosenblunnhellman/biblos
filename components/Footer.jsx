import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      &copy; {new Date().getFullYear()} Biblos By Psi Colab. All rights reserved.
    </footer>
  );
};

export default Footer;
