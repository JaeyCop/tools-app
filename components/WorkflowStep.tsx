'use client';

import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react'; // For drag handle icon

interface WorkflowStepProps {
  id: number; // Add this for dnd-kit
  step: {
    id: number;
    type: string;
    options: any; // Current options for this step
  };
  onOptionChange: (stepId: number, newOptions: any) => void;
  // For merge-pdf, we might need access to the overall workflow files
  // files?: File[]; 
}

export const toolDetails: { [key: string]: { name: string; defaultOptions?: any } } = {
  'compress-image': { name: 'Compress Image', defaultOptions: { quality: 0.8 } },
  'resize-image': { name: 'Resize Image', defaultOptions: { width: '', height: '', keepAspect: true, quality: 0.92, format: 'original' } },
  'convert-image': { name: 'Convert Image', defaultOptions: { format: 'image/png', quality: 0.92 } },
  'image-to-pdf': { name: 'Image to PDF', defaultOptions: { pagePreset: 'auto', fitMode: 'contain', marginPoints: 24, labelFilenames: true, autoOrientation: true, outputFormat: 'image/jpeg', jpegQuality: 0.92, includeRange: '' } },
  'compress-pdf': { name: 'Compress PDF', defaultOptions: { quality: 0.8 } },
  'merge-pdf': { name: 'Merge PDFs', defaultOptions: { mode: 'append', optimize: false, pageLabels: false, filesToMerge: [] } },
  'split-pdf': { name: 'Split PDF', defaultOptions: { selectedPages: [] } },
  'pdf-to-images': { name: 'PDF to Images', defaultOptions: { scale: 2, outputFormat: 'image/png', jpegQuality: 0.92, includeRange: '' } },
};

