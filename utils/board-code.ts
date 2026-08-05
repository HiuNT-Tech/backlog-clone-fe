/**
 * Mã project (`boardCode`) ở BE bắt buộc khớp `^[A-Z0-9_-]+$` và dài 2–16 ký tự
 * (xem `CreateBoardDto` / `DuplicateBoardDto` / `CreateSampleBoardDto` trong
 * backlog-be). Giữ các quy tắc đó ở một chỗ để form validate giống BE, tránh
 * cảnh gửi lên rồi mới nhận 400 với thông báo chung chung.
 */
export const BOARD_CODE_PATTERN = /^[A-Z0-9_-]+$/;
export const BOARD_CODE_MIN_LENGTH = 2;
export const BOARD_CODE_MAX_LENGTH = 16;

/**
 * Biến tên project tự do thành mã hợp lệ để điền sẵn giúp người dùng: bỏ dấu
 * tiếng Việt, viết hoa, mọi ký tự không phải chữ/số thành '-'.
 *
 * Kết quả có thể ngắn hơn 2 ký tự (ví dụ tên chỉ gồm ký tự đặc biệt) — khi đó
 * zod trong `create-board-form-schemas` sẽ báo lỗi ngay dưới ô input.
 */
export const toBoardCode = (title: string): string =>
  title
    // 'đ'/'Đ' là code point riêng, `normalize('NFD')` không tách ra dấu được
    // nên phải thay thủ công trước.
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    // Dải dấu thanh/dấu phụ mà NFD tách ra (combining diacritical marks).
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .slice(0, BOARD_CODE_MAX_LENGTH)
    .replace(/^-+|-+$/g, '');
