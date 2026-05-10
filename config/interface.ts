import type { ColorStatusKey } from '@/constant/data';

// Types for Board, Column, and Card entities

export interface Card {
  _id: string;
  boardId: string;
  columnId: string;
  title?: string;
  description?: string | null;
  cover?: string | null;
  memberIds?: string[];
  comments?: string[];
  attachments?: string[];
  priorityId?: number | null;
  assigneeId?: string | null;
  assignee?: User | null;
  issueTypeId?: string | null;
  issueType?: CardIssueType | null;
  status?: CardStatus | null;
  versionId?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  estimatedHours?: string | null;
  actualHours?: string | null;
  registeredBy?: string | User | null;
  registeredById?: string | null;
  createdBy?: string | User | null;
  createdById?: string | null;
  createdAt?: number | string;
  updatedAt?: number | string | null;
  _destroy?: boolean;
  FE_PlaceholderCard?: boolean;
}

export interface CardStatus {
  _id: string;
  boardId: string;
  title: string;
  statusColor?: number | null;
}

export interface CardIssueType {
  _id: string;
  boardId: string;
  name: string;
  statusColor?: number | null;
}

export interface CardListParams {
  search?: string;
  priorityId?: string;
  issueTypeId?: string;
  columnId?: string;
  assigneeId?: string;
  registeredBy?: string;
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
  _id: string;
  boardId: string;
  title: string;
  cardOrderIds: string[];
  cards: Card[];
  // Thuộc tính màu cho status/column (tùy BE)
  statusColor?: number;
  selectedColorKey?: ColorStatusKey;
}

export interface Board {
  _id: string;
  title: string;
  description?: string;
  type: 'public' | 'private';
  members: { userId: string; role: 'ADMIN' | 'PM' | 'MEMBER' }[];
  columnOrderIds: string[];
  columns: Column[];
}
export interface BoardListResponse {
  boards: Board[];
}

export interface CreateBoardRequest {
  title: string;
  description: string;
  type: 'public' | 'private';
}

export interface IssueType {
  _id: string;
  name: string;
  issueCount?: number;
  statusColor?: number;
  createdAt?: number;
  updatedAt?: number | null;
}

/** Payload tạo issue type: name, statusColor (1–10) */
export interface CreateIssueTypeRequest {
  name: string;
  statusColor: number;
  boardId?: string;
}

export interface Version {
  _id: string;
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
  boardId?: string;
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
  currentCardId: string;
  prevColumnId: string;
  prevCardOrderIds: string[];
  nextColumnId: string;
  nextCardOrderIds: string[];
}

/** Payload tạo column mới: boardId, title, statusColor (+ lưu cả key màu UI) */
export interface CreateNewColumnRequest {
  boardId: string;
  title: string;
  statusColor?: number;
}

export interface UpdateColumnDetailsRequest {
  columnId: string;
  updateData: Partial<Column>;
}

export interface UpdateBoardDetailRequest {
  boardId: string;
  updateData: Partial<Board>;
}

export interface CreateNewCardRequest {
  boardId: string;
  columnId: string;
  title: string;
  description?: string;
  priorityId?: number;
  assigneeId?: string;
  issueTypeId?: string;
  versionId?: string;
  startDate?: string;
  dueDate?: string;
  estimatedHours?: string;
  actualHours?: string;
}

// Auth Request/Response types
export interface RegisterUserRequest {
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  email: string;
  _id: string;
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
  _id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string | null;
  role: string;
  isActive: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface User {
  _id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isActive: boolean;
}

export interface UsersBoardParams {
  search?: string;
  role?: number | null;
  skip?: number;
  limit?: number;
}

export interface UsersBoardResponse {
  total: number;
  items: UserBoardMember[];
}

export interface UserBoardMember {
  userId: string;
  role: number | string;
  email: string;
  username: string;
  displayName: string;
  avatar: string | null;
  _destroy: boolean;
  createdAt: number;
  updatedAt: number | null;
}
