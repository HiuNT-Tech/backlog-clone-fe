# Trello-FE API Documentation

Tài liệu này mô tả chi tiết toàn bộ logic API được sử dụng trong dự án Trello-FE, bao gồm cách cấu hình Axios, các endpoint API, payload truyền vào và cách xử lý response.

---

## 1. Cấu Hình Axios Instance

**File:** `src/utils/authorizeAxios.js`

```javascript
import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "~/utils/formatters";

// Khởi tạo Axios instance với cấu hình chung
let authorizedAxiosInstance = axios.create();

// Thời gian chờ tối đa của 1 request: 10 phút
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000;

// Cho phép gửi cookie trong mỗi request (JWT tokens trong httpOnly Cookie)
authorizedAxiosInstance.defaults.withCredentials = true;

// Request Interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    interceptorLoadingElements(true); // Chặn spam click
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false); // Mở lại các element
    return response;
  },
  (error) => {
    interceptorLoadingElements(false);
    let errorMessage = error?.message;
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    // Hiển thị lỗi (trừ mã 410 - refresh token)
    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }
    return Promise.reject(errorMessage);
  },
);

export default authorizedAxiosInstance;
```

### Chức năng chính:

- **Timeout:** 10 phút
- **withCredentials:** `true` - tự động gửi cookie chứa JWT tokens
- **Request Interceptor:** Chặn spam click bằng cách disable các element có class `interceptor-loading`
- **Response Interceptor:** Xử lý lỗi tập trung, hiển thị toast error

---

## 2. Cấu Hình API Root

**File:** `src/utils/constants.js`

```javascript
let apiRoot = "";

// Development
if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017";
}

// Production
if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://trello-api-0gbu.onrender.com";
}

export const API_ROOT = apiRoot;
```

---

## 3. Danh Sách Các API Endpoints

**File:** `src/apis/index.js`

### 3.1. Board APIs

#### 3.1.1. Lấy chi tiết Board (Redux Async Thunk)

**File:** `src/redux/activeBoard/activeBoardSlice.js`

| Thuộc tính   | Giá trị                                |
| ------------ | -------------------------------------- |
| **Method**   | `GET`                                  |
| **Endpoint** | `/v1/boards/{boardId}`                 |
| **Payload**  | Không có (chỉ cần `boardId` trong URL) |

**Cách gọi:**

```javascript
import { fetchBoardDetailsAPI } from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch } from "react-redux";

const dispatch = useDispatch();

useEffect(() => {
  dispatch(fetchBoardDetailsAPI(boardId));
}, [dispatch, boardId]);
```

**Response xử lý:**

```javascript
// Trong extraReducers của Redux Slice
builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
  let board = action.payload;

  // Sắp xếp columns theo columnOrderIds
  board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

  // Sắp xếp cards và xử lý column rỗng
  board.columns.forEach((column) => {
    if (isEmpty(column.cards)) {
      column.cards = [generatePlaceholderCard(column)];
      column.cardOrderIds = [generatePlaceholderCard(column)._id];
    } else {
      column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
    }
  });

  state.currentActiveBoard = board;
});
```

---

#### 3.1.2. Cập nhật Board Details

| Thuộc tính   | Giá trị                |
| ------------ | ---------------------- |
| **Method**   | `PUT`                  |
| **Endpoint** | `/v1/boards/{boardId}` |

**Function:**

```javascript
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData,
  );
  return response.data;
};
```

**Payload mẫu - Cập nhật thứ tự columns:**

```javascript
{
  columnOrderIds: ["column-id-1", "column-id-2", "column-id-3"];
}
```

**Cách gọi (khi kéo thả column):**

```javascript
// File: src/pages/Boards/_id.jsx
const moveColumns = (dndOrderedColumns) => {
  const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);

  // Update state trước
  const newBoard = cloneDeep(board);
  newBoard.columns = dndOrderedColumns;
  newBoard.columnOrderIds = dndOrderedColumnsIds;
  dispatch(updateCurrentActiveBoard(newBoard));

  // Gọi API
  updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds });
};
```

---

#### 3.1.3. Di chuyển Card sang Column khác

| Thuộc tính   | Giá trị                           |
| ------------ | --------------------------------- |
| **Method**   | `PUT`                             |
| **Endpoint** | `/v1/boards/supports/moving_card` |

