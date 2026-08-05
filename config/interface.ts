import type { ColorStatusKey } from '@/constant/data';
import type { BoardInvitationStatus } from '@/config/enum';

// Types for Board, Column, and Card entities
export type EntityId = number;
export type BoardType = 'PUBLIC' | 'PRIVATE';
export type BoardMemberRole = 'ADMIN' | 'PM' | 'MEMBER' | 'GUEST';

export interface ReorderPositionInput {
  id: EntityId;
  position: number;
}

export interface Card {
  id: EntityId;
  boardId: EntityId;
  columnId: EntityId;
  position: number;
  cardCode?: string;
  title?: string;
  description?: string | null;
  cover?: string | null;
  memberIds?: EntityId[];
  comments?: string[];
  countComment?: number;
  attachments?: Attachment[];
  priority?: number | null;
  assigneeUserId?: EntityId | null;
  assignee?: User | null;
  issueTypeId?: EntityId | null;
  issueType?: CardIssueType | null;
  column?: CardStatus | null;
  versionId?: EntityId | null;
  startDate?: string | null;
  dueDate?: string | null;
  estimatedHours?: string | null;
  actualHours?: string | null;
  registeredBy?: EntityId | User | null;
  registeredByUserId?: EntityId | null;
  createdBy?: EntityId | User | null;
  createdByUserId?: EntityId | null;
  createdAt?: number | string;
  updatedAt?: number | string | null;
  _destroy?: boolean;
  FE_PlaceholderCard?: boolean;
}

export interface CardStatus {
  id: EntityId;
  boardId: EntityId;
  title: string;
  position?: number;
  statusColor?: string | null;
}

export interface CardIssueType {
  id: EntityId;
  boardId: EntityId;
  name: string;
  statusColor?: string | null;
}

export interface CardListParams {
  search?: string;
  priority?: string;
  issueTypeId?: string;
  columnId?: string;
  assigneeUserId?: string;
  registeredByUserId?: string;
  versionId?: string;
  startDate?: string;
  dueDate?: string;
  skip?: number;
  limit?: number;
}

export interface CardListResponse {
  total: number;
  items: Card[];
}

export interface Column {
  id: EntityId;
  boardId: EntityId;
  title: string;
  position: number;
  cards: Card[];
  statusColor?: string;
  _count?: {
    cards?: number;
  };
  selectedColorKey?: ColorStatusKey;
}

export interface Board {
  id: EntityId;
  title: string;
  boardCode: string;
  description?: string;
  type: BoardType;
  members: { userId: EntityId; role: BoardMemberRole }[];
  columns: Column[];
}
export interface BoardListResponse {
  boards: Board[];
}

export interface BoardDetailParams {
  assigneeUserId?: EntityId;
  issueTypeId?: EntityId;
}

export interface CreateBoardRequest {
  title: string;
  boardCode: string;
  type: BoardType;
}

export interface DuplicateBoardRequest {
  title: string;
  boardCode: string;
  /** Bỏ trống để giữ description của board gốc. */
  description?: string;
  /** Bỏ trống để giữ type của board gốc. */
  type?: BoardType;
}

export interface CreateSampleBoardRequest {
  title: string;
  boardCode: string;
  /** Ngôn ngữ nội dung ticket mẫu. Bỏ trống thì BE dùng mặc định. */
  locale?: 'vi' | 'en';
}

export interface IssueType {
  id: EntityId;
  boardId?: EntityId;
  name: string;
  issueCount?: number;
  statusColor?: string;
  createdAt?: number;
  updatedAt?: number | null;
}

/** Payload tạo issue type: name, statusColor (1–10) */
export interface CreateIssueTypeRequest {
  name: string;
  statusColor: string;
  boardId?: EntityId;
}

export interface Version {
  id: EntityId;
  boardId?: EntityId;
  name: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  createdAt?: number;
  updatedAt?: number | null;
}

/** Payload tạo version */
export interface CreateVersionRequest {
  name: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  boardId?: EntityId;
}

/** Payload cập nhật version */
export interface UpdateVersionRequest {
  name?: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}

export interface ActiveBoardState {
  currentActiveBoard: Board | null;
}

export interface MoveCardToDifferentColumnRequest {
  currentCardId: EntityId;
  prevColumnId: EntityId;
  prevCards: ReorderPositionInput[];
  nextColumnId: EntityId;
  nextCards: ReorderPositionInput[];
}

