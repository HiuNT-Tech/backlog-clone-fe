import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { VersionService } from '@/lib/apis/version';
import { toastHelpers } from '@/hooks/use-toast';
import type {
  Version,
  CreateVersionRequest,
  UpdateVersionRequest,
} from '@/config/interface';

export const useVersion = (boardId?: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: versions = [],
    isLoading: isLoadingList,
    error: versionsError,
    refetch: refetchVersions,
  } = useQuery({
    queryKey: ['versions', boardId],
    queryFn: () => VersionService.getList(boardId),
    enabled: !!boardId,
  });

  const {
    mutateAsync: createNewVersion,
    isPending: isCreatePending,
    error: createNewVersionError,
  } = useMutation({
    mutationFn: (payload: CreateVersionRequest): Promise<Version> =>
      VersionService.createNew({ ...payload, boardId: boardId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', boardId] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  const {
    mutateAsync: updateVersion,
    isPending: isUpdatePending,
    error: updateVersionError,
  } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateVersionRequest;
    }): Promise<Version> => VersionService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', boardId] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  const {
    mutateAsync: deleteVersion,
    isPending: isDeletePending,
    error: deleteVersionError,
  } = useMutation({
    mutationFn: (id: string) => VersionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', boardId] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  return {
    versions,
    isLoadingList,
    versionsError,
    refetchVersions,

    createNewVersion,
    isCreatePending,
    createNewVersionError,

    updateVersion,
    isUpdatePending,
    updateVersionError,

    deleteVersion,
    isDeletePending,
    deleteVersionError,
  };
};