**Function:**

```javascript
export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData,
  );
  return response.data;
};
```

**Payload:**

```javascript
{
  currentCardId: 'card-id-xxx',      // ID của card đang di chuyển
  prevColumnId: 'column-id-old',     // ID column cũ
  prevCardOrderIds: ['card-1', 'card-2'], // Mảng cardOrderIds mới của column cũ
  nextColumnId: 'column-id-new',     // ID column mới
  nextCardOrderIds: ['card-3', 'card-xxx', 'card-4'] // Mảng cardOrderIds mới của column mới
}
```

**Cách gọi:**

```javascript
// File: src/pages/Boards/_id.jsx
const moveCardToDifferentColumn = (
  currentCardId,
  prevColumnId,
  nextColumnId,
  dndOrderedColumns,
) => {
  // Update state trước
  const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
  const newBoard = cloneDeep(board);
  newBoard.columns = dndOrderedColumns;
  newBoard.columnOrderIds = dndOrderedColumnsIds;
  dispatch(updateCurrentActiveBoard(newBoard));

  // Xử lý prevCardOrderIds (loại bỏ placeholder card)
  let prevCardOrderIds = dndOrderedColumns.find(
    (c) => c._id === prevColumnId,
  )?.cardOrderIds;
  if (prevCardOrderIds[0].includes("placeholder-card")) {
    prevCardOrderIds = [];
  }

  // Gọi API
  moveCardToDifferentColumnAPI({
    currentCardId,
    prevColumnId,
    prevCardOrderIds,
    nextColumnId,
    nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
      ?.cardOrderIds,
  });
};
```

---

### 3.2. Column APIs

#### 3.2.1. Tạo Column mới

| Thuộc tính   | Giá trị       |
| ------------ | ------------- |
| **Method**   | `POST`        |
| **Endpoint** | `/v1/columns` |

**Function:**

```javascript
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/columns`,
    newColumnData,
  );
  return response.data;
};
```

**Payload:**

```javascript
{
  title: 'Column Title',    // Tên column
  boardId: 'board-id-xxx'   // ID của board chứa column
}
```

**Cách gọi và xử lý response:**

```javascript
// File: src/pages/Boards/BoardContent/ListColumns/ListColumns.jsx
const addNewColumn = async () => {
  if (!newColumnTitle) {
    toast.error("Please enter Column Title!");
    return;
  }

  // Gọi API
  const createdColumn = await createNewColumnAPI({
    title: newColumnTitle,
    boardId: board._id,
  });

  // Tạo placeholder card cho column mới (column rỗng)
  createdColumn.cards = [generatePlaceholderCard(createdColumn)];
  createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

  // Cập nhật state
  const newBoard = cloneDeep(board);
  newBoard.columns.push(createdColumn);
  newBoard.columnOrderIds.push(createdColumn._id);
  dispatch(updateCurrentActiveBoard(newBoard));

  // Reset form
  toggleOpenNewColumnForm();
  setNewColumnTitle("");
};
```

**Response mẫu:**

```javascript
{
  _id: 'column-id-xxx',
  boardId: 'board-id-xxx',
  title: 'Column Title',
  cardOrderIds: [],
  cards: []
}
```

---

#### 3.2.2. Cập nhật Column Details

| Thuộc tính   | Giá trị                  |
| ------------ | ------------------------ |
| **Method**   | `PUT`                    |
| **Endpoint** | `/v1/columns/{columnId}` |

**Function:**

```javascript
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData,
  );
  return response.data;
};
```

**Payload mẫu - Cập nhật thứ tự cards:**

```javascript
{
  cardOrderIds: ["card-id-1", "card-id-2", "card-id-3"];
}
```

**Cách gọi (khi kéo thả card trong cùng column):**

```javascript
// File: src/pages/Boards/_id.jsx
const moveCardInTheSameColumn = (
  dndOrderedCards,
  dndOrderedCardIds,
  columnId,
) => {
  // Update state trước
  const newBoard = cloneDeep(board);
  const columnToUpdate = newBoard.columns.find(
    (column) => column._id === columnId,
  );
  if (columnToUpdate) {
    columnToUpdate.cards = dndOrderedCards;
    columnToUpdate.cardOrderIds = dndOrderedCardIds;
  }
  dispatch(updateCurrentActiveBoard(newBoard));

  // Gọi API
  updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds });
};
```

---

#### 3.2.3. Xóa Column

| Thuộc tính   | Giá trị                  |
| ------------ | ------------------------ |
| **Method**   | `DELETE`                 |
| **Endpoint** | `/v1/columns/{columnId}` |

**Function:**

```javascript
export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`,
  );
  return response.data;
};
```

