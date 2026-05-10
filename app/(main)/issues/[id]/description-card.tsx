import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from '@/constant/format';
import type { Card } from '@/config/interface';

const PRIORITY_STYLES: Record<number, string> = {
  1: 'text-blue-600',
  2: 'text-yellow-600',
  3: 'text-red-600',
};

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
  resolveUser: (user: any, fallbackId?: string) => string;
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({
  card,
  versions,
  issueTypeInfo,
  priorityLabel,
  resolveUser,
}) => {
  const { t } = useTranslation();
  const [metaCollapsed, setMetaCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-theme-neutral-5/60 mb-4">
      {/* Author line */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-theme-main/20 flex items-center justify-center text-theme-main text-xs font-bold">
            {resolveUser(card.assignee, card.assigneeId ?? undefined)
              .charAt(0)
              .toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-theme-neutral-11">
              {resolveUser(card.assignee, card.assigneeId ?? undefined)}
            </p>
            <p className="text-xs text-theme-neutral-7">
              Created: {format.dateTime(card.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Description body */}
      <div className="px-5 pb-4">
        {card.description ? (
          <div className="prose prose-sm max-w-none text-theme-neutral-11 leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_a]:text-theme-main [&_a]:hover:underline [&_blockquote]:border-l-4 [&_blockquote]:border-theme-neutral-5 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-theme-neutral-8 [&_code]:bg-theme-neutral-3 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-theme-neutral-3 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-2">
            <ReactMarkdown>{card.description}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-theme-neutral-7 italic">
            {t('issueDetail.noDescription')}
          </p>
        )}
      </div>

      {/* ═══ METADATA GRID (2 columns) ═══ */}
      {!metaCollapsed && (
        <div className="px-5 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Left column */}
            <div>
              <MetaRow
                label={t('issueDetail.metadata.priority')}
                value={
                  priorityLabel ? (
                    <span
                      className={`font-medium ${PRIORITY_STYLES[card.priorityId!] ?? ''}`}
                    >
                      → {priorityLabel}
                    </span>
                  ) : undefined
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
                    ? versions.find(v => v._id === String(card.versionId))?.name
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
                      {resolveUser(card.assignee, card.assigneeId ?? undefined)
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                    {resolveUser(card.assignee, card.assigneeId ?? undefined)}
                  </span>
                }
              />
              <MetaRow label="Milestone" value={undefined} />
              <MetaRow
                label={t('issueDetail.metadata.actualHours')}
                value={
                  card.actualHours ? (
                    <span className="text-theme-main">{card.actualHours}</span>
                  ) : undefined
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Collapse/Expand handle */}
      <div className="flex justify-center py-1 border-t border-theme-neutral-4/40">
        <button
          type="button"
          className="text-theme-neutral-6 hover:text-theme-neutral-8 cursor-pointer p-1"
          onClick={() => setMetaCollapsed(!metaCollapsed)}
        >
          {metaCollapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
