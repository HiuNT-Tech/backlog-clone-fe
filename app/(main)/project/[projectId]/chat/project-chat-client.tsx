'use client';

import { useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Icons from '@/assets/icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserBoard } from '@/hooks/use-user-board';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/user/userSlice';
import { cn } from '@/lib/utils';
import type { BoardMemberRole, UserBoardMember } from '@/config/interface';
import { toEntityIdOrUndefined } from '@/lib/entity-id';

type Presence = 'online' | 'away' | 'busy' | 'offline';

type ChatMember = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  presence: Presence;
};

type ConversationType = 'channel' | 'group' | 'direct';

type Conversation = {
  id: string;
  type: ConversationType;
  name: string;
  participantIds: string[];
  unread?: number;
  pinned?: boolean;
};

type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

const presenceClassName: Record<Presence, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  busy: 'bg-rose-500',
  offline: 'bg-theme-neutral-5',
};

const avatarPalette = [
  'bg-[#3B9DB7]',
  'bg-[#45AC94]',
  'bg-[#868DB8]',
  'bg-[#D8921B]',
  'bg-[#DB7F9B]',
  'bg-[#90A631]',
];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const getRoleLabel = (role: BoardMemberRole) => {
  switch (role) {
    case 'ADMIN':
      return 'Admin';
    case 'PM':
      return 'PM';
    case 'GUEST':
      return 'Guest';
    case 'MEMBER':
    default:
      return 'Member';
  }
};

const getMessageTime = () => {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
};

const memberFromBoardUser = (
  user: UserBoardMember,
  index: number
): ChatMember => {
  const presences: Presence[] = ['online', 'online', 'away', 'busy', 'offline'];

  return {
    id: String(user.userId),
    name:
      user.displayName || user.username || user.email || String(user.userId),
    email: user.email,
    avatar: user.avatar,
    role: getRoleLabel(user.role),
    presence: presences[index % presences.length],
  };
};

const getFallbackMessages = (
  conversation: Conversation,
  members: ChatMember[],
  currentMember?: ChatMember
): ChatMessage[] => {
  const firstMember =
    members.find(member => member.id !== currentMember?.id) ??
    currentMember ??
    members[0];
  const secondMember =
    members.find(
      member => member.id !== firstMember?.id && member.id !== currentMember?.id
    ) ??
    currentMember ??
    firstMember;
  const ownId = currentMember?.id ?? 'me';

  if (conversation.type === 'direct') {
    const directMember =
      members.find(
        member =>
          conversation.participantIds.includes(member.id) && member.id !== ownId
      ) ?? firstMember;

    return [
      {
        id: `${conversation.id}-seed-1`,
        conversationId: conversation.id,
        senderId: directMember?.id ?? 'member',
        body: 'Mình đã xem phần issue mới, lát nữa mình gửi thêm context trong thread này.',
        createdAt: '09:24',
      },
      {
        id: `${conversation.id}-seed-2`,
        conversationId: conversation.id,
        senderId: ownId,
        body: 'Ok, mình sẽ giữ lại các note quan trọng ở đây để cả hai tiện theo dõi.',
        createdAt: '09:31',
      },
    ];
  }

  return [
    {
      id: `${conversation.id}-seed-1`,
      conversationId: conversation.id,
      senderId: firstMember?.id ?? 'member-1',
      body: 'Mọi người cập nhật các blocker của sprint vào đây nhé.',
      createdAt: '08:45',
    },
    {
      id: `${conversation.id}-seed-2`,
      conversationId: conversation.id,
      senderId: secondMember?.id ?? 'member-2',
      body: 'Team FE đang hoàn thiện phần issue detail và màn chat nội bộ.',
      createdAt: '09:10',
    },
    {
      id: `${conversation.id}-seed-3`,
      conversationId: conversation.id,
      senderId: ownId,
      body: 'Mình sẽ gom lại decision sau buổi sync để mọi người không bị trôi thông tin.',
      createdAt: '09:18',
    },
  ];
};

const AvatarBadge = ({
  member,
  index = 0,
  size = 'md',
}: {
  member?: ChatMember;
  index?: number;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClassName = {
    sm: 'h-8 w-8 text-[11px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-12 w-12 text-sm',
  }[size];

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        sizeClassName,
        avatarPalette[index % avatarPalette.length]
      )}
    >
      {getInitials(member?.name ?? 'Member')}
      {member && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white',
            presenceClassName[member.presence]
          )}
        />
      )}
    </div>
  );
};

