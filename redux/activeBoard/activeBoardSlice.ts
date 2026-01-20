import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { mapOrder } from '@/utils/sorts';
import { isEmpty } from 'lodash';
import { generatePlaceholderCard } from '@/utils/formatters';
import type { Board, ActiveBoardState } from '@/config/interface';
import { BoardService } from '@/lib/apis/board';

// Initial state with proper typing
const initialState: ActiveBoardState = {
  currentActiveBoard: null,
};
// Async thunk for fetching board details
export const fetchBoardDetailsAPI = createAsyncThunk<Board, string>(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId: string) => {
    return await BoardService.getBoardById(boardId);
  }
);

// Redux slice for active board
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action: PayloadAction<Board>) => {
      state.currentActiveBoard = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ActiveBoardState>) => {
    builder.addCase(
      fetchBoardDetailsAPI.fulfilled,
      (state, action: PayloadAction<Board>) => {
        const board = action.payload;

        // Sort columns based on columnOrderIds
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');

        // Process each column
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            // Add placeholder card for empty columns (for drag-and-drop functionality)
            const placeholderCard = generatePlaceholderCard(column);
            column.cards = [placeholderCard];
            column.cardOrderIds = [placeholderCard._id];
          } else {
            // Sort cards based on cardOrderIds
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
          }
        });

        state.currentActiveBoard = board;
      }
    );
  },
});

// Action exports
export const { updateCurrentActiveBoard } = activeBoardSlice.actions;

// Selector with proper RootState typing
export const selectCurrentActiveBoard = (state: {
  activeBoard: ActiveBoardState;
}): Board | null => {
  return state.activeBoard.currentActiveBoard;
};

// Reducer export
export const activeBoardReducer = activeBoardSlice.reducer;
