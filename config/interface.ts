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
  boardId: string;
  columnId: string;
  cardId: string;
  newColumnId: string;
}

export interface CreateNewColumnRequest {
  boardId: string;
  column: Column;
}

export interface UpdateColumnDetailsRequest {
  columnId: string;
  updateData: Column;
}
