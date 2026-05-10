'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';
import { cn } from '@/lib/utils';

// Dynamic import is required for Next.js App Router to avoid SSR issues with EasyMDE
const SimpleMdeReact = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  classNameContainer?: string;
  required?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder,
  className,
  classNameContainer,
  required,
}: MarkdownEditorProps) {
  const options = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: placeholder,
      status: false, // hide the bottom status bar
      toolbar: [
        'bold',
        'italic',
        'strikethrough',
        '|',
        'heading',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'quote',
        'preview',
      ],
    };
  }, [placeholder]);

  return (
    <div className={cn('space-y-1', classNameContainer)}>
      {label && (
        <label className="text-sm font-medium text-theme-neutral-11">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={cn(
          'relative max-w-full prose-sm',
          { 'mt-1': !!label },
          className
        )}
      >
        <SimpleMdeReact
          value={value}
          onChange={onChange}
          options={options as any}
        />
      </div>
    </div>
  );
}
