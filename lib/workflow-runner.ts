'use client';

import { compressImage, CompressionOptions, compressPdf, convertImage, ConvertOptions, mergePdfs, PdfCompressionOptions, PdfMergeOptions, PdfSplitOptions, pdfToImages, PdfToImagesOptions, resizeImage, ResizeOptions, splitPdf } from './tool-functions';

export interface WorkflowStepState {
    id: number;
    type: string;
    options: any; // This will be more specific later
}

async function processFile(file: File, steps: WorkflowStepState[]) {
    let currentFile: File | Blob = file;

    for (const step of steps) {
        const currentName = currentFile instanceof File ? currentFile.name : 'blob';
        console.log(`Processing step: ${step.type} for file: ${currentName}`);

        switch (step.type) {
            case 'compress-image':
                // Assuming the file is an image
                currentFile = await compressImage(currentFile as File, step.options as CompressionOptions);
                break;
            case 'resize-image':
                currentFile = await resizeImage(currentFile as File, step.options as ResizeOptions);
                break;
            case 'convert-image':
                currentFile = await convertImage(currentFile as File, step.options as ConvertOptions);
                break;
            case 'compress-pdf':
                currentFile = await compressPdf(currentFile as File, step.options as PdfCompressionOptions);
                break;
            case 'merge-pdf':
                // This step is special: it operates on a list of files provided in its options
                // and produces a single output file. Subsequent steps will operate on this merged file.
                currentFile = await mergePdfs(step.options.filesToMerge as File[], step.options as PdfMergeOptions);
                break;
            case 'split-pdf':
                currentFile = await splitPdf(currentFile as File, step.options as PdfSplitOptions);
                break;
            case 'pdf-to-images':
                currentFile = await pdfToImages(currentFile as File, step.options as PdfToImagesOptions);
                break;
            default:
                console.warn(`Unknown step type: ${step.type}`);
                break;
        }
    }

    return currentFile;
}

export async function runWorkflow(files: File[], steps: WorkflowStepState[]): Promise<Blob[]> {
    console.log('Starting workflow...', { files, steps });

    const outputFiles: Blob[] = [];

    for (const file of files) {
        const outputFile = await processFile(file, steps);
        outputFiles.push(outputFile);
    }

    console.log('Workflow finished!', { outputFiles });
    return outputFiles;
}
