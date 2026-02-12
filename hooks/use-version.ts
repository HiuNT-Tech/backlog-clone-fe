import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { VersionService } from '@/lib/apis/version';
import { toastHelpers } from '@/hooks/use-toast';
import type {
  Version,
  CreateVersionRequest,
  UpdateVersionRequest,
} from '@/config/interface';

export const useVersion = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: versions = [],
    isLoading: isLoadingList,
    error: versionsError,
    refetch: refetchVersions,
  } = useQuery({
    queryKey: ['versions'],
    queryFn: () => VersionService.getList(),
  });

  const {
    mutateAsync: createNewVersion,
    isPending: isCreatePending,
    error: createNewVersionError,
  } = useMutation({
    mutationFn: (payload: CreateVersionRequest): Promise<Version> =>
      VersionService.createNew(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions'] });
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
      queryClient.invalidateQueries({ queryKey: ['versions'] });
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
      queryClient.invalidateQueries({ queryKey: ['versions'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  return {
    versions: versions,
    isLoadingList: isLoadingList,
    versionsError: versionsError,
    refetchVersions: refetchVersions,

    createNewVersion: createNewVersion,
    isCreatePending: isCreatePending,
    createNewVersionError: createNewVersionError,

    updateVersion: updateVersion,
    isUpdatePending: isUpdatePending,
    updateVersionError: updateVersionError,

    deleteVersion: deleteVersion,
    isDeletePending: isDeletePending,
    deleteVersionError: deleteVersionError,
  };
};
