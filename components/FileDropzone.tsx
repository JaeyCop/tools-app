'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';
import { UploadCloud, XCircle, CheckCircle } from 'lucide-react';
import styles from './FileDropzone.module.css';

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Accept;
  maxSize?: number;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onDrop, accept, maxSize }) => {
  const onDropCallback = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    // You can handle rejections here, e.g., show a toast notification
    if (fileRejections.length > 0) {
      console.warn('Some files were rejected:', fileRejections);
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
    if (isDragActive) return styles.active;
    return '';
  };

  return (
    <div {...getRootProps({ className: `${styles.dropzone} ${getBorderClassName()}` })}>
      <input {...getInputProps()} />
      <div className={styles.content}>
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
      </div>
    </div>
  );
};