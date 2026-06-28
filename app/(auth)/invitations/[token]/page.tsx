'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Icons from '@/assets/icons';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { BoardInvitationStatus } from '@/config/enum';
import {
  renderInvitationStatusBadge,
  renderMemberRoleBadge,
} from '@/constant/data';
import { useInvitationToken } from '@/hooks/use-invitation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/user/userSlice';

const getSafeToken = (tokenParam?: string | string[]) => {
  return Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '';
  return new Date(value).toLocaleString();
};

export default function InvitationDetailPage() {
  const { t } = useTranslation();
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const token = getSafeToken(params?.token);

  const {
    invitation,
    isInvitationLoading,
    invitationError,
    refetchInvitation,
    acceptInvitation,
    isAcceptInvitationPending,
    declineInvitation,
    isDeclineInvitationPending,
  } = useInvitationToken(token);

  const invitationPath = token ? `/invitations/${token}` : '/invitations';
  const loginHref = `/login?redirect=${encodeURIComponent(invitationPath)}`;
  const registerHref = useMemo(() => {
    const query = new URLSearchParams();
    if (token) query.set('invitationToken', token);
    if (invitation?.email) query.set('email', invitation.email);
    query.set('redirect', invitationPath);
    return `/register?${query.toString()}`;
  }, [invitation?.email, invitationPath, token]);

  const isPending = invitation?.status === BoardInvitationStatus.PENDING;
  const isActionPending =
    isAcceptInvitationPending || isDeclineInvitationPending;

  const handleAccept = async () => {
    if (!currentUser) {
      router.push(loginHref);
      return;
    }

    const accepted = await acceptInvitation();
    router.push(`/project/${accepted.boardId}/issues`);
  };

  const handleDecline = async () => {
    if (!currentUser) {
      router.push(loginHref);
      return;
    }

    await declineInvitation();
  };

  if (isInvitationLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-xl border border-theme-neutral-4 bg-theme-neutral-1 p-8 text-center shadow-xl">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-theme-neutral-5 border-t-theme-main" />
          <p className="mt-4 text-sm text-theme-neutral-8">
            {t('invitation.loading')}
          </p>
        </div>
      </div>
    );
  }

  if (invitationError || !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-xl border border-theme-neutral-4 bg-theme-neutral-1 p-8 text-center shadow-xl">
          <Image
            src={Icons.XCircle}
            alt=""
            width={48}
            height={48}
            className="mx-auto h-12 w-12 text-theme-neutral-7"
          />
          <h1 className="mt-4 text-2xl font-semibold text-theme-neutral-11">
            {t('invitation.loadErrorTitle')}
          </h1>
          <p className="mt-2 text-sm leading-6 text-theme-neutral-8">
            {t('invitation.loadErrorDescription')}
          </p>
          <Button
            className="mt-6"
            variant="primary"
            onClick={() => refetchInvitation()}
          >
            <Image
              src={Icons.RefreshCw}
              alt=""
              width={16}
              height={16}
              className="mr-2 h-4 w-4"
            />
            {t('common.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-xl border border-theme-neutral-4 bg-theme-neutral-1 p-8 shadow-xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-theme-main-2 bg-theme-main-1 px-3 py-1 text-xs font-semibold text-theme-main-6">
              <Image
                src={Icons.Clock}
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5"
              />
              {t('invitation.pageLabel')}
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-[-0.01em] text-theme-neutral-11">
              {invitation.board.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-theme-neutral-8">
              {t('invitation.description', {
                boardCode: invitation.board.boardCode,
              })}
            </p>
          </div>
          <div>{renderInvitationStatusBadge(invitation.status, t)}</div>
        </div>

        <div className="mt-6 grid gap-4 rounded-lg border border-theme-neutral-4 bg-theme-neutral-2/70 p-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-theme-neutral-7">
              {t('invitation.emailLabel')}
            </p>
            <p className="mt-1 text-sm font-medium text-theme-neutral-11">
              {invitation.email}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-theme-neutral-7">
              {t('invitation.roleLabel')}
            </p>
            <div className="mt-1">
              {renderMemberRoleBadge(invitation.role, t)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-theme-neutral-7">
              {t('invitation.invitedByLabel')}
            </p>
            <p className="mt-1 text-sm font-medium text-theme-neutral-11">
              {invitation.invitedBy?.displayName || t('common.unknown')}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-theme-neutral-7">
              {t('invitation.expiresAtLabel')}
            </p>
            <p className="mt-1 text-sm font-medium text-theme-neutral-11">
              {formatDateTime(invitation.expiresAt)}
            </p>
          </div>
        </div>

        {currentUser && (
          <p className="mt-4 text-sm text-theme-neutral-8">
            {t('invitation.authenticatedAs', { email: currentUser.email })}
          </p>
        )}

        {currentUser &&
          currentUser.email.toLowerCase() !== invitation.email.toLowerCase() &&
          isPending && (
            <p className="mt-3 rounded-md border border-theme-neutral-5 bg-theme-neutral-2 px-3 py-2 text-sm text-theme-neutral-8">
              {t('invitation.emailMismatchHint', {
                email: invitation.email,
              })}
            </p>
          )}

        {!currentUser && isPending && (
          <p className="mt-4 rounded-md border border-theme-neutral-5 bg-theme-neutral-2 px-3 py-2 text-sm text-theme-neutral-8">
            {t('invitation.unauthenticatedHint')}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {isPending ? (
            currentUser ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isActionPending}
                  onClick={handleDecline}
                >
                  <Image
                    src={Icons.XCircle}
                    alt=""
                    width={16}
                    height={16}
                    className="mr-2 h-4 w-4"
                  />
                  {t('invitation.decline')}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={isActionPending}
                  onClick={handleAccept}
                >
                  <Image
                    src={Icons.CheckCircle2}
                    alt=""
                    width={16}
                    height={16}
                    className="mr-2 h-4 w-4"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  {isAcceptInvitationPending
                    ? t('common.loading')
                    : t('invitation.accept')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(registerHref)}
                >
                  <Image
                    src={Icons.UserPlus}
                    alt=""
                    width={16}
                    height={16}
                    className="mr-2 h-4 w-4"
                  />
                  {t('invitation.createAccount')}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => router.push(loginHref)}
                >
                  <Image
                    src={Icons.LogIn}
                    alt=""
                    width={16}
                    height={16}
                    className="mr-2 h-4 w-4"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  {t('invitation.signIn')}
                </Button>
              </>
            )
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={() => router.push('/dashboard')}
            >
              {t('invitation.goDashboard')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
