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
  FE_PlaceholderCard?: boolean;
}

export interface Column {
  _id: string;
  boardId: string;
  title: string;
  cardOrderIds: string[];
  cards: Card[];
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

export interface CreateNewColumnRequest {
  boardId: string;
  column: Column;
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