**Cách gọi:**

```javascript
// File: src/pages/Boards/BoardContent/ListColumns/Column/Column.jsx
const handleDeleteColumn = () => {
  confirmDeleteColumn({
    title: "Delete Column?",
    description:
      "This action will permanently delete your Column and its Cards!",
    confirmationText: "Confirm",
    cancellationText: "Cancel",
  }).then(() => {
    // Update state trước
    const newBoard = cloneDeep(board);
    newBoard.columns = newBoard.columns.filter((c) => c._id !== column._id);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== column._id,
    );
    dispatch(updateCurrentActiveBoard(newBoard));

    // Gọi API
    deleteColumnDetailsAPI(column._id).then((res) => {
      toast.success(res?.deleteResult);
    });
  });
};
```

**Response mẫu:**

```javascript
{
  deleteResult: "Column and its Cards deleted successfully!";
}
```

---

### 3.3. Card APIs

#### 3.3.1. Tạo Card mới

| Thuộc tính   | Giá trị     |
| ------------ | ----------- |
| **Method**   | `POST`      |
| **Endpoint** | `/v1/cards` |

**Function:**

```javascript
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/cards`,
    newCardData,
  );
  return response.data;
};
```

**Payload:**

```javascript
{
  title: 'Card Title',        // Tên card
  columnId: 'column-id-xxx',  // ID của column chứa card
  boardId: 'board-id-xxx'     // ID của board
}
```

**Cách gọi và xử lý response:**

```javascript
// File: src/pages/Boards/BoardContent/ListColumns/Column/Column.jsx
const addNewCard = async () => {
  if (!newCardTitle) {
    toast.error("Please enter Card Title!", { position: "bottom-right" });
    return;
  }

  // Gọi API
  const createdCard = await createNewCardAPI({
    title: newCardTitle,
    columnId: column._id,
    boardId: board._id,
  });

  // Cập nhật state
  const newBoard = cloneDeep(board);
  const columnToUpdate = newBoard.columns.find(
    (col) => col._id === createdCard.columnId,
  );

  if (columnToUpdate) {
    // Nếu column đang rỗng (có placeholder card)
    if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
      columnToUpdate.cards = [createdCard];
      columnToUpdate.cardOrderIds = [createdCard._id];
    } else {
      columnToUpdate.cards.push(createdCard);
      columnToUpdate.cardOrderIds.push(createdCard._id);
    }
  }

  dispatch(updateCurrentActiveBoard(newBoard));

  // Reset form
  toggleOpenNewCardForm();
  setNewCardTitle("");
};
```

**Response mẫu:**

```javascript
{
  _id: 'card-id-xxx',
  boardId: 'board-id-xxx',
  columnId: 'column-id-xxx',
  title: 'Card Title',
  description: null,
  cover: null,
  memberIds: [],
  comments: [],
  attachments: []
}
```

---

### 3.4. User APIs

#### 3.4.1. Đăng ký tài khoản

| Thuộc tính   | Giá trị              |
| ------------ | -------------------- |
| **Method**   | `POST`               |
| **Endpoint** | `/v1/users/register` |

**Function:**

```javascript
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data,
  );
  toast.success(
    "Account created successfully! Please check and verify your account before logging in!",
    { theme: "colored" },
  );
  return response.data;
};
```

**Payload:**

```javascript
{
  email: 'user@example.com',
  password: 'password123'
}
```

**Cách gọi:**

```javascript
// File: src/pages/Auth/RegisterForm.jsx
const submitRegister = (data) => {
  const { email, password } = data;

  toast
    .promise(registerUserAPI({ email, password }), {
      pending: "Registering...",
    })
    .then((user) => {
      navigate(`/login?registeredEmail=${user.email}`);
    });
};
```

**Response mẫu:**

```javascript
{
  _id: 'user-id-xxx',
  email: 'user@example.com',
  // ... other user fields
}
```

---

#### 3.4.2. Xác thực tài khoản

| Thuộc tính   | Giá trị            |
| ------------ | ------------------ |
| **Method**   | `PUT`              |
| **Endpoint** | `/v1/users/verify` |

**Function:**

```javascript
export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data,
  );
  toast.success(
    "Account verified successfully! Now you can login to enjoy our services!",
    { theme: "colored" },
  );
  return response.data;
};
```

**Payload:**

```javascript
{
  email: 'user@example.com',
  token: 'verification-token-xxx'
}
```

**Cách gọi:**

```javascript
// File: src/pages/Auth/AccountVerification.jsx
const [verified, setVerified] = useState(false);
let [searchParams] = useSearchParams();
const { email, token } = Object.fromEntries([...searchParams]);

