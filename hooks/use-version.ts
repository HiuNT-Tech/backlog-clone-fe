import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { VersionService } from '@/lib/apis/version';
import { toastHelpers } from '@/hooks/use-toast';
import type {
  Version,
  CreateVersionRequest,
  EntityId,
  UpdateVersionRequest,
} from '@/config/interface';

export const useVersion = (
  boardId?: EntityId,
  params?: Record<string, any>
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data = { items: [], count: 0 },
    isLoading,
    error: versionsError,
    refetch: refetchVersions,
  } = useQuery({
    queryKey: ['versions', boardId, params],
    queryFn: () => VersionService.getList(boardId, params),
    enabled: !!boardId,
  });

  const {
    mutateAsync: createNewVersion,
    isPending: isCreatePending,
    error: createNewVersionError,
  } = useMutation({
    mutationFn: (payload: CreateVersionRequest): Promise<Version> =>
      VersionService.createNew(boardId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', boardId] });
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
      id: EntityId;
      payload: UpdateVersionRequest;
    }): Promise<Version> => VersionService.update(boardId!, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', boardId] });
    },
  });

  const {
    mutateAsync: deleteVersion,
    isPending: isDeletePending,
    error: deleteVersionError,
  } = useMutation({
    mutationFn: (id: EntityId) => VersionService.delete(boardId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', boardId] });
    },
  });

  return {
    versions: data.items,
    totalCount: data.count,
    isLoading,
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
