'use client';

import React, { useMemo } from 'react';
import { format } from 'jsondiffpatch/formatters/html';
import type { Delta } from 'jsondiffpatch';
import './system-comment-diff.css';

export interface SystemCommentDiffProps {
  /** Delta JSON của jsondiffpatch, được BE lưu trong comment.content. */
  content: string;
  className?: string;
}

/**
 * Render nội dung comment hệ thống (type = SYSTEM) — thay đổi của ticket
 * dưới dạng diff trước/sau. Chỉ parse + format delta đã được BE tính sẵn,
 * không tính lại diff ở FE.
 *
 * An toàn với dangerouslySetInnerHTML: html formatter của jsondiffpatch
 * tự escape mọi giá trị (& < > ' ") trước khi chèn vào chuỗi HTML.
 */
export const SystemCommentDiff: React.FC<SystemCommentDiffProps> = ({
  content,
  className,
}) => {
  const html = useMemo(() => {
    try {
      const delta = JSON.parse(content) as Delta;
      return format(delta) ?? '';
    } catch {
      // Content không phải delta hợp lệ -> không render thay vì crash list.
      return '';
    }
  }, [content]);

  if (!html) return null;

  return (
    <div
      className={`system-comment-diff text-sm ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
