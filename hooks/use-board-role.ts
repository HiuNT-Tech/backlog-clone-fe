import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/user/userSlice';
import { selectCurrentActiveBoard } from '@/redux/activeBoard/activeBoardSlice';
import { MemberRole } from '@/config/enum';
import type { BoardMemberRole, EntityId } from '@/config/interface';

/**
 * Tầng quyền board-level, PHẢI khớp với BE
 * (backlog-be `board-access.service.ts`):
 *  - Manager     = ADMIN, PM         → quản lý board & sub-resource
 *  - Contributor = ADMIN, PM, MEMBER → tạo/sửa nội dung (GUEST chỉ đọc)
 */
const MANAGER_ROLES: BoardMemberRole[] = [
  MemberRole.ADMINISTRATOR,
  MemberRole.PROJECT_MANAGER,
];
const CONTRIBUTOR_ROLES: BoardMemberRole[] = [
  MemberRole.ADMINISTRATOR,
  MemberRole.PROJECT_MANAGER,
  MemberRole.MEMBER,
];

export interface RoleFlags {
  role: BoardMemberRole | null;
  isManager: boolean;
  isContributor: boolean;
  isGuest: boolean;
}

/**
 * Suy ra các cờ quyền từ một vai trò cụ thể. Dùng chung cho hook (nguồn
 * activeBoard) và cho những màn chỉ có sẵn danh sách member (vd issue detail
 * dùng `useUserBoard`). Trả về không-quyền khi role null.
 */
export const getRoleFlags = (role: BoardMemberRole | null): RoleFlags => {
  if (!role) {
    return {
      role: null,
      isManager: false,
      isContributor: false,
      isGuest: false,
    };
  }
  return {
    role,
    isManager: MANAGER_ROLES.includes(role),
    isContributor: CONTRIBUTOR_ROLES.includes(role),
    isGuest: role === MemberRole.GUEST,
  };
};

export interface BoardRoleInfo {
  /** Vai trò của người dùng hiện tại trên board, hoặc null khi chưa biết. */
  role: BoardMemberRole | null;
  /** ADMIN hoặc PM — được quản lý board (settings, member, invitation...). */
  isManager: boolean;
  /** ADMIN/PM/MEMBER — được tạo/sửa card, comment (GUEST = false). */
  isContributor: boolean;
  isGuest: boolean;
  /** true khi đã xác định được vai trò (board + user đã load xong). */
  isReady: boolean;
}

/**
 * Suy ra vai trò của người dùng hiện tại trên board đang mở.
 *
 * Nguồn dữ liệu: `selectCurrentActiveBoard` (đã có `members` đầy đủ, không phân
 * trang) join với `selectCurrentUser`. Truyền `boardId` để tránh dùng nhầm role
 * của board cũ còn sót trong store khi vừa chuyển board.
 *
 * Trong lúc chưa xác định được (`isReady === false`) nên coi như KHÔNG có quyền
 * để tránh chớp nút rồi mới ẩn.
 */
export const useBoardRole = (boardId?: EntityId): BoardRoleInfo => {
  const currentUser = useSelector(selectCurrentUser);
  const activeBoard = useSelector(selectCurrentActiveBoard);

  return useMemo<BoardRoleInfo>(() => {
    const notReady: BoardRoleInfo = {
      role: null,
      isManager: false,
      isContributor: false,
      isGuest: false,
      isReady: false,
    };

    if (!currentUser || !activeBoard) return notReady;
    // Board trong store không phải board đang yêu cầu → coi như chưa load.
    if (boardId != null && activeBoard.id !== boardId) return notReady;

    const member = activeBoard.members?.find(m => m.userId === currentUser.id);
    if (!member) return notReady;

    return { ...getRoleFlags(member.role), isReady: true };
  }, [currentUser, activeBoard, boardId]);
};