const ConversationIcon = ({ conversation }: { conversation: Conversation }) => {
  if (conversation.type === 'direct') {
    return (
      <Image
        src={Icons.LockKeyhole}
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 text-theme-neutral-7"
      />
    );
  }

  if (conversation.type === 'channel') {
    return (
      <Image
        src={Icons.Hash}
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 text-theme-neutral-7"
      />
    );
  }

  return (
    <Image
      src={Icons.Users}
      alt=""
      width={16}
      height={16}
      className="h-4 w-4 text-theme-neutral-7"
    />
  );
};

export function ProjectChatClient() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const params = useParams();
  const boardId = toEntityIdOrUndefined(
    (params?.projectId as string) ||
      (params?.id as string) ||
      searchParams.get('boardId') ||
      searchParams.get('id')
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const { listUser, isLoading: isListLoading } = useUserBoard(boardId, {
    skip: 0,
    limit: 100,
  });
  const localIdRef = useRef(0);

  const [activeConversationId, setActiveConversationId] =
    useState('project-general');
  const [conversationSearch, setConversationSearch] = useState('');
  const [messageDraft, setMessageDraft] = useState('');
  const [customConversations, setCustomConversations] = useState<
    Conversation[]
  >([]);
  const [messageMap, setMessageMap] = useState<Record<string, ChatMessage[]>>(
    {}
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const members = useMemo<ChatMember[]>(() => {
    const boardMembers = listUser.items.map(memberFromBoardUser);
    const hasCurrentUser = currentUser?.id
      ? boardMembers.some(member => member.id === String(currentUser.id))
      : true;

    if (!currentUser?.id || hasCurrentUser) {
      return boardMembers;
    }

    return [
      {
        id: String(currentUser.id),
        name: currentUser.displayName || 'Me',
        email: currentUser.email,
        avatar: currentUser.avatar,
        role: 'Member',
        presence: 'online',
      },
      ...boardMembers,
    ];
  }, [currentUser, listUser.items]);

  const currentMember = useMemo(() => {
    if (!currentUser?.id) return members[0];
    return (
      members.find(member => member.id === String(currentUser.id)) ?? members[0]
    );
  }, [currentUser?.id, members]);

  const baseConversations = useMemo<Conversation[]>(() => {
    const otherMembers = members.filter(
      member => member.id !== currentMember?.id
    );
    const firstDirect = otherMembers[0];
    const firstGroupMembers = members.slice(0, Math.min(5, members.length));

    return [
      {
        id: 'project-general',
        type: 'channel',
        name: t('chat.generalChannel'),
        participantIds: members.map(member => member.id),
        unread: 3,
        pinned: true,
      },
      ...(firstGroupMembers.length >= 3
        ? [
            {
              id: 'delivery-sync',
              type: 'group' as const,
              name: t('chat.deliveryGroup'),
              participantIds: firstGroupMembers.map(member => member.id),
              unread: 1,
            },
          ]
        : []),
      ...(firstDirect
        ? [
            {
              id: `direct-${firstDirect.id}`,
              type: 'direct' as const,
              name: firstDirect.name,
              participantIds: [currentMember?.id, firstDirect.id].filter(
                Boolean
              ) as string[],
            },
          ]
        : []),
    ];
  }, [currentMember?.id, members, t]);

  const conversations = useMemo(
    () => [...customConversations, ...baseConversations],
    [baseConversations, customConversations]
  );

  const activeConversation =
    conversations.find(
      conversation => conversation.id === activeConversationId
    ) ?? conversations[0];

  const getConversationMessages = (conversation: Conversation) => {
    return (
      messageMap[conversation.id] ??
      getFallbackMessages(conversation, members, currentMember)
    );
  };

  const activeMessages = activeConversation
    ? getConversationMessages(activeConversation)
    : [];

  const activeMembers = activeConversation
    ? activeConversation.participantIds
        .map(id => members.find(member => member.id === id))
        .filter(Boolean)
    : [];

  const filteredConversations = conversations.filter(conversation => {
    const query = conversationSearch.trim().toLowerCase();
    if (!query) return true;

    return conversation.name.toLowerCase().includes(query);
  });

  const filteredMembers = members.filter(member => {
    const query = memberSearch.trim().toLowerCase();
    if (!query) return true;

    return (
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  });

  const toggleSelectedMember = (memberId: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateGroup = () => {
    if (!selectedMemberIds.length) return;

    localIdRef.current += 1;
    const groupId = `group-${localIdRef.current}`;
    const ownerId = currentMember?.id;
    const participantIds = Array.from(
      new Set([ownerId, ...selectedMemberIds].filter(Boolean) as string[])
    );
    const selectedNames = members
      .filter(member => selectedMemberIds.includes(member.id))
      .slice(0, 3)
      .map(member => member.name)
      .join(', ');

    const conversation: Conversation = {
      id: groupId,
      type: 'group',
      name: newGroupName.trim() || selectedNames || t('chat.newGroup'),
      participantIds,
      unread: 0,
    };

    setCustomConversations(prev => [conversation, ...prev]);
    setMessageMap(prev => ({
      ...prev,
      [groupId]: [
        {
          id: `${groupId}-created`,
          conversationId: groupId,
          senderId: ownerId ?? 'me',
          body: t('chat.groupCreatedMessage'),
          createdAt: getMessageTime(),
        },
      ],
    }));
    setActiveConversationId(groupId);
    setIsCreateOpen(false);
    setNewGroupName('');
    setSelectedMemberIds([]);
    setMemberSearch('');
  };

  const handleOpenDirectChat = (member: ChatMember) => {
    const directId = `direct-${member.id}`;

    if (!conversations.some(conversation => conversation.id === directId)) {
      setCustomConversations(prev => [
        {
          id: directId,
          type: 'direct',
          name: member.name,
          participantIds: [currentMember?.id, member.id].filter(
            Boolean
          ) as string[],
        },
        ...prev,
      ]);
    }

    setActiveConversationId(directId);
  };

  const handleSendMessage = () => {
    if (!activeConversation || !messageDraft.trim()) return;

    localIdRef.current += 1;
    const nextMessage: ChatMessage = {
      id: `message-${localIdRef.current}`,
      conversationId: activeConversation.id,
      senderId: currentMember?.id ?? 'me',
      body: messageDraft.trim(),
      createdAt: getMessageTime(),
    };

    setMessageMap(prev => ({
      ...prev,
      [activeConversation.id]: [
        ...(prev[activeConversation.id] ??
          getFallbackMessages(activeConversation, members, currentMember)),
        nextMessage,
      ],
    }));
    setMessageDraft('');
  };

  if (!boardId) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-theme-neutral-3/40 px-6">
        <div className="max-w-md rounded-lg border border-theme-neutral-4 bg-white p-6 text-center shadow-sm">
          <Image
            src={Icons.MessageSquare}
            alt=""
            width={36}
            height={36}
            className="mx-auto h-9 w-9 text-theme-main"
            style={{ filter: 'var(--theme-filter-main)' }}
          />
          <h1 className="mt-4 text-xl font-semibold text-theme-neutral-11">
            {t('chat.noBoardTitle')}
          </h1>
          <p className="mt-2 text-sm leading-6 text-theme-neutral-8">
            {t('chat.noBoardDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] w-full flex-col bg-[#f6f7f9]">
      <div className="border-b border-theme-neutral-4 bg-white px-5 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-theme-main text-white">
              <Image
                src={Icons.MessageSquare}
                alt=""
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold text-theme-neutral-11">
                {t('chat.title')}
              </h1>
              <p className="text-sm text-theme-neutral-8">
                {isListLoading
                  ? t('common.loading')
                  : t('chat.memberCount', { count: members.length })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-theme-neutral-5 bg-white"
            >
              <Image
                src={Icons.Phone}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
              />
              {t('chat.call')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-theme-neutral-5 bg-white"
            >
              <Image
                src={Icons.Video}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
              />
              {t('chat.meet')}
            </Button>
            <Button
              type="button"
              className="gap-2 bg-theme-main text-white hover:bg-theme-hover"
              onClick={() => setIsCreateOpen(true)}
            >
              <Image
                src={Icons.Plus}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              {t('chat.newGroup')}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_300px]">
        <aside className="min-h-0 border-b border-theme-neutral-4 bg-white xl:border-b-0 xl:border-r">
          <div className="border-b border-theme-neutral-4 px-4 py-4">
            <div className="relative">
              <Image
                src={Icons.Search}
                alt=""
                width={16}
                height={16}
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-neutral-7"
              />
              <Input
                value={conversationSearch}
                onChange={event => setConversationSearch(event.target.value)}
                placeholder={t('chat.searchPlaceholder')}
                className="bg-theme-neutral-2 pl-9"
              />
            </div>
          </div>

          <div className="max-h-[260px] overflow-y-auto px-2 py-2 xl:max-h-none">
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-neutral-7">
                {t('chat.conversations')}
              </p>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-theme-neutral-7 hover:bg-theme-neutral-3 hover:text-theme-neutral-10"
                onClick={() => setIsCreateOpen(true)}
              >
                <Image
                  src={Icons.UserRoundPlus}
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              </button>
            </div>

            <div className="space-y-1">
              {filteredConversations.map(conversation => {
                const isActive = activeConversation?.id === conversation.id;
                const lastMessage =
                  getConversationMessages(conversation).at(-1);
                const previewText = lastMessage?.body ?? t('chat.noMessages');

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    className={cn(
                      'w-full cursor-pointer rounded-lg px-3 py-3 text-left transition-colors',
                      isActive
                        ? 'bg-theme-main-light text-theme-neutral-11'
                        : 'hover:bg-theme-neutral-3'
                    )}
                    onClick={() => setActiveConversationId(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                          isActive
                            ? 'border-theme-main bg-white'
                            : 'border-theme-neutral-4 bg-theme-neutral-2'
                        )}
                      >
                        <ConversationIcon conversation={conversation} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">
                            {conversation.name}
                          </p>
                          {conversation.pinned && (
                            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-theme-main">
                              {t('chat.pinned')}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-theme-neutral-8">
                          {previewText}
                        </p>
                      </div>
                      {!!conversation.unread && (
                        <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-theme-main px-1.5 text-[11px] font-semibold text-white">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="flex min-h-[520px] min-w-0 flex-col bg-theme-neutral-2/70">
          {activeConversation && (
            <>
              <div className="border-b border-theme-neutral-4 bg-white px-5 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <ConversationIcon conversation={activeConversation} />
                      <h2 className="truncate text-base font-semibold text-theme-neutral-11">
                        {activeConversation.name}
                      </h2>
                    </div>
                    <p className="mt-1 text-xs text-theme-neutral-8">
                      {t('chat.participantCount', {
                        count: activeMembers.length,
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-theme-neutral-5 bg-white text-theme-neutral-8"
                    >
                      <Image
                        src={Icons.Search}
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-theme-neutral-5 bg-white text-theme-neutral-8"
                    >
                      <Image
                        src={Icons.MoreHorizontal}
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
                {activeMessages.map(message => {
                  const sender =
                    members.find(member => member.id === message.senderId) ??
                    currentMember;
                  const isOwnMessage = message.senderId === currentMember?.id;

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        'flex items-end gap-3',
                        isOwnMessage && 'justify-end'
                      )}
                    >
                      {!isOwnMessage && (
                        <AvatarBadge
                          member={sender}
                          index={members.findIndex(
                            member => member.id === sender?.id
                          )}
                          size="sm"
                        />
                      )}

                      <div
                        className={cn(
                          'max-w-[min(680px,78%)] rounded-lg border px-4 py-3 shadow-sm',
                          isOwnMessage
                            ? 'border-theme-main bg-theme-main text-white'
                            : 'border-theme-neutral-4 bg-white text-theme-neutral-11'
                        )}
                      >
                        {!isOwnMessage && (
                          <div className="mb-1 flex items-center gap-2">
                            <p className="text-xs font-semibold">
                              {sender?.name ?? t('chat.unknownMember')}
                            </p>
                            <span className="text-[11px] text-theme-neutral-7">
                              {message.createdAt}
                            </span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {message.body}
                        </p>
                        {isOwnMessage && (
                          <p className="mt-1 text-right text-[11px] text-white/75">
                            {message.createdAt}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-theme-neutral-4 bg-white px-5 py-4">
                <div className="rounded-lg border border-theme-neutral-4 bg-theme-neutral-2 p-3">
                  <Textarea
                    value={messageDraft}
                    onChange={event => setMessageDraft(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={t('chat.messagePlaceholder', {
                      name: activeConversation.name,
                    })}
                    className="min-h-[82px] border-0 bg-transparent px-0 py-0 focus:outline-none"
                  />

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-theme-neutral-7">
                      <button
                        type="button"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-white hover:text-theme-neutral-11"
                      >
                        <Image
                          src={Icons.Paperclip}
                          alt=""
                          width={16}
                          height={16}
                          className="h-4 w-4"
                        />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-white hover:text-theme-neutral-11"
                      >
                        <Image
                          src={Icons.Smile}
                          alt=""
                          width={16}
                          height={16}
                          className="h-4 w-4"
                        />
                      </button>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      className="gap-2 bg-theme-main text-white hover:bg-theme-hover"
                      disabled={!messageDraft.trim()}
                      onClick={handleSendMessage}
                    >
                      <Image
                        src={Icons.SendHorizontal}
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                      {t('chat.send')}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <aside className="min-h-0 border-t border-theme-neutral-4 bg-white xl:border-l xl:border-t-0">
          <div className="border-b border-theme-neutral-4 px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-theme-neutral-11">
                  {t('chat.projectPeople')}
                </p>
                <p className="mt-1 text-xs text-theme-neutral-8">
                  {t('chat.peopleHint')}
                </p>
              </div>
              <Image
                src={Icons.Info}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 text-theme-neutral-7"
              />
            </div>
          </div>

          <div className="max-h-[360px] overflow-y-auto px-4 py-4 xl:max-h-none">
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-theme-neutral-2 px-3 py-2">
              <Image
                src={Icons.Users}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 text-theme-neutral-7"
              />
              <span className="text-sm text-theme-neutral-8">
                {t('chat.memberCount', { count: members.length })}
              </span>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="rounded-lg border border-theme-neutral-4 bg-white p-3"
                >
                  <div className="flex items-start gap-3">
                    <AvatarBadge member={member} index={index} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-theme-neutral-11">
                          {member.name}
                        </p>
                        <span
                          className={cn(
                            'h-2.5 w-2.5 rounded-full',
                            presenceClassName[member.presence]
                          )}
                        />
                      </div>
                      <p className="truncate text-xs text-theme-neutral-7">
                        {member.email}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="rounded bg-theme-neutral-3 px-2 py-0.5 text-[11px] font-medium text-theme-neutral-8">
                          {member.role}
                        </span>
                        {member.id !== currentMember?.id && (
                          <button
                            type="button"
                            className="cursor-pointer text-xs font-semibold text-theme-main hover:text-theme-hover"
                            onClick={() => handleOpenDirectChat(member)}
                          >
                            {t('chat.message')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>{t('chat.createGroupTitle')}</DialogTitle>
            <DialogDescription>
              {t('chat.createGroupDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              label={t('chat.groupName')}
              value={newGroupName}
              onChange={event => setNewGroupName(event.target.value)}
              placeholder={t('chat.groupNamePlaceholder')}
            />

            <div>
              <label className="text-sm font-medium text-theme-neutral-11">
                {t('chat.members')}
              </label>
              <div className="relative mt-2">
                <Image
                  src={Icons.Search}
                  alt=""
                  width={16}
                  height={16}
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-neutral-7"
                />
                <Input
                  value={memberSearch}
                  onChange={event => setMemberSearch(event.target.value)}
                  placeholder={t('chat.findPeople')}
                  className="pl-9"
                />
              </div>

              <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-lg border border-theme-neutral-4 p-2">
                {filteredMembers
                  .filter(member => member.id !== currentMember?.id)
                  .map((member, index) => {
                    const isSelected = selectedMemberIds.includes(member.id);

                    return (
                      <button
                        key={member.id}
                        type="button"
                        className={cn(
                          'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                          isSelected
                            ? 'bg-theme-main-light'
                            : 'hover:bg-theme-neutral-3'
                        )}
                        onClick={() => toggleSelectedMember(member.id)}
                      >
                        <AvatarBadge member={member} index={index} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-theme-neutral-11">
                            {member.name}
                          </p>
                          <p className="truncate text-xs text-theme-neutral-7">
                            {member.email}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded border',
                            isSelected
                              ? 'border-theme-main bg-theme-main text-white'
                              : 'border-theme-neutral-5 bg-white'
                          )}
                        >
                          {isSelected && (
                            <Image
                              src={Icons.Check}
                              alt=""
                              width={14}
                              height={14}
                              className="h-3.5 w-3.5"
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-theme-neutral-5"
              onClick={() => setIsCreateOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              className="bg-theme-main text-white hover:bg-theme-hover"
              disabled={!selectedMemberIds.length}
              onClick={handleCreateGroup}
            >
              {t('chat.createGroup')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
