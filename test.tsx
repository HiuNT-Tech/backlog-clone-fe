'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Title } from '@/components/ui/title';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import Images from '@/assets';
import { Button } from '@/components/ui/button';
import RadioGroup from '@/components/ui/radio';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createStaffFormSchema,
  updateStaffFormSchema,
} from '@/validation/staff-form-schemas';
import { scrollToFirstError } from '@/lib/scroll';
import { Gender, GenderCode, StaffLevel, StoreStatus } from '@/config/enum';
import { formatPhoneNumber } from '@/validation/format';
import UpLoadImage from '@/components/admin/shared/UpLoadImage';
import { useUser } from '@/hooks/admin/use-user';
import {
  transformStaffFormToCreatePayload,
  transformStaffFormToUpdatePayload,
  UpdateStaffRequest,
} from '@/lib/transform-payload-staff';
import { StaffDetailResponse } from '@/config/interface';
import type { z } from 'zod';
import { toastHelpers } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api/product';
import { useRouter } from 'next/navigation';

type FormData =
  | z.infer<typeof createStaffFormSchema>
  | z.infer<typeof updateStaffFormSchema>;

const Row = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-wrap gap-4">{children}</div>;
};

interface StaffFormProps {
  data?: StaffDetailResponse;
  handleBack: () => void;
  isEdit: boolean;
  isCreate: boolean;
  staffId?: string;
  onRefetchDetail?: () => void;
}