/** Payload tạo column mới: boardId, title, statusColor (+ lưu cả key màu UI) */
export interface CreateNewColumnRequest {
  boardId: EntityId;
  title: string;
  statusColor?: string;
}

export interface UpdateColumnDetailsRequest {
  boardId: EntityId;
  columnId: EntityId;
  updateData: Partial<Omit<Column, 'cards'>> & {
    cards?: ReorderPositionInput[];
  };
}

export interface UpdateBoardDetailRequest {
  boardId: EntityId;
  updateData: Partial<Omit<Board, 'columns'>> & {
    columns?: ReorderPositionInput[];
  };
}

export interface CreateNewCardRequest {
  boardId: EntityId;
  columnId: EntityId;
  title: string;
  description?: string;
  priority?: number;
  assigneeUserId?: EntityId;
  issueTypeId?: EntityId;
  versionId?: EntityId;
  startDate?: string;
  dueDate?: string;
  estimatedHours?: string;
  actualHours?: string;
  attachments?: File[];
}

export interface UpdateCardRequest {
  title?: string;
  description?: string | null;
  columnId?: EntityId;
  priority?: number | null;
  assigneeUserId?: EntityId | null;
  issueTypeId?: EntityId | null;
  versionId?: EntityId | null;
  startDate?: string | null;
  dueDate?: string | null;
  estimatedHours?: string | null;
  actualHours?: string | null;
  attachments?: File[];
  removeAttachmentIds?: EntityId[];
}

// Auth Request/Response types
export interface RegisterUserRequest {
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  email: string;
  id: number;
}

export interface VerifyUserRequest {
  email: string;
  token: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  id: number;
  email: string;
  displayName: string;
  avatar: string | null;
  isActive: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface User {
  id: number;
  email: string;
  displayName: string;
  avatar: string | null;
  isActive: boolean;
}

export interface UsersBoardParams {
  search?: string;
  role?: BoardMemberRole | null;
  skip?: number;
  limit?: number;
}

export interface UsersBoardResponse {
  total: number;
  items: UserBoardMember[];
}

export interface UserBoardMember {
  userId: EntityId;
  role: BoardMemberRole;
  email: string;
  username: string;
  displayName: string;
  avatar: string | null;
  /** Mã người dùng công khai (vd `U-000042`). Null với user tạo trước tính năng này. */
  userCode: string | null;
  createdAt: number;
  updatedAt: number | null;
}

export interface InvitationBoard {
  id: EntityId;
  title: string;
  boardCode: string;
}

export interface InvitationUser {
  id: EntityId;
  email: string;
  displayName: string;
  avatar: string | null;
}

export interface BoardInvitation {
  id: EntityId;
  boardId: EntityId;
  email: string;
  inviteeUserId: EntityId | null;
  invitedByUserId: EntityId | null;
  role: BoardMemberRole;
  status: BoardInvitationStatus;
  expiresAt: string;
  respondedAt: string | null;
  board: InvitationBoard;
  invitee: InvitationUser | null;
  invitedBy: InvitationUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface MyBoardInvitation extends BoardInvitation {
  token: string;
}

export interface CreateInvitationRequest {
  email: string;
  role: BoardMemberRole;
}

export interface InvitationListParams {
  status?: BoardInvitationStatus;
}

export interface InvitationListResponse<
  TInvitation extends BoardInvitation = BoardInvitation,
> {
  total: number;
  items: TInvitation[];
}

export type MyInvitationListResponse =
  InvitationListResponse<MyBoardInvitation>;

// ─── Comment ───────────────────────────────────────────────────

export interface CommentUser {
  id: EntityId;
  email: string;
  displayName: string;
  avatar: string | null;
}

export interface Attachment {
  id: EntityId;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  fileSize?: number;
}

export type CommentType = 'USER' | 'SYSTEM';

export interface Comment {
  id: EntityId;
  cardId: EntityId;
  content: string;
  /**
   * USER: comment do người dùng viết (content là markdown).
   * SYSTEM: comment tự sinh khi ticket được cập nhật
   * (content là delta JSON của jsondiffpatch).
   */
  type: CommentType;
  user: CommentUser;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  total: number;
  items: Comment[];
}

export interface CommentListParams {
  skip?: number;
  limit?: number;
}

export interface CreateCommentRequest {
  content: string;
  attachments?: File[];
}

export interface UpdateCommentRequest {
  content: string;
  attachments?: File[];
  removeAttachmentIds?: EntityId[];
}
