'use client';
import { useTranslation } from 'react-i18next';
import { SearchSection } from '@/components/search/SearchSection';
import type { SearchField } from '@/types/search-section';
import type { CardListParams, EntityId } from '@/config/interface';
import { useColumn } from '@/hooks/use-column';
import { useVersion } from '@/hooks/use-version';
import { useIssueType } from '@/hooks/use-issue-type';
import { useUserBoard } from '@/hooks/use-user-board';
import { PRIORITY_OPTIONS, renderIssueTypeBadge } from '@/constant/data';

const IssuesFilter = ({
  boardId,
  onSearch,
}: {
  boardId?: EntityId;
  onSearch: (params: CardListParams) => void;
}) => {
  const { t } = useTranslation();

  const { columns: columnList } = useColumn(boardId);
  const { versions } = useVersion(boardId, { skip: 0, limit: 100 });
  const { issueTypes } = useIssueType(boardId, { skip: 0, limit: 100 });
  const { listUser } = useUserBoard(boardId, { skip: 0, limit: 100 });

  const OptionsStatus = columnList.map(column => ({
    value: column.id.toString(),
    label: (
      <div className="flex items-center gap-2">
        {renderIssueTypeBadge(column.statusColor, column.title)}
      </div>
    ),
  }));

  const VersionOptions = versions.map(version => ({
    value: version.id.toString(),
    label: version.name,
  }));

  const IssueTypeOptions = issueTypes.map(issueType => ({
    value: issueType.id.toString(),
    label: (
      <div className="flex items-center gap-2">
        {renderIssueTypeBadge(issueType.statusColor, issueType.name)}
      </div>
    ),
  }));

  const Assignee = listUser.items.map(user => ({
    value: user.userId.toString(),
    label: user.displayName,
  }));

  const RegisteredBy = listUser.items.map(user => ({
    value: user.userId.toString(),
    label: user.displayName,
  }));

  const searchFields: SearchField[] = [
    {
      id: 'registeredBy',
      type: 'multiOptions',
      label: t('issues.filter.registeredBy'),
      options: RegisteredBy,
      props: {
        placeholder: t('issues.filter.registerByPlaceholder'),
      },
    },
    {
      id: 'status',
      type: 'multiOptions',
      label: t('issues.filter.status'),
      options: OptionsStatus,
      props: {
        placeholder: t('issues.filter.statusPlaceholder'),
      },
    },
    {
      id: 'version',
      type: 'multiOptions',
      label: t('issues.filter.version'),
      options: VersionOptions,
      props: {
        placeholder: t('issues.filter.versionPlaceholder'),
      },
    },
    {
      id: 'issueType',
      type: 'multiOptions',
      label: t('issues.filter.issueType'),
      options: IssueTypeOptions,
      props: {
        placeholder: t('issues.filter.issueTypePlaceholder'),
      },
    },
    {
      id: 'priority',
      type: 'multiOptions',
      label: t('issues.filter.priority'),
      options: PRIORITY_OPTIONS,
      props: {
        placeholder: t('issues.filter.priorityPlaceholder'),
      },
    },
    {
      id: 'assignee',
      type: 'multiOptions',
      label: t('issues.filter.assignee'),
      options: Assignee,
      props: {
        placeholder: t('issues.filter.assigneePlaceholder'),
      },
    },
    {
      id: 'search',
      type: 'text',
      label: t('issues.filter.search'),
      // Đứng một mình ở hàng cuối nên cho chiếm hết chiều rộng cho cân.
      colSpan: 'full',
      props: {
        placeholder: t('issues.filter.searchPlaceholder'),
      },
    },
  ];

  const normalizeMultiParam = (value: unknown) => {
    const values = Array.isArray(value) ? value : value ? [value] : [];

    const filteredValues = values
      .map(item => String(item).trim())
      .filter(Boolean);

    return filteredValues.length ? filteredValues.join(',') : undefined;
  };

  const handleSearch = (values: Record<string, any>) => {
    const {
      search,
      status,
      version,
      issueType,
      priority,
      assignee,
      registeredBy,
    } = values;

    const params: CardListParams = {};

    if (search) {
      params.search = String(search).trim();
    }

    params.columnId = normalizeMultiParam(status);
    params.versionId = normalizeMultiParam(version);
    params.issueTypeId = normalizeMultiParam(issueType);
    params.priority = normalizeMultiParam(priority);
    params.assigneeUserId = normalizeMultiParam(assignee);
    params.registeredByUserId = normalizeMultiParam(registeredBy);

    onSearch(params);
  };

  const handleReset = () => {
    onSearch({});
  };

  return (
    <div className="mt-0">
      <SearchSection
        itemsPerRow={3}
        title={t('common.search')}
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
      />
    </div>
  );
};

export default IssuesFilter;
