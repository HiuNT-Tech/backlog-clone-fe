import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { sortByPosition } from '@/utils/sorts';
import type { Board, ActiveBoardState, EntityId } from '@/config/interface';
import { BoardService } from '@/lib/apis/board';

// Initial state with proper typing
const initialState: ActiveBoardState = {
  currentActiveBoard: null,
};
// Async thunk for fetching board details
export const fetchBoardDetailsAPI = createAsyncThunk<Board, EntityId>(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId: EntityId) => {
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

        board.columns = sortByPosition(board.columns);

        board.columns.forEach(column => {
          column.cards = sortByPosition(column.cards);
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
