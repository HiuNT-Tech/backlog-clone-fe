import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentService } from '@/lib/apis/comment';
import type {
  CommentListParams,
  CreateCommentRequest,
  EntityId,
  UpdateCommentRequest,
} from '@/config/interface';

export const useComments = (cardId?: EntityId, params?: CommentListParams) => {
  const queryClient = useQueryClient();

  const invalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: ['comments', cardId] });

  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', cardId, params],
    queryFn: () => CommentService.getList(cardId!, params),
    enabled: !!cardId,
  });

  const { mutateAsync: createComment, isPending: isCreating } = useMutation({
    mutationFn: (payload: CreateCommentRequest) =>
      CommentService.create(cardId!, payload),
    onSuccess: invalidateComments,
  });

  const { mutateAsync: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: ({
      commentId,
      ...payload
    }: { commentId: EntityId } & UpdateCommentRequest) =>
      CommentService.update(commentId, payload),
    onSuccess: invalidateComments,
  });

  const { mutateAsync: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: (commentId: EntityId) => CommentService.remove(commentId),
    onSuccess: invalidateComments,
  });

  return {
    comments: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    createComment,
    isCreating,
    updateComment,
    isUpdating,
    deleteComment,
    isDeleting,
  };
};