const StaffForm = ({
  data,
  handleBack,
  isEdit,
  isCreate,
  staffId,
  onRefetchDetail,
}: StaffFormProps) => {
  const { t } = useTranslation();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { assignment } = useAuth();
  const companyId = Number(assignment?.company?.id) || 0;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(
      isCreate ? createStaffFormSchema : updateStaffFormSchema
    ),
    defaultValues: {
      code: '',
      name: '',
      nameKana: '',
      phone: '',
      gender: '',
      email: '',
      loginId: '',
      password: '',
      passwordConfirm: '',
      level: '',
      area: '',
      branch: '',
    },
  });

  const levelValue = watch('level');
  const areaValue = watch('area');
  const branchValue = watch('branch');

  // Query areas list
  const { data: areasData, isLoading: isAreasLoading } = useQuery({
    queryKey: ['areas', 'list', companyId],
    queryFn: async () => {
      return await productApi.getAreas(companyId.toString(), {
        skip: 0,
        limit: 999,
        statuses: [2], // Only PUBLISHED areas
      });
    },
    enabled: !!companyId,
  });

  // Query branches list - chỉ gọi khi đã chọn area (giống AddNewModal)
  const { data: branchesData, isLoading: isBranchesLoading } = useQuery({
    queryKey: ['branches', 'list', companyId, areaValue],
    queryFn: async () => {
      return await productApi.getBranches(companyId.toString(), {
        skip: 0,
        limit: 999,
        areaId: areaValue || undefined,
        statuses: [2], // Only PUBLISHED branches
      });
    },
    enabled: !!companyId && !!areaValue, // Chỉ gọi API khi đã chọn area
  });

  const getFieldError = (field: keyof FormData): string | undefined => {
    return errors[field]?.message;
  };

  const { generateCodeData, refetchGenerateCode, createStaff, updateStaff } =
    useUser();

  // Gọi API generate code khi ở create mode
  useEffect(() => {
    if (isCreate) {
      refetchGenerateCode();
    }
  }, [isCreate, refetchGenerateCode]);

  useEffect(() => {
    // Chỉ reset form với data khi ở edit mode và có data
    if (isEdit && data) {
      reset({
        code: data.user?.employeeCode,
        name: data.user?.name,
        nameKana: data.user?.namePhonetic,
        phone: data.user?.phone,
        gender:
          data.user?.gender === GenderCode.MALE
            ? Gender.MALE
            : data.user?.gender === GenderCode.FEMALE
              ? Gender.FEMALE
              : '',
        email: data.user?.email,
        loginId: data.user?.username,
        password: '',
        passwordConfirm: '',
        level: (data.assignment.role || '') as StaffLevel,
        area: data.assignment.areaId || '',
        branch: data.assignment.branchId || '',
      });
    } else if (isCreate) {
      // Khi add mode, reset về default values (empty form)
      reset({
        code: generateCodeData?.employeeCode,
        name: '',
        nameKana: '',
        phone: '',
        gender: '',
        email: '',
        loginId: '',
        password: '',
        passwordConfirm: '',
        level: '',
        area: '',
        branch: '',
      });
    }
  }, [data, reset, isEdit, isCreate, generateCodeData]);

  const genderOptions = [
    {
      label: t('admin.staff.genderOptions.female'),
      value: Gender.FEMALE,
    },
    {
      label: t('admin.staff.genderOptions.male'),
      value: Gender.MALE,
    },
  ];

  const levelOptions = [
    {
      label: t('admin.staff.levelOptions.companyAdmin'),
      value: StaffLevel.ADMIN,
    },
    {
      label: t('admin.staff.levelOptions.storeStaff'),
      value: StaffLevel.SUB_ADMIN,
    },
    {
      label: t('admin.staff.levelOptions.applicationFormStaff'),
      value: StaffLevel.STAFF,
    },
  ];

  // Transform areas to select options
  const areaOptions = useMemo(() => {
    const options = [{ value: '', label: t('admin.common.selectPlaceholder') }];
    if (areasData?.items && areasData.items.length > 0) {
      areasData.items.forEach(area => {
        options.push({
          value: area.id,
          label: area.detail?.name || area.id,
        });
      });
    }
    return options;
  }, [areasData?.items, t]);

  // Transform branches to select options - filtered by selected area (same logic as AddNewModal)
  const branchOptions = useMemo(() => {
    const options = [{ value: '', label: t('admin.common.selectPlaceholder') }];
    if (branchesData?.items && branchesData.items.length > 0) {
      const filteredBranches = branchesData.items.filter(branch =>
        levelValue !== StaffLevel.ADMIN
          ? !areaValue || branch.areaId === areaValue
          : true
      );

      filteredBranches.forEach(branch => {
        options.push({
          value: branch.id,
          label: branch.detail?.name || branch.id,
        });
      });
    }
    return options;
  }, [branchesData?.items, areaValue, levelValue, t]);

  // Handle branch change
  const handleBranchChange = (branchId: string) => {
    setValue('branch', branchId, { shouldValidate: true });
  };

  const onSubmit = async (formData: FormData) => {
    try {
      if (isCreate) {
        const payload = transformStaffFormToCreatePayload(
          formData,
          uploadedFile
        );
        await createStaff(payload);
        router.push('/admin/staff/list-staff');
      } else if (isEdit) {
        if (!staffId) {
          toastHelpers.error({ title: t('admin.user.updateStaff.error') });
          return;
        }
        const payload = transformStaffFormToUpdatePayload(
          formData,
          data,
          uploadedFile
        );
        await updateStaff({
          staffId,
          data: payload as UpdateStaffRequest & { profilePhotoFile?: File },
        });
        // Refetch detail data before going back
        if (onRefetchDetail) {
          await onRefetchDetail();
        }
        router.push('/admin/staff/list-staff');
      }
    } catch (error: unknown) {
      // Error handling is done in mutation onError
      console.error('Staff form submission error:', error);
    }
  };

  const onError = (formErrors: typeof errors) => {
    setTimeout(() => scrollToFirstError(), 200);
  };

  return (
    <form>
      <div className="flex flex-col gap-5">
        <UpLoadImage
          avatar={isEdit && data ? data.user?.avatar || null : null}
          onFileChange={setUploadedFile}
        />
        {/* Information Content */}
        <div className="flex flex-col gap-3">
          <Row>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <Input
                placeholder={t('admin.staff.placeholder.code')}
                className="w-full"
                readOnly
                error={getFieldError('code')}
                label={t('admin.staff.code')}
                {...register('code', {
                  setValueAs: (value: string) => value?.trim() || '',
                })}
                prefixIcon={Images.gray.Code}
                disabled={isSubmitting || isEdit}
              />
            </div>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <Input
                {...register('name', {
                  setValueAs: (value: string) => value?.trim() || '',
                })}
                placeholder={t('admin.staff.placeholder.name')}
                className="w-full"
                required
                error={getFieldError('name')}
                label={t('admin.staff.name')}
                prefixIcon={Images.gray.User}
                disabled={isSubmitting}
              />
            </div>
          </Row>
          <Row>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <Input
                placeholder={t('admin.staff.placeholder.nameKana')}
                className="w-full"
                required
                error={getFieldError('nameKana')}
                label={t('admin.staff.nameKana')}
                {...register('nameKana', {
                  setValueAs: (value: string) => value?.trim() || '',
                })}
                prefixIcon={Images.gray.User}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <Input
                className="w-full"
                error={getFieldError('phone')}
                label={t('admin.staff.phone')}
                value={formatPhoneNumber(watch('phone') ?? '', 'mobile') || ''}
                onChange={e => {
                  const formatted = formatPhoneNumber(e.target.value, 'mobile');
                  setValue('phone', formatted, { shouldValidate: true });
                }}
                prefixIcon={Images.gray.Phone}
                placeholder="000-0000-0000"
                disabled={isSubmitting}
              />
            </div>
          </Row>
          <Row>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-theme-neutral-11">
                  {t('admin.staff.gender')}
                </label>
                <RadioGroup
                  options={genderOptions}
                  value={watch('gender')}
                  onChange={e => {
                    setValue('gender', e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                  name="gender"
                />
                {getFieldError('gender') && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError('gender')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <Input
                placeholder={t('admin.staff.placeholder.email')}
                className="w-full"
                error={getFieldError('email')}
                label={t('admin.staff.email')}
                {...register('email', {
                  setValueAs: (value: string) => value?.trim() || '',
                })}
                prefixIcon={Images.gray.Email}
                disabled={isSubmitting}
              />
            </div>
          </Row>
          {/* Login Settings Content */}
          <Title>{t('admin.staff.loginSettings')}</Title>
          <Row>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <Input
                placeholder={t('admin.staff.placeholder.loginId')}
                className="w-full"
                required
                error={getFieldError('loginId')}
                label={t('admin.staff.loginId')}
                {...register('loginId', {
                  setValueAs: (value: string) => value?.trim() || '',
                })}
                prefixIcon={Images.gray.User}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <Input
                placeholder={t('admin.staff.placeholder.password')}
                className="w-full"
                required
                error={getFieldError('password')}
                label={t('admin.staff.password')}
                {...register('password', {
                  setValueAs: (value: string) => value?.trim() || '',
                })}
                prefixIcon={Images.gray.Password}
                type="password"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <Input
                placeholder={t('admin.staff.placeholder.passwordConfirm')}
                className="w-full"
                required
                error={getFieldError('passwordConfirm')}
                label={t('admin.staff.passwordConfirm')}
                {...register('passwordConfirm', {
                  setValueAs: (value: string) => value?.trim() || '',
                })}
                prefixIcon={Images.gray.Password}
                type="password"
                disabled={isSubmitting}
              />
            </div>
          </Row>
        </div>
        {/* Level Settings Content */}
        <div className="flex flex-col gap-3">
          <Title>{t('admin.staff.levelSettings')}</Title>
          <Row>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <Select
                placeholder={t('admin.staff.placeholder.level')}
                required
                error={getFieldError('level')}
                label={t('admin.staff.level')}
                options={levelOptions}
                value={watch('level') || ''}
                onChange={e => {
                  setValue('level', e.target.value, { shouldValidate: true });
                  // Reset area and branch when level changes
                  if (
                    e.target.value !== StaffLevel.SUB_ADMIN &&
                    e.target.value !== StaffLevel.STAFF
                  ) {
                    setValue('area', '', { shouldValidate: true });
                    setValue('branch', '', { shouldValidate: true });
                  }
                }}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1"></div>
          </Row>
          <Row>
            <div className="flex-1 min-w-[200px] md:min-w-0">
              <Select
                placeholder={t('admin.staff.placeholder.area')}
                className="w-full"
                error={getFieldError('area')}
                label={t('admin.staff.area')}
                options={areaOptions}
                value={areaValue || ''}
                onChange={e => {
                  setValue('area', e.target.value, {
                    shouldValidate: true,
                  });
                  // Reset branch when area changes
                  setValue('branch', '', { shouldValidate: true });
                }}
                disabled={isSubmitting || isAreasLoading}
              />
            </div>
            <div className="flex-1">
              <Select
                placeholder={t('admin.staff.placeholder.branch')}
                className="w-full"
                error={getFieldError('branch')}
                label={t('admin.staff.branch')}
                options={branchOptions}
                value={branchValue || ''}
                onChange={e => handleBranchChange(e.target.value)}
                disabled={isSubmitting || isBranchesLoading}
              />
            </div>
          </Row>
        </div>
      </div>
      <div className="flex flex-row items-center mt-6 justify-end gap-4">
        <Button
          type="button"
          className="px-10 py-2.5"
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
        >
          {t('admin.common.back')}
        </Button>
        <Button
          onClick={handleSubmit(onSubmit, onError)}
          className="px-10 py-2.5"
          disabled={isSubmitting}
        >
          {isCreate ? t('common.register') : t('admin.common.save')}
        </Button>
      </div>
    </form>
  );
};

export default StaffForm;