useEffect(() => {
  if (email && token) {
    verifyUserAPI({ email, token }).then(() => {
      setVerified(true);
    });
  }
}, [email, token]);

// Sau khi verified thành công
if (verified) {
  return <Navigate to={`/login?verifiedEmail=${email}`} />;
}
```

---

## 4. Redux State Management

### 4.1. Store Configuration

**File:** `src/redux/store.js`

```javascript
import { configureStore } from "@reduxjs/toolkit";
import { activeBoardReducer } from "~/redux/activeBoard/activeBoardSlice";

const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer,
  },
});

export default store;
```

### 4.2. Active Board Slice

**File:** `src/redux/activeBoard/activeBoardSlice.js`

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  currentActiveBoard: null,
};

// Async Thunk để fetch board
export const fetchBoardDetailsAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailsAPI",
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`,
    );
    return response.data;
  },
);

// Slice
export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  reducers: {
    // Action đồng bộ để update board
    updateCurrentActiveBoard: (state, action) => {
      state.currentActiveBoard = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Xử lý response từ async thunk
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      let board = action.payload;
      // Sắp xếp columns và cards...
      state.currentActiveBoard = board;
    });
  },
});

// Export actions và selector
export const { updateCurrentActiveBoard } = activeBoardSlice.actions;
export const selectCurrentActiveBoard = (state) =>
  state.activeBoard.currentActiveBoard;
export const activeBoardReducer = activeBoardSlice.reducer;
```

### 4.3. Cách sử dụng trong Component

```javascript
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";

function MyComponent() {
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);

  // Fetch data khi mount
  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId));
  }, [dispatch, boardId]);

  // Update state đồng bộ
  const updateBoard = (newBoard) => {
    dispatch(updateCurrentActiveBoard(newBoard));
  };
}
```

---

## 5. Utility Functions

### 5.1. Sắp xếp mảng theo order

**File:** `src/utils/sorts.js`

```javascript
export const mapOrder = (originalArray, orderArray, key) => {
  if (!originalArray || !orderArray || !key) return [];
  return [...originalArray].sort(
    (a, b) => orderArray.indexOf(a[key]) - orderArray.indexOf(b[key]),
  );
};
```

**Ví dụ sử dụng:**

```javascript
// Sắp xếp columns theo columnOrderIds
board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

// Sắp xếp cards theo cardOrderIds
column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
```

### 5.2. Tạo Placeholder Card

**File:** `src/utils/formatters.js`

```javascript
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
  };
};
```

### 5.3. Chặn Spam Click

**File:** `src/utils/formatters.js`

```javascript
export const interceptorLoadingElements = (calling) => {
  const elements = document.querySelectorAll(".interceptor-loading");
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      elements[i].style.opacity = "0.5";
      elements[i].style.pointerEvents = "none";
    } else {
      elements[i].style.opacity = "initial";
      elements[i].style.pointerEvents = "initial";
    }
  }
};
```

**Cách sử dụng:**

```jsx
<Button className="interceptor-loading" onClick={handleSubmit}>
  Submit
</Button>
```

---

## 6. Validation Rules

**File:** `src/utils/validators.js`

```javascript
export const FIELD_REQUIRED_MESSAGE = "This field is required.";
export const EMAIL_RULE = /^\S+@\S+\.\S+$/;
export const EMAIL_RULE_MESSAGE =
  "Email is invalid. (example@trungquandev.com)";
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/;
export const PASSWORD_RULE_MESSAGE =
  "Password must include at least 1 letter, a number, and at least 8 characters.";
export const PASSWORD_CONFIRMATION_MESSAGE =
  "Password Confirmation does not match!";

