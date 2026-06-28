import { sendDelete, sendGet, sendPost } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import type {
  BoardInvitation,
  CreateInvitationRequest,
  EntityId,
  InvitationListParams,
  InvitationListResponse,
  MyInvitationListResponse,
} from '@/config/interface';

export const InvitationService = {
  createBoardInvitation: async (
    boardId: EntityId,
    payload: CreateInvitationRequest
  ): Promise<BoardInvitation> => {
    return await sendPost(
      `${API_ROOT}/v1/boards/${boardId}/invitations`,
      payload
    );
  },

  getBoardInvitations: async (
    boardId: EntityId,
    params?: InvitationListParams
  ): Promise<InvitationListResponse> => {
    return await sendGet(
      `${API_ROOT}/v1/boards/${boardId}/invitations`,
      params
    );
  },

  revokeBoardInvitation: async (
    boardId: EntityId,
    invitationId: EntityId
  ): Promise<BoardInvitation> => {
    return await sendDelete(
      `${API_ROOT}/v1/boards/${boardId}/invitations/${invitationId}`
    );
  },

  resendBoardInvitation: async (
    boardId: EntityId,
    invitationId: EntityId
  ): Promise<BoardInvitation> => {
    return await sendPost(
      `${API_ROOT}/v1/boards/${boardId}/invitations/${invitationId}/resend`
    );
  },

  getInvitationByToken: async (token: string): Promise<BoardInvitation> => {
    return await sendGet(`${API_ROOT}/v1/invitations/${token}`);
  },

  acceptInvitation: async (token: string): Promise<BoardInvitation> => {
    return await sendPost(`${API_ROOT}/v1/invitations/${token}/accept`);
  },

  declineInvitation: async (token: string): Promise<BoardInvitation> => {
    return await sendPost(`${API_ROOT}/v1/invitations/${token}/decline`);
  },

  getMyInvitations: async (): Promise<MyInvitationListResponse> => {
    return await sendGet(`${API_ROOT}/v1/me/invitations`);
  },
};
