import React from 'react';
import styles from './FooterPanel.module.css';
import { Link } from 'react-router-dom';

const FooterPanel = () => (
  <div className={styles.container}>
    <div className={styles.links}>
      <Link to="/">TOP</Link>
      <p>|</p>
      <Link to="/tos">利用規約</Link>
      <p>|</p>
      <Link to="/privacy-policy">プライバシー</Link>
    </div>
  </div>
);

export default FooterPanel;
