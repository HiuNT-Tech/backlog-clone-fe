/**
 * YouTube: TrungQuanDev - Một Lập Trình Viên
 * Created by trungquandev.com's author on Jun 28, 2023
 */
/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val: string) => {
  if (!val) return '';
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

/**
 * Video 37.2 hàm generatePlaceholderCard: Cách xử lý bug logic thư viện Dnd-kit khi Column là rỗng:
 * Phía FE sẽ tự tạo ra một cái card đặc biệt: Placeholder Card, không liên quan tới Back-end
 * Card đặc biệt này sẽ được ẩn ở giao diện UI người dùng.
 * Cấu trúc Id dùng số âm để không trùng với id autoincrement từ database.
 * Quan trọng khi tạo: phải đầy đủ: (id, boardId, columnId, position, FE_PlaceholderCard)
 */
export const generatePlaceholderCard = (column: any) => {
  return {
    id: -Number(column.id),
    boardId: column.boardId,
    columnId: column.id,
    position: 0,
    FE_PlaceholderCard: true,
  };
};
