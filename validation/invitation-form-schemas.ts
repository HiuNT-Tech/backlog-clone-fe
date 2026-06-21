import { z } from 'zod';
import i18n from '@/i18n';
import { MemberRole } from '@/config/enum';
import type { BoardMemberRole } from '@/config/interface';

const INVITATION_ROLE_VALUES = [
  MemberRole.MEMBER,
  MemberRole.PROJECT_MANAGER,
  MemberRole.GUEST,
  MemberRole.ADMINISTRATOR,
] as unknown as [BoardMemberRole, ...BoardMemberRole[]];

export const invitationFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, i18n.t('validation.fieldRequired'))
    .email(i18n.t('validation.email')),
  role: z.enum(INVITATION_ROLE_VALUES, {
    required_error: i18n.t('settings.invitations.validation.roleRequired'),
  }),
});

export type InvitationFormData = z.infer<typeof invitationFormSchema>;
