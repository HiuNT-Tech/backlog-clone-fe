import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IssueTypeService } from '@/lib/apis/issueType';
import { toastHelpers } from '@/hooks/use-toast';
import type {
  CreateIssueTypeRequest,
  EntityId,
  IssueType,
} from '@/config/interface';

export const useIssueType = (
  boardId?: EntityId,
  params?: Record<string, any>
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data = { items: [], count: 0 },
    isLoading,
    error: issueTypesError,
    refetch: refetchIssueTypes,
  } = useQuery({
    queryKey: ['issue-types', boardId, params],
    queryFn: () => IssueTypeService.getList(boardId!, params),
    enabled: !!boardId,
  });
  const {
    mutateAsync: createNewIssueType,
    isPending: isCreatePending,
    error: createNewIssueTypeError,
  } = useMutation({
    mutationFn: (payload: CreateIssueTypeRequest): Promise<IssueType> => {
      return IssueTypeService.createNew(boardId!, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-types', boardId] });
    },
  });

  const {
    mutateAsync: deleteIssueType,
    isPending: isDeletePending,
    error: deleteIssueTypeError,
  } = useMutation({
    mutationFn: (id: EntityId) => IssueTypeService.delete(boardId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-types', boardId] });
    },
  });
  return {
    issueTypes: data.items,
    totalCount: data.count,
    isLoading,
    issueTypesError,
    refetchIssueTypes,

    createNewIssueType,
    isCreatePending,
    createNewIssueTypeError,

    deleteIssueType,
    isDeletePending,
    deleteIssueTypeError,
  };
};
