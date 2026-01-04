import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { mockData } from '@/lib/apis/mock-data';
import { mapOrder } from '@/utils/sorts';
import { isEmpty } from 'lodash';
import { generatePlaceholderCard } from '@/utils/formatters';
import type { Board, ActiveBoardState } from '@/config/interface';

// Initial state with proper typing
const initialState: ActiveBoardState = {
  currentActiveBoard: null,
};

// Async thunk for fetching board details (currently using mock data)
export const fetchBoardDetailsAPI = createAsyncThunk<Board, string>(
  'activeBoard/fetchBoardDetailsAPI',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_boardId: string) => {
    // TODO: Replace with actual API call
    // const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    // return response.data
    return Promise.resolve(mockData.board as Board);
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