// File validation
export const LIMIT_COMMON_FILE_SIZE = 10485760; // 10 MB
export const ALLOW_COMMON_FILE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return "File cannot be blank.";
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return "Maximum file size exceeded. (10MB)";
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return "File type is invalid. Only accept jpg, jpeg and png";
  }
  return null;
};
```

---

## 7. Data Models

### 7.1. Board Model

```javascript
{
  _id: 'board-id-xxx',
  title: 'Board Title',
  description: 'Board Description',
  type: 'public', // hoặc 'private'
  ownerIds: ['user-id-1'],
  memberIds: ['user-id-2', 'user-id-3'],
  columnOrderIds: ['column-id-1', 'column-id-2'],
  columns: [/* Array of Column objects */]
}
```

### 7.2. Column Model

```javascript
{
  _id: 'column-id-xxx',
  boardId: 'board-id-xxx',
  title: 'Column Title',
  cardOrderIds: ['card-id-1', 'card-id-2'],
  cards: [/* Array of Card objects */]
}
```

### 7.3. Card Model

```javascript
{
  _id: 'card-id-xxx',
  boardId: 'board-id-xxx',
  columnId: 'column-id-xxx',
  title: 'Card Title',
  description: 'Card Description (Markdown)',
  cover: 'https://example.com/image.jpg', // URL ảnh cover
  memberIds: ['user-id-1'],
  comments: ['comment 1', 'comment 2'],
  attachments: ['attachment 1', 'attachment 2']
}
```

### 7.4. Placeholder Card (FE Only)

```javascript
{
  _id: 'column-id-xxx-placeholder-card',
  boardId: 'board-id-xxx',
  columnId: 'column-id-xxx',
  FE_PlaceholderCard: true // Flag đánh dấu đây là placeholder
}
```

---

## 8. Routing Structure

**File:** `src/App.jsx`

| Route                   | Component                     | Mô tả                |
| ----------------------- | ----------------------------- | -------------------- |
| `/`                     | `Navigate → /boards/:boardId` | Redirect mặc định    |
| `/boards/:boardId`      | `Board`                       | Trang chi tiết board |
| `/login`                | `Auth`                        | Trang đăng nhập      |
| `/register`             | `Auth`                        | Trang đăng ký        |
| `/account/verification` | `AccountVerification`         | Xác thực tài khoản   |
| `*`                     | `NotFound`                    | Trang 404            |

---

## 9. Tổng Kết API Endpoints

| #   | Method | Endpoint                          | Mô tả                           |
| --- | ------ | --------------------------------- | ------------------------------- |
| 1   | GET    | `/v1/boards/{boardId}`            | Lấy chi tiết board              |
| 2   | PUT    | `/v1/boards/{boardId}`            | Cập nhật board (columnOrderIds) |
| 3   | PUT    | `/v1/boards/supports/moving_card` | Di chuyển card sang column khác |
| 4   | POST   | `/v1/columns`                     | Tạo column mới                  |
| 5   | PUT    | `/v1/columns/{columnId}`          | Cập nhật column (cardOrderIds)  |
| 6   | DELETE | `/v1/columns/{columnId}`          | Xóa column                      |
| 7   | POST   | `/v1/cards`                       | Tạo card mới                    |
| 8   | POST   | `/v1/users/register`              | Đăng ký tài khoản               |
| 9   | PUT    | `/v1/users/verify`                | Xác thực tài khoản              |

---

## 10. Thư Viện Sử Dụng

| Thư viện              | Mục đích                               |
| --------------------- | -------------------------------------- |
| `axios`               | HTTP client                            |
| `@reduxjs/toolkit`    | State management                       |
| `react-redux`         | React Redux bindings                   |
| `react-router-dom`    | Routing                                |
| `react-toastify`      | Toast notifications                    |
| `@dnd-kit/core`       | Drag and drop                          |
| `@dnd-kit/sortable`   | Sortable drag and drop                 |
| `@mui/material`       | UI components                          |
| `material-ui-confirm` | Confirm dialogs                        |
| `lodash`              | Utility functions (cloneDeep, isEmpty) |
| `react-hook-form`     | Form handling                          |

---

> **Lưu ý:** Tài liệu này được tạo dựa trên phân tích source code của dự án Trello-FE. Khi clone sang project mới, hãy đảm bảo cập nhật `API_ROOT` phù hợp với backend của bạn.
