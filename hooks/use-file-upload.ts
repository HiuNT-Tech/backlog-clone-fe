'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
  DragEvent,
} from 'react';

// Types
export interface FileUploadErrorMessages {
  invalidType?: string;
  fileTooLarge?: string;
  maxFilesExceeded?: string;
}

export interface FileUploadConfig {
  allowedTypes: string[];
  maxFileSize: number;
  maxFiles: number;
  errorMessages?: FileUploadErrorMessages;
  dragAndDrop?: boolean;
}

export interface FilePreview {
  file: File;
  preview: string;
}

export interface DragDropHandlers {
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>) => void;
  isDragOver: boolean;
}

export interface UseFileUploadReturn {
  files: File[];
  previews: string[];
  error: string | null;
  isProcessing: boolean;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  clearError: () => void;
  dragDropHandlers: DragDropHandlers | null;
}

// Helper: Check if file is an image
const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export function useFileUpload(config: FileUploadConfig): UseFileUploadReturn {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const filePreviewsRef = useRef<FilePreview[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    filePreviewsRef.current = filePreviews;
  }, [filePreviews]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      filePreviewsRef.current.forEach(fp => {
        URL.revokeObjectURL(fp.preview);
      });
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearFiles = useCallback(() => {
    filePreviews.forEach(fp => {
      URL.revokeObjectURL(fp.preview);
    });
    setFilePreviews([]);
  }, [filePreviews]);

  const removeFile = useCallback((index: number) => {
    setFilePreviews(prev => {
      if (index < 0 || index >= prev.length) {
        return prev;
      }

      // Revoke object URL before removing
      const fileToRemove = prev[index];
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Core file processing logic
  const processFiles = useCallback(
    async (newFiles: File[]) => {
      setError(null);

      // Filter valid file types
      const validTypeFiles = newFiles.filter(file =>
        config.allowedTypes.includes(file.type)
      );

      if (validTypeFiles.length < newFiles.length) {
        setError(config.errorMessages?.invalidType || null);
      }

      // Check total file count
      const currentCount = filePreviewsRef.current.length;
      if (currentCount + validTypeFiles.length > config.maxFiles) {
        setError(config.errorMessages?.maxFilesExceeded || null);
        return;
      }

      // Validate file size and process files
      const validFilePreviews: FilePreview[] = [];
      let hasOversizedFile = false;

      setIsProcessing(true);

      try {
        for (const file of validTypeFiles) {
          // Check file size
          if (file.size > config.maxFileSize) {
            hasOversizedFile = true;
            continue;
          }

          // Create preview for image files, keep original file
          const preview = isImageFile(file) ? URL.createObjectURL(file) : '';
          validFilePreviews.push({ file, preview });
        }

        if (hasOversizedFile) {
          setError(config.errorMessages?.fileTooLarge || null);
        }

        if (validFilePreviews.length > 0) {
          setFilePreviews(prev => [...prev, ...validFilePreviews]);
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [config]
  );

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const inputFiles = e.target.files;
      if (!inputFiles || inputFiles.length === 0) return;

      const newFiles = Array.from(inputFiles);
      await processFiles(newFiles);
      e.target.value = '';
    },
    [processFiles]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        const newFiles = Array.from(droppedFiles);
        await processFiles(newFiles);
      }
    },
    [processFiles]
  );

  // Create drag drop handlers object if enabled
  const dragDropHandlers: DragDropHandlers | null = config.dragAndDrop
    ? {
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        isDragOver,
      }
    : null;

  return {
    files: filePreviews.map(fp => fp.file),
    previews: filePreviews.map(fp => fp.preview),
    error,
    isProcessing,
    handleFileChange,
    removeFile,
    clearFiles,
    clearError,
    dragDropHandlers,
  };
}

export default useFileUpload;
