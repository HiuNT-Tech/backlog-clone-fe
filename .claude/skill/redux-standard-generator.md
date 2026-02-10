---
description: Standard workflow for creating new Redux slices using Redux Toolkit in this project.
---

# Redux Standard Generator

This skill defines the standard pattern for creating new Redux slices to ensure consistency across the project.

## 1. File Structure
-   Each feature should have its own directory under `redux/` (e.g., `redux/user/`).
-   The slice file should be named `[featureName]Slice.ts` (e.g., `userSlice.ts`).
-   The directory should roughly correspond to the domain.

## 2. Dependencies
Ensure you import from `@reduxjs/toolkit`.

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
```

## 3. Standard Template

Use the following template for new slices. Replace `[FeatureName]`, `[featureName]`, `[InitialStateType]` with appropriate values.

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Import necessary types and API services
// import { [FeatureName]Service } from '@/lib/apis/[featureName]';

// 1. Define State Interface
export interface [FeatureName]State {
  current[FeatureName]: any | null; // Replace 'any' with specific type
  loading: boolean;
  error: string | null;
}

// 2. Initial State
const initialState: [FeatureName]State = {
  current[FeatureName]: null,
  loading: false,
  error: null,
};

// 3. Async Thunks (Optional)
// Naming convention: [featureName]/[actionName]
export const fetch[FeatureName]Details = createAsyncThunk(
  '[featureName]/fetchDetails',
  async (id: string, thunkAPI) => {
    // const response = await [FeatureName]Service.getById(id);
    // return response;
    return { id, name: 'Sample Data' }; // Mock return
  }
);

// 4. Create Slice
export const [featureName]Slice = createSlice({
  name: '[featureName]',
  initialState,
  reducers: {
    // Synchronous reducers
    update[FeatureName]: (state, action: PayloadAction<any>) => {
      state.current[FeatureName] = action.payload;
    },
    reset[FeatureName]: (state) => {
      state.current[FeatureName] = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Async Thunk Lifecycle
      .addCase(fetch[FeatureName]Details.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch[FeatureName]Details.fulfilled, (state, action) => {
        state.loading = false;
        state.current[FeatureName] = action.payload;
      })
      .addCase(fetch[FeatureName]Details.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

// 5. Exports
// Actions
export const { update[FeatureName], reset[FeatureName] } = [featureName]Slice.actions;

// Selectors
export const select[FeatureName] = (state: { [featureName]: [FeatureName]State }) => state.[featureName].current[FeatureName];
export const select[FeatureName]Loading = (state: { [featureName]: [FeatureName]State }) => state.[featureName].loading;

// Reducer
export const [featureName]Reducer = [featureName]Slice.reducer;
```

## 4. Integration Steps
After creating the slice:
1.  Open `redux/store.ts`.
2.  Import the new reducer: `import { [featureName]Reducer } from '@/redux/[featureName]/[featureName]Slice';`
3.  Add it to the `configureStore` reducer object.

```typescript
export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer,
    [featureName]: [featureName]Reducer, // Add new reducer here
  },
});
```
