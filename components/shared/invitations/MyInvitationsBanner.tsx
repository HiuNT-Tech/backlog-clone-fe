'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Icons from '@/assets/icons';

import { Button } from '@/components/ui/button';
import { BoardInvitationStatus } from '@/config/enum';
import {
  renderInvitationStatusBadge,
  renderMemberRoleBadge,
} from '@/constant/data';
import { useMyInvitations } from '@/hooks/use-invitation';
import type { BoardInvitation } from '@/config/interface';

/* ─── Single invitation card ──────────────────────────────────────────── */

function InvitationCard({ invitation }: { invitation: BoardInvitation }) {
  const { t } = useTranslation();
  const router = useRouter();

  const isPending = invitation.status === BoardInvitationStatus.PENDING;

  return (
    <div className="group relative flex items-center gap-4 rounded-lg border border-theme-neutral-4/80 bg-theme-neutral-1 px-4 py-3 shadow-sm transition-all duration-200 hover:border-theme-main-3 hover:shadow-md">
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-theme-main-1">
        <Image
          src={Icons.MailOpen}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 text-theme-main-6"
          style={{ filter: 'var(--theme-filter-main)' }}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-theme-neutral-11">
          {invitation.board.title}
          <span className="ml-2 text-xs font-normal text-theme-neutral-7">
            ({invitation.board.boardCode})
          </span>
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-theme-neutral-8">
          <span>
            {t('dashboard.invitations.invitedBy', {
              name: invitation.invitedBy?.displayName || t('common.unknown'),
            })}
          </span>
          <span className="text-theme-neutral-5">·</span>
          {renderMemberRoleBadge(invitation.role, t)}
        </div>
      </div>

      {/* Status */}
      <div className="shrink-0">
        {renderInvitationStatusBadge(invitation.status, t)}
      </div>

      {/* Actions – for pending invitations, show a "View" button */}
      {isPending && (
        <div className="shrink-0">
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="h-8 text-xs"
            onClick={() => router.push(`/project/${invitation.boardId}/issues`)}
          >
            <Image
              src={Icons.CheckCircle2}
              alt=""
              width={14}
              height={14}
              className="mr-1.5 h-3.5 w-3.5"
            />
            {t('dashboard.invitations.viewAction')}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ─── Banner component ────────────────────────────────────────────────── */

export default function MyInvitationsBanner() {
  const { t } = useTranslation();
  const { myInvitationsData, isMyInvitationsLoading } = useMyInvitations(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const pendingInvitations = myInvitationsData.items.filter(
    inv => inv.status === BoardInvitationStatus.PENDING
  );

  // Don't render if no pending invitations, loading, or dismissed
  if (
    isMyInvitationsLoading ||
    pendingInvitations.length === 0 ||
    isDismissed
  ) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-theme-main-3/60 bg-gradient-to-r from-theme-main-1 via-theme-neutral-1 to-theme-main-1 shadow-sm">
      {/* Decorative gradient accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-theme-main to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-theme-main-2">
            <Image
              src={Icons.MailOpen}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 text-theme-main-7"
              style={{ filter: 'var(--theme-filter-main)' }}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-theme-neutral-11">
              {t('dashboard.invitations.bannerTitle')}
            </h3>
            <p className="text-xs text-theme-neutral-8">
              {t('dashboard.invitations.bannerHint', {
                count: pendingInvitations.length,
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-md p-1.5 text-theme-neutral-7 transition-colors hover:bg-theme-neutral-3 hover:text-theme-neutral-10"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <Image
                src={Icons.ChevronUp}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
              />
            ) : (
              <Image
                src={Icons.ChevronDown}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="rounded-md p-1.5 text-theme-neutral-7 transition-colors hover:bg-theme-neutral-3 hover:text-theme-neutral-10"
            aria-label="Dismiss"
          >
            <Image
              src={Icons.X}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4"
            />
          </button>
        </div>
      </div>

      {/* Invitation list (collapsible) */}
      {isExpanded && (
        <div className="space-y-2 px-5 pb-4">
          {pendingInvitations.map(invitation => (
            <InvitationCard key={invitation.id} invitation={invitation} />
          ))}
        </div>
      )}
    </div>
  );
}
