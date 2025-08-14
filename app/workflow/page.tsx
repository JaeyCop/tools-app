'use client';

import { FileDropzone } from '@/components/FileDropzone';
import { WorkflowBuilder } from '@/components/WorkflowBuilder';
import { useState } from 'react';
import { runWorkflow, WorkflowStepState } from '@/lib/workflow-runner';
import { Download } from 'lucide-react';

export default function WorkflowPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [steps, setSteps] = useState<WorkflowStepState[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFiles, setOutputFiles] = useState<Blob[]>([]);

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  };

  const handleRunWorkflow = async () => {
    if (files.length === 0 || steps.length === 0) {
      alert('Please add files and at least one workflow step.');
      return;
    }

    setIsProcessing(true);
    setOutputFiles([]);
    try {
      const results = await runWorkflow(files, steps);
      setOutputFiles(results);
    } catch (error) {
      console.error('Workflow execution failed:', error);
      alert('Workflow execution failed. Check console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Workflow Pipeline</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Chain multiple tools together to create powerful, automated workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: File Input & List */}
        <div className="md:col-span-1 space-y-6">
          <h2 className="text-xl font-semibold">1. Add Files</h2>
          <FileDropzone onDrop={handleDrop} />
          <div className="space-y-2">
            <h3 className="font-medium">Your Files:</h3>
            {files.length > 0 ? (
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No files added yet.</p>
            )}
          </div>
        </div>

        {/* Right column: Workflow Builder */}
        <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">2. Build Your Workflow</h2>
            <WorkflowBuilder steps={steps} setSteps={setSteps} />

            <button
              type="button"
              onClick={handleRunWorkflow}
              disabled={isProcessing || files.length === 0 || steps.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Run Workflow'
              )}
            </button>

            {outputFiles.length > 0 && (
              <div className="space-y-4 mt-8">
                <h2 className="text-xl font-semibold">3. Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {outputFiles.map((blob, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center space-y-2">
                      <p className="text-sm font-medium">Output File {index + 1}</p>
                      <p className="text-xs text-gray-500">{(blob.size / 1024).toFixed(2)} KB</p>
                      <a
                        href={URL.createObjectURL(blob)}
                        download={`workflow_output_${index + 1}.${blob.type.split('/')[1] || 'bin'}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

    </div>
  );
}

