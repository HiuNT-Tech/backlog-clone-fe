// Types for Board, Column, and Card entities

export interface Card {
  _id: string;
  boardId: string;
  columnId: string;
  title?: string;
  cover?: string | null;
  memberIds?: string[];
  comments?: string[];
  attachments?: string[];
  issueTypeId?: string;
  FE_PlaceholderCard?: boolean;
}

import type { ColorStatusKey } from '@/constant/data';

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
  ownerIds: string[];
  memberIds: string[];
  columnOrderIds: string[];
  columns: Column[];
}
export interface BoardListResponse {
  boards: Board[];
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
