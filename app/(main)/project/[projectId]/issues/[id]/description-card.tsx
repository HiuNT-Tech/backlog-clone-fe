import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Icons from '@/assets/icons';
import { useTranslation } from 'react-i18next';
import { format } from '@/constant/format';
import { MARKDOWN_PROSE_CLASSNAME } from '@/constant/markdown';
import { renderPriorityValue } from '@/constant/data';
import type { Card, EntityId } from '@/config/interface';
import type { EditFormData, SelectOption } from './edit-form-fields';
import { EditableDescription, EditableMetadata } from './edit-form-fields';

interface MetaRowProps {
  label: string;
  value?: React.ReactNode;
  className?: string;
}

const MetaRow: React.FC<MetaRowProps> = ({ label, value, className }) => (
  <div
    className={`flex items-center justify-between py-2.5 border-b border-theme-neutral-4/40 ${className ?? ''}`}
  >
    <span className="text-sm text-theme-neutral-8">{label}</span>
    <span className="text-sm text-theme-neutral-11">{value ?? '—'}</span>
  </div>
);

export interface DescriptionCardProps {
  card: Card;
  versions: any[];
  issueTypeInfo: any;
  priorityLabel: string | null;
  resolveUser: (user: any, fallbackId?: EntityId) => string;
  /** Edit mode props (optional — when absent, renders read-only) */
  isEditMode?: boolean;
  editFormData?: EditFormData;
  onFieldChange?: (field: keyof EditFormData, value: string) => void;
  statusOptions?: SelectOption[];
  priorityOptions?: SelectOption[];
  issueTypeOptions?: SelectOption[];
  userOptions?: SelectOption[];
  versionOptions?: SelectOption[];
  onAssignToMyself?: () => void;
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({
  card,
  versions,
  issueTypeInfo,
  priorityLabel,
  resolveUser,
  isEditMode = false,
  editFormData,
  onFieldChange,
  statusOptions = [],
  priorityOptions = [],
  issueTypeOptions = [],
  userOptions = [],
  versionOptions = [],
  onAssignToMyself,
}) => {
  const { t } = useTranslation();
  const [metaCollapsed, setMetaCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-theme-neutral-5/60 mb-4">
      {/* Author line */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-theme-main/20 flex items-center justify-center text-theme-main text-xs font-bold">
            {resolveUser(card.assignee, card.assigneeUserId ?? undefined)
              .charAt(0)
              .toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-theme-neutral-11">
              {resolveUser(card.assignee, card.assigneeUserId ?? undefined)}
            </p>
            <p className="text-xs text-theme-neutral-7">
              Created: {format.dateTime(card.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Description body */}
      <div className="px-5 pb-4">
        {isEditMode && editFormData && onFieldChange ? (
          <EditableDescription
            value={editFormData.description}
            onChange={v => onFieldChange('description', v)}
          />
        ) : card.description ? (
          <div className={MARKDOWN_PROSE_CLASSNAME}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {card.description}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-theme-neutral-7 italic">
            {t('issueDetail.noDescription')}
          </p>
        )}
      </div>

      {/* ═══ METADATA ═══ */}
      {!metaCollapsed && (
        <>
          {isEditMode && editFormData && onFieldChange ? (
            <EditableMetadata
              formData={editFormData}
              onChange={onFieldChange}
              statusOptions={statusOptions}
              priorityOptions={priorityOptions}
              issueTypeOptions={issueTypeOptions}
              userOptions={userOptions}
              versionOptions={versionOptions}
              onAssignToMyself={onAssignToMyself}
            />
          ) : (
            <div className="px-5 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {/* Left column */}
                <div>
                  <MetaRow
                    label={t('issueDetail.metadata.priority')}
                    value={
                      renderPriorityValue(card.priority, priorityLabel) ??
                      undefined
                    }
                  />
                  <MetaRow
                    label={t('issueDetail.metadata.issueType')}
                    value={issueTypeInfo?.name}
                  />
                  <MetaRow
                    label={t('issueDetail.metadata.version')}
                    value={
                      card.versionId
                        ? versions.find(v => v.id === card.versionId)?.name
                        : undefined
                    }
                  />
                  <MetaRow
                    label={t('issueDetail.metadata.estimatedHours')}
                    value={
                      card.estimatedHours ? (
                        <span className="text-theme-main">
                          {card.estimatedHours}
                        </span>
                      ) : undefined
                    }
                  />
                </div>
                {/* Right column */}
                <div>
                  <MetaRow
                    label={t('issueDetail.metadata.assignee')}
                    value={
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-green-500 inline-flex items-center justify-center text-white text-[10px] font-bold">
                          {resolveUser(
                            card.assignee,
                            card.assigneeUserId ?? undefined
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        {resolveUser(
                          card.assignee,
                          card.assigneeUserId ?? undefined
                        )}
                      </span>
                    }
                  />
                  <MetaRow label="Milestone" value={undefined} />
                  <MetaRow
                    label={t('issueDetail.metadata.actualHours')}
                    value={
                      card.actualHours ? (
                        <span className="text-theme-main">
                          {card.actualHours}
                        </span>
                      ) : undefined
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Collapse/Expand handle */}
      <div className="flex justify-center py-1 border-t border-theme-neutral-4/40">
        <button
          type="button"
          className="text-theme-neutral-6 hover:text-theme-neutral-8 cursor-pointer p-1"
          onClick={() => setMetaCollapsed(!metaCollapsed)}
        >
          {metaCollapsed ? (
            <Image
              src={Icons.ChevronDown}
              alt=""
              width={16}
              height={16}
              className="w-4 h-4"
            />
          ) : (
            <Image
              src={Icons.ChevronUp}
              alt=""
              width={16}
              height={16}
              className="w-4 h-4"
            />
          )}
        </button>
      </div>
    </div>
  );
};
