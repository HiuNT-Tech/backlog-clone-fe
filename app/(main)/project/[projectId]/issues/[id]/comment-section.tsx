import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Paperclip, Pencil, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { format } from '@/constant/format';
import type { Card } from '@/config/interface';

export const CommentList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-theme-neutral-11">
          {t('issueDetail.comments.title')}{' '}
          <span className="text-theme-neutral-7 font-normal">(0)</span>
        </h2>
        <div className="flex items-center gap-2 text-sm text-theme-neutral-8">
          <span>View:</span>
          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
            Show all
          </span>
          <span className="cursor-pointer hover:text-theme-neutral-11">
            Show only comments
          </span>
        </div>
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-lg border border-theme-neutral-5/60 p-6 text-center text-sm text-theme-neutral-7">
        {t('issueDetail.comments.comingSoon')}
      </div>
    </div>
  );
};

export interface StickyCommentBarProps {
  card: Card;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  commentValue: string;
  setCommentValue: (v: string) => void;
  isPreviewComment: boolean;
  setIsPreviewComment: (v: boolean) => void;
  STATUS_OPTIONS: any[];
  USER_OPTIONS: any[];
  VERSION_OPTIONS: any[];
  handleFieldUpdate: (field: string, value: any) => void;
}

export const StickyCommentBar: React.FC<StickyCommentBarProps> = ({
  card,
  isEditing,
  setIsEditing,
  commentValue,
  setCommentValue,
  isPreviewComment,
  setIsPreviewComment,
  STATUS_OPTIONS,
  USER_OPTIONS,
  VERSION_OPTIONS,
  handleFieldUpdate,
}) => {
  const { t } = useTranslation();

  return (
    <div className="sticky bottom-0 bg-white border-t border-theme-neutral-4/60 z-30">
      {/* Collapsed bar */}
      {!isEditing && (
        <div className="px-6 py-3 flex items-center gap-3">
          <Paperclip className="w-4 h-4 text-theme-neutral-7 shrink-0" />
          <div
            className="flex-1 border border-theme-neutral-5 rounded-md px-3 py-2 text-sm text-theme-neutral-7 cursor-text hover:border-theme-main transition-colors"
            onClick={() => setIsEditing(true)}
          >
            {t('issueDetail.comments.placeholder')}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-theme-neutral-5 text-theme-neutral-9 gap-1.5 shrink-0"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="w-3.5 h-3.5" /> Change Status
          </Button>
        </div>
      )}

      {/* Expanded editor + sidebar */}
      {isEditing && (
        <div className="px-6 py-4">
          <div className="flex gap-4">
            {/* Left: editor */}
            <div className="flex-1 min-w-0">
              {/* Collapse handle */}
              <div className="flex justify-center mb-1">
                <button
                  type="button"
                  className="text-theme-neutral-5 hover:text-theme-neutral-8 cursor-pointer"
                  onClick={() => setIsEditing(false)}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {isPreviewComment ? (
                <div className="prose prose-sm max-w-none text-theme-neutral-11 leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_a]:text-theme-main [&_a]:hover:underline [&_blockquote]:border-l-4 [&_blockquote]:border-theme-neutral-5 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-theme-neutral-8 [&_code]:bg-theme-neutral-3 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-theme-neutral-3 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-2 p-4 border border-theme-neutral-5 rounded-lg min-h-[100px] bg-theme-neutral-2/30 mb-[22px]">
                  {commentValue ? (
                    <ReactMarkdown>{commentValue}</ReactMarkdown>
                  ) : (
                    <span className="text-theme-neutral-7 italic">
                      Nothing to preview
                    </span>
                  )}
                </div>
              ) : (
                <MarkdownEditor
                  value={commentValue}
                  onChange={setCommentValue}
                  placeholder={t('issueDetail.comments.placeholder')}
                  className="[&_.EasyMDEContainer]:border-theme-neutral-5 [&_.EasyMDEContainer]:rounded-lg [&_.CodeMirror]:min-h-[100px] [&_.CodeMirror]:text-sm"
                />
              )}

              {/* Actions row */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-theme-neutral-5 text-theme-neutral-9"
                  onClick={() => {
                    setIsEditing(false);
                    setCommentValue('');
                    setIsPreviewComment(false);
                  }}
                >
                  {t('issueDetail.comments.close')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-theme-neutral-5 text-theme-neutral-9 w-20"
                  onClick={() => setIsPreviewComment(!isPreviewComment)}
                >
                  {isPreviewComment
                    ? t('issueDetail.edit')
                    : t('issueDetail.comments.preview')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-theme-main hover:bg-theme-hover text-theme-neutral-1"
                  disabled={!commentValue.trim()}
                >
                  {t('issueDetail.comments.post')}
                </Button>
              </div>
            </div>

            {/* Right: status sidebar */}
            <div className="w-64 shrink-0 space-y-3 text-sm">
              {/* Status */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-theme-neutral-8">
                    Status
                  </span>
                </div>
                <Select
                  options={STATUS_OPTIONS}
                  value={card.columnId ? String(card.columnId) : ''}
                  onValueChange={v => handleFieldUpdate('columnId', v)}
                  placeholder="—"
                  allowClear={false}
                  className="[&_.ant-select-selector]:h-8! [&_.ant-select-selector]:min-h-[32px]! h-8"
                />
              </div>

              {/* Assignee + Start Date row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-theme-neutral-8">
                      {t('issueDetail.metadata.assignee')}
                    </span>
                    <button
                      type="button"
                      className="text-[10px] text-theme-main hover:underline cursor-pointer"
                      onClick={() => handleFieldUpdate('assigneeUserId', 'me')}
                    >
                      {t('issueDetail.assignToMyself')}
                    </button>
                  </div>
                  <Select
                    showSearch
                    options={USER_OPTIONS}
                    value={
                      card.assigneeUserId ? String(card.assigneeUserId) : ''
                    }
                    onValueChange={v => handleFieldUpdate('assigneeUserId', v)}
                    placeholder="—"
                    className="[&_.ant-select-selector]:h-8! [&_.ant-select-selector]:min-h-[32px]! h-8"
                  />
                </div>
                <DatePicker
                  label={t('issueDetail.metadata.startDate')}
                  value={format.dateInput(card.startDate)}
                  onChange={e => handleFieldUpdate('startDate', e.target.value)}
                  className="[&.ant-picker]:h-8!"
                />
              </div>

              {/* Milestone + Due Date row */}
              <div className="grid grid-cols-2 gap-2">
                <Select
                  label={t('issueDetail.metadata.version')}
                  showSearch
                  options={VERSION_OPTIONS}
                  value={card.versionId ? String(card.versionId) : ''}
                  onValueChange={v => handleFieldUpdate('versionId', v)}
                  placeholder="—"
                  className="[&_.ant-select-selector]:h-8! [&_.ant-select-selector]:min-h-[32px]! h-8"
                />
                <DatePicker
                  label={t('issueDetail.metadata.dueDate')}
                  value={format.dateInput(card.dueDate)}
                  onChange={e => handleFieldUpdate('dueDate', e.target.value)}
                  className="[&.ant-picker]:h-8!"
                />
              </div>

              {/* Estimate/Actual row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-theme-neutral-8 block mb-1">
                    {t('issueDetail.metadata.estimatedHours')}
                  </label>
                  <Input
                    value={card.estimatedHours ?? ''}
                    placeholder="—"
                    className="h-8 text-sm"
                    onBlur={e => {
                      if (e.target.value !== (card.estimatedHours ?? ''))
                        handleFieldUpdate('estimatedHours', e.target.value);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter')
                        (e.target as HTMLInputElement).blur();
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-neutral-8 block mb-1">
                    {t('issueDetail.metadata.actualHours')}
                  </label>
                  <Input
                    value={card.actualHours ?? ''}
                    placeholder="—"
                    className="h-8 text-sm"
                    onBlur={e => {
                      if (e.target.value !== (card.actualHours ?? ''))
                        handleFieldUpdate('actualHours', e.target.value);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter')
                        (e.target as HTMLInputElement).blur();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
