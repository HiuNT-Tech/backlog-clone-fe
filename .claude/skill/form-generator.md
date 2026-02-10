---
description: Generate strict typed forms using React Hook Form and Zod.
---

# Form Generator

This skill standardizes form creation using `react-hook-form` for state management, `zod` for validation, and the project's UI components.

## 1. File Structure
- Forms can be their own components in `components/[domain]/[Feature]Form.tsx`.

## 2. Dependencies
- `react-hook-form`
- `@hookform/resolvers/zod`
- `zod`
- UI Components (`@/components/ui/input`, `@/components/ui/button`, etc.)

## 3. Standard Template

Use this template for new forms:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toastHelpers } from '@/hooks/use-toast';

// 1. Define Validation Schema
const formSchema = z.object({
  fieldName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  // email: z.string().email(),
  // age: z.preprocess((val) => Number(val), z.number().min(18)),
});

type FormValues = z.infer<typeof formSchema>;

interface [FormName]Props {
  initialValues?: Partial<FormValues>;
  onSubmit?: (values: FormValues) => Promise<void>;
}

export function [FormName]({ initialValues, onSubmit: externalSubmit }: [FormName]Props) {
  // 2. Setup Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      fieldName: "",
    },
  });

  // 3. Handle Submit
  const onSubmit = async (values: FormValues) => {
    try {
      if (externalSubmit) {
        await externalSubmit(values);
      } else {
        // console.log(values);
        // Call API here
      }
      // toastHelpers.success({ title: 'Success' });
    } catch (error) {
      // toastHelpers.error({ title: 'Error' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 4. Form Fields */}
      <Input
        label="Field Name"
        placeholder="Enter value..."
        error={errors.fieldName?.message}
        disabled={isSubmitting}
        {...register('fieldName')}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
```
