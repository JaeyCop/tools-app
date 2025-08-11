import React from 'react';
import styles from './ToolLayout.module.css';

interface ToolLayoutProps {
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ sidebar, mainContent }) => {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <main className={styles.mainContent}>{mainContent}</main>
    </div>
  );
};