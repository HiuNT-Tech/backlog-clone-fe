'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { useFileUpload } from '@/hooks/use-file-upload';

/* ─── Shared config (dùng chung cho mọi nơi cần upload 1 ảnh) ─── */

export const IMAGE_UPLOAD_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

export const IMAGE_UPLOAD_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const IMAGE_UPLOAD_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/* ─── Component ─── */

export interface ImageUploadProps {
  /** URL ảnh hiện tại đã lưu (không phải preview file đang chọn) */
  value?: string | null;
  /** Upload file lên server, trả về URL ảnh đã lưu */
  onUpload: (file: File) => Promise<string>;
  /** Gọi lại sau khi upload thành công với URL mới */
  onUploaded?: (url: string) => void;
  shape?: 'circle' | 'square';
  size?: number;
  disabled?: boolean;
  alt?: string;
  /** Hiển thị khi chưa có ảnh nào (vd chữ cái đầu tên) */
  fallback?: React.ReactNode;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onUpload,
  onUploaded,
  shape = 'circle',
  size = 64,
  disabled = false,
  alt = '',
  fallback,
  className = '',
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { files, previews, error, handleFileChange, clearFiles } =
    useFileUpload({
      allowedTypes: IMAGE_UPLOAD_ALLOWED_TYPES,
      maxFileSize: IMAGE_UPLOAD_MAX_FILE_SIZE,
      maxFiles: 1,
      errorMessages: {
        invalidType: t('imageUpload.invalidType'),
        fileTooLarge: t('imageUpload.fileTooLarge'),
      },
    });

  const onUploadRef = useRef(onUpload);
  onUploadRef.current = onUpload;
  const onUploadedRef = useRef(onUploaded);
  onUploadedRef.current = onUploaded;

  const pickedFile = files[0];
  // Chặn upload trùng: StrictMode chạy effect 2 lần trong dev, và mỗi lần
  // render `files` là mảng mới nên không thể chỉ dựa vào dependency.
  const uploadedFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (!pickedFile || uploadedFileRef.current === pickedFile) return;
    uploadedFileRef.current = pickedFile;

    setIsUploading(true);

    onUploadRef
      .current(pickedFile)
      .then(url => onUploadedRef.current?.(url))
      .catch(() => {
        // Lỗi đã được toast bởi axios interceptor dùng chung.
      })
      .finally(() => {
        setIsUploading(false);
        clearFiles();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedFile]);

  const displaySrc = previews[0] || value || undefined;

  return (
    <div className={className}>
      <div
        className={cn(
          'group relative inline-flex items-center justify-center overflow-hidden bg-theme-neutral-3 text-theme-neutral-8',
          shape === 'circle' ? 'rounded-full' : 'rounded-md'
        )}
        style={{ width: size, height: size }}
      >
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displaySrc}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          fallback
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
          className="absolute inset-0 flex items-center justify-center bg-black/0 text-[11px] font-medium text-transparent transition-colors group-hover:bg-black/40 group-hover:text-white disabled:cursor-not-allowed cursor-pointer"
        >
          {isUploading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            t('common.change')
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_UPLOAD_ACCEPT}
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
