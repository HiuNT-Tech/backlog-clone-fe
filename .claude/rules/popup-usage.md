---
description: Rule for enforcing Modal usage in popup designs
globs: components/**/*.tsx
alwaysApply: true
---
# Popup Design Rule

This rule enforces the usage of the custom `Modal` component over the Shadcn `Dialog` component for all popup/modal implementations.

## Requirement
- **MUST USE**: `Modal` from `@/components/ui/modal`
- **MUST NOT USE**: `Dialog` from `@/components/ui/dialog`

## Usage Example

```typescript
import { Modal } from '@/components/ui/modal';

// Correct Usage
export const MyPopup = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Custom Modal"
      size="md" // 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl'
    >
      <div>Content here</div>
    </Modal>
  );
};
```

## Anti-Pattern

```typescript
// Incorrect Usage - DO NOT DO THIS
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const MyPopup = () => {
  return (
    <Dialog>
      <DialogContent>...</DialogContent>
    </Dialog>
  );
};
```
