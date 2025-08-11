import React from 'react';
import styles from './ProcessingButton.module.css';

interface ProcessingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isProcessing: boolean;
  children: React.ReactNode;
}

export const ProcessingButton: React.FC<ProcessingButtonProps> = ({
  isProcessing,
  children,
  ...props
}) => {
  return (
    <button className={styles.button} disabled={isProcessing} {...props}>
      {isProcessing ? (
        <div className={styles.spinner} />
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
};