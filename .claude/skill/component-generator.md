---
description: Generate a standard React component following the project's UI patterns.
---

# Component Generator

This skill creates a new React component with the project's standard structure, including `cn` for class merging and proper typing.

## 1. File Structure
-   Components should be placed in `components/[domain]/` or `components/ui/` or `components/shared/`.
-   Use PascalCase for component filenames: `[ComponentName].tsx`.

## 2. Dependencies
Ensure you have the `cn` utility available (usually in `@/lib/utils` or similar).

## 3. Standard Template

Use this template for new components:

```typescript
import { cn } from '@/lib/utils';

interface [ComponentName]Props {
  className?: string;
  children?: React.ReactNode;
  // Add other props here
}

export const [ComponentName] = ({ className, children, ...props }: [ComponentName]Props) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};
```

## 4. Usage Example

If you are creating a `Card` component:

```typescript
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
}

export const Card = ({ className, children, title, ...props }: CardProps) => {
  return (
    <div className={cn('bg-white rounded-lg shadow p-4', className)} {...props}>
      {title && <h3 className="font-bold text-lg mb-2">{title}</h3>}
      {children}
    </div>
  );
};
```
