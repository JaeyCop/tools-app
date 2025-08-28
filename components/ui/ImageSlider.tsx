"use client";

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import './ImageSlider.css';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={imageContainerRef}
      className="image-slider-container"
      style={{ cursor: 'e-resize', position: 'relative' }}
    >
      <Image
        src={afterImage}
        alt="After"
        className="image-slider-image"
        fill
        style={{ objectFit: 'contain' }}
      />
      <div
        className="image-slider-before"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt="Before"
          className="image-slider-image"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div
        className="image-slider-handle"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchMove={handleTouchMove}
      >
        <div className="image-slider-handle-bar" />
      </div>
    </div>
  );
};

export default ImageSlider;
