import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IssueTypeService } from '@/lib/apis/issueType';
import { toastHelpers } from '@/hooks/use-toast';
import type { CreateIssueTypeRequest, IssueType } from '@/config/interface';

export const useIssueType = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: issueTypes = [],
    isLoading: isLoadingList,
    error: issueTypesError,
    refetch: refetchIssueTypes,
  } = useQuery({
    queryKey: ['issue-types'],
    queryFn: () => IssueTypeService.getList(),
  });
  const {
    mutateAsync: createNewIssueType,
    isPending: isCreatePending,
    error: createNewIssueTypeError,
  } = useMutation({
    mutationFn: (payload: CreateIssueTypeRequest): Promise<IssueType> => {
      return IssueTypeService.createNew(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-types'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  const {
    mutateAsync: deleteIssueType,
    isPending: isDeletePending,
    error: deleteIssueTypeError,
  } = useMutation({
    mutationFn: (id: string) => IssueTypeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-types'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });
  return {
    issueTypes: issueTypes,
    isLoadingList: isLoadingList,
    issueTypesError: issueTypesError,
    refetchIssueTypes: refetchIssueTypes,

    createNewIssueType: createNewIssueType,
    isCreatePending: isCreatePending,
    createNewIssueTypeError: createNewIssueTypeError,

    deleteIssueType: deleteIssueType,
    isDeletePending: isDeletePending,
    deleteIssueTypeError: deleteIssueTypeError,
  };
};
