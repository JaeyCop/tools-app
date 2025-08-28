'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { UploadCloud, XCircle, CheckCircle } from 'lucide-react';
import styles from './FileDropzone.module.css';

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Accept;
  maxSize?: number;
}

const dropzoneVariants: Variants = {
  initial: {
    scale: 1,
    backgroundColor: 'hsl(var(--surface))',
  },
  hover: {
    scale: 1.02,
    backgroundColor: 'hsl(var(--surface-hover))',
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
  active: {
    scale: 1.05,
    backgroundColor: 'hsl(var(--primary) / 0.05)',
  },
};

const iconVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, rotate: -5 },
    active: { scale: 1.3, rotate: 10 },
};

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onDrop, accept, maxSize }) => {
  const onDropCallback = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      console.warn('Some files were rejected:', fileRejections);
      // Here you could trigger a toast notification for rejected files
    }
    if (acceptedFiles.length > 0) {
      onDrop(acceptedFiles);
    }
  }, [onDrop]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: onDropCallback,
    accept,
    maxSize,
  });

  const getBorderClassName = () => {
    if (isDragAccept) return styles.accept;
    if (isDragReject) return styles.reject;
    return ''; // No special class for default or active hover, handled by motion
  };

  const animationState = isDragActive ? "active" : "initial";

  return (
    <motion.div
      {...getRootProps({ className: `${styles.dropzone} ${getBorderClassName()}` })}
      variants={dropzoneVariants}
      initial="initial"
      whileHover="hover"
      animate={animationState}
    >
      <input {...getInputProps()} />
      <motion.div className={styles.content} variants={iconVariants}>
        {isDragReject ? (
          <XCircle className={`${styles.icon} ${styles.rejectIcon}`} />
        ) : isDragAccept ? (
          <CheckCircle className={`${styles.icon} ${styles.acceptIcon}`} />
        ) : (
          <UploadCloud className={`${styles.icon} ${styles.defaultIcon}`} />
        )}
        {isDragActive ? (
          <p>{isDragReject ? 'Unsupported file type' : 'Drop files here to upload'}</p>
        ) : (
          <p>Drag & drop files here, or <span className={styles.browseLink}>browse</span></p>
        )}
        <p className={styles.subtext}>
          Your files are processed locally and never leave your browser.
        </p>
      </motion.div>
    </motion.div>
  );
};