export function WorkflowStep({ id, step, onOptionChange }: WorkflowStepProps) {
  const details = toolDetails[step.type] || { name: 'Unknown Step' };

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  

  const handleOptionChange = (key: string, value: any) => {
    onOptionChange(step.id, { ...step.options, [key]: value });
  };

  const renderStepControls = (type: string) => {
    switch (type) {
      case 'compress-image':
        const quality = step.options.quality !== undefined ? step.options.quality : details.defaultOptions.quality;
        return (
          <div className="mt-2 space-y-2">
            <label htmlFor={`quality-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              id={`quality-${step.id}`}
              min="0.1"
              max="1"
              step="0.01"
              value={quality}
              onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        );
      case 'resize-image':
        return (
          <div className="mt-2 space-y-2">
            <label htmlFor={`width-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Width (px):</label>
            <input
              type="number"
              id={`width-${step.id}`}
              value={step.options.width}
              onChange={(e) => handleOptionChange('width', parseInt(e.target.value) || '')}
              placeholder="Auto"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <label htmlFor={`height-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (px):</label>
            <input
              type="number"
              id={`height-${step.id}`}
              value={step.options.height}
              onChange={(e) => handleOptionChange('height', parseInt(e.target.value) || '')}
              placeholder="Auto"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id={`keepAspect-${step.id}`}
                checked={step.options.keepAspect}
                onChange={(e) => handleOptionChange('keepAspect', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`keepAspect-${step.id}`} className="text-sm text-gray-700 dark:text-gray-300">Keep Aspect Ratio</label>
            </div>
            <label htmlFor={`resizeQuality-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quality: {Math.round(step.options.quality * 100)}%
            </label>
            <input
              type="range"
              id={`resizeQuality-${step.id}`}
              min="0.1"
              max="1"
              step="0.01"
              value={step.options.quality}
              onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <label htmlFor={`resizeFormat-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output Format:</label>
            <select
              id={`resizeFormat-${step.id}`}
              value={step.options.format}
              onChange={(e) => handleOptionChange('format', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="original">Keep Original</option>
              <option value="image/webp">WebP</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
            </select>
          </div>
        );
      case 'convert-image':
        return (
          <div className="mt-2 space-y-2">
            <label htmlFor={`convertFormat-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output Format:</label>
            <select
              id={`convertFormat-${step.id}`}
              value={step.options.format}
              onChange={(e) => handleOptionChange('format', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </select>
            <label htmlFor={`convertQuality-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quality: {Math.round(step.options.quality * 100)}%
            </label>
            <input
              type="range"
              id={`convertQuality-${step.id}`}
              min="0.1"
              max="1"
              step="0.01"
              value={step.options.quality}
              onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        );
      case 'compress-pdf':
        const pdfQuality = step.options.quality !== undefined ? step.options.quality : details.defaultOptions.quality;
        return (
          <div className="mt-2 space-y-2">
            <label htmlFor={`pdfQuality-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quality: {Math.round(pdfQuality * 100)}%
            </label>
            <input
              type="range"
              id={`pdfQuality-${step.id}`}
              min="0.1"
              max="1"
              step="0.01"
              value={pdfQuality}
              onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Note: PDF compression quality is an approximation and may not directly map to image quality within the PDF.</p>
          </div>
        );
      case 'merge-pdf':
        return (
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Select files to merge from the input list.</p>
            {/* This will eventually be a multi-select dropdown populated by the workflow's input files */}
            <label htmlFor={`mergeMode-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Merge Mode:</label>
            <select
              id={`mergeMode-${step.id}`}
              value={step.options.mode}
              onChange={(e) => handleOptionChange('mode', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="append">Append</option>
              <option value="interleave">Interleave</option>
            </select>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id={`mergeOptimize-${step.id}`}
                checked={step.options.optimize}
                onChange={(e) => handleOptionChange('optimize', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`mergeOptimize-${step.id}`} className="text-sm text-gray-700 dark:text-gray-300">Optimize Output</label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id={`mergePageLabels-${step.id}`}
                checked={step.options.pageLabels}
                onChange={(e) => handleOptionChange('pageLabels', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`mergePageLabels-${step.id}`} className="text-sm text-gray-700 dark:text-gray-300">Add Page Labels</label>
            </div>
          </div>
        );
      case 'split-pdf':
        return (
          <div className="mt-2 space-y-2">
            <label htmlFor={`pageRange-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pages to Extract (e.g., 1-3,5,8-10):</label>
            <input
              type="text"
              id={`pageRange-${step.id}`}
              value={step.options.includeRange}
              onChange={(e) => handleOptionChange('includeRange', e.target.value)}
              placeholder="e.g. 1-3,5,8-10"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        );
      case 'pdf-to-images':
        return (
          <div className="mt-2 space-y-2">
            <label htmlFor={`scale-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Resolution Scale: x{step.options.scale}
            </label>
            <input
              type="range"
              id={`scale-${step.id}`}
              min="1"
              max="4"
              step="0.01"
              value={step.options.scale}
              onChange={(e) => handleOptionChange('scale', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <label htmlFor={`outputFormat-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output Format:</label>
            <select
              id={`outputFormat-${step.id}`}
              value={step.options.outputFormat}
              onChange={(e) => handleOptionChange('outputFormat', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
            </select>
            {step.options.outputFormat === 'image/jpeg' && (
              <>
                <label htmlFor={`jpegQuality-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  JPEG Quality: {Math.round(step.options.jpegQuality * 100)}%
                </label>
                <input
                  type="range"
                  id={`jpegQuality-${step.id}`}
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={step.options.jpegQuality}
                  onChange={(e) => handleOptionChange('jpegQuality', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </>
            )}
            <label htmlFor={`includeRange-${step.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pages to Convert (e.g., 1-5,7):</label>
            <input
              type="text"
              id={`includeRange-${step.id}`}
              value={step.options.includeRange}
              onChange={(e) => handleOptionChange('includeRange', e.target.value)}
              placeholder="e.g. 1-5,7"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        );
      default:
        return <p className="text-sm text-gray-500 mt-2">Configuration for this step is not yet available.</p>;
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <p className="font-medium text-gray-900 dark:text-white">{details.name}</p>
      {renderStepControls(step.type)}
    </div>
  );
}
