'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Icons from '@/assets/icons';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { Attachment, EntityId } from '@/config/interface';

/* ─── Shared upload config (dùng chung cho comment & ticket) ─── */

export const ATTACHMENT_ACCEPT =
  'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip';

export const ATTACHMENT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-zip-compressed',
];

export const ATTACHMENT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ATTACHMENT_MAX_FILES = 10;

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Xây `errorMessages` cho `useFileUpload` từ i18n. Tách ra để mọi màn
 * (comment / ticket) đều dùng chung một bộ message.
 */
export const buildUploadErrorMessages = (
  t: (key: string) => string
): {
  invalidType: string;
  fileTooLarge: string;
  maxFilesExceeded: string;
} => ({
  invalidType: t('attachments.invalidType'),
  fileTooLarge: t('attachments.fileTooLarge'),
  maxFilesExceeded: t('attachments.maxFilesExceeded'),
});

/* ─── Component ─── */

export interface AttachmentUploaderProps {
  /** File mới đang chọn (từ `useFileUpload().files`) */
  files: File[];
  /** Preview URL tương ứng (từ `useFileUpload().previews`) */
  previews: string[];
  error?: string | null;
  isProcessing?: boolean;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  className?: string;
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  files,
  previews,
  error,
  isProcessing = false,
  maxFiles = ATTACHMENT_MAX_FILES,
  accept = ATTACHMENT_ACCEPT,
  disabled = false,
  onFileChange,
  onRemove,
  className = '',
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={className}>
      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={onFileChange}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-theme-neutral-5 text-theme-neutral-9 gap-1.5"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isProcessing || files.length >= maxFiles}
      >
        <Image
          src={Icons.Paperclip}
          alt=""
          width={14}
          height={14}
          className="w-3.5 h-3.5"
        />
        {t('attachments.attach')}
      </Button>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {files.map((file, index) => {
            const preview = previews[index];
            return (
              <div
                key={`${file.name}-${index}`}
                className="relative flex items-center gap-2 border border-theme-neutral-5 rounded-md p-1.5 pr-7 bg-theme-neutral-2/40 max-w-[220px]"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt={file.name}
                    className="w-9 h-9 rounded object-cover shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded bg-theme-neutral-4/60 flex items-center justify-center shrink-0">
                    <Image
                      src={Icons.Paperclip}
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-theme-neutral-11 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-theme-neutral-7">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute top-1 right-1 text-theme-neutral-6 hover:text-red-500 cursor-pointer"
                  aria-label={t('common.delete')}
                >
                  <Image
                    src={Icons.X}
                    alt=""
                    width={12}
                    height={12}
                    className="w-3 h-3"
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Existing attachments (khi sửa comment / ticket) ─── */

export interface ExistingAttachmentsListProps {
  /** Danh sách attachment gốc (chưa lọc) */
  attachments: Attachment[];
  /** ID đã đánh dấu gỡ — item tương ứng sẽ bị ẩn khỏi danh sách */
  removedIds: EntityId[];
  onToggleRemove: (id: EntityId) => void;
  className?: string;
}

export const ExistingAttachmentsList: React.FC<
  ExistingAttachmentsListProps
> = ({ attachments, removedIds, onToggleRemove, className = '' }) => {
  const { t } = useTranslation();
  const kept = attachments.filter(att => !removedIds.includes(att.id));

  if (kept.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {kept.map(att => (
        <div
          key={att.id}
          className="relative flex items-center gap-2 border border-theme-neutral-5 rounded-md p-1.5 pr-7 bg-theme-neutral-2/40 max-w-[220px]"
        >
          {att.mimeType?.startsWith('image/') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={att.fileUrl}
              alt={att.fileName}
              className="w-9 h-9 rounded object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded bg-theme-neutral-4/60 flex items-center justify-center shrink-0">
              <Image
                src={Icons.Paperclip}
                alt=""
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </div>
          )}
          <p className="text-xs font-medium text-theme-neutral-11 truncate min-w-0">
            {att.fileName}
          </p>
          <button
            type="button"
            onClick={() => onToggleRemove(att.id)}
            className="absolute top-1 right-1 text-theme-neutral-6 hover:text-red-500 cursor-pointer"
            aria-label={t('common.delete')}
          >
            <Image
              src={Icons.X}
              alt=""
              width={12}
              height={12}
              className="w-3 h-3"
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentUploader;
