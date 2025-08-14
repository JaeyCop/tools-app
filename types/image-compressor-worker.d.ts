// Type definitions for image compression worker

declare module '/image-compressor.worker.js' {
  interface WorkerMessageData {
    imageData: string;
    originalType: string;
    quality: number;
    maxWidth: string | number;
    maxHeight: string | number;
    format: 'auto' | 'webp' | 'jpeg' | 'png';
  }

  interface WorkerSuccessResponse {
    status: 'success';
    payload: {
      blob: Blob;
      sizeKB: number;
      format: string;
      dimensions: {
        width: number;
        height: number;
      };
    };
  }

  interface WorkerErrorResponse {
    status: 'error';
    payload: string;
  }

  type WorkerResponse = WorkerSuccessResponse | WorkerErrorResponse;

  class ImageCompressionWorker extends Worker {
    constructor();
    postMessage(data: WorkerMessageData): void;
    onmessage: ((this: Worker, ev: MessageEvent<WorkerResponse>) => any) | null;
  }

  const worker: {
    new (): ImageCompressionWorker;
  };

  export default worker;
}