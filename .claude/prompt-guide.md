# Frontend AI Prompt Guide

This guide helps you write effective prompts when working with the FE codebase.

## Quick Reference

### Available Modes

```bash
# API Service mode (Fetching, Axios, React Query)
claude-api

# UI mode (Components, Theme, i18n)
claude-ui

# Redux mode (Global State Management)
claude-redux

# Full mode (UI + API, no Redux)
claude-full
```

---

## Prompt Templates

### 1. API Integration

**When to use**: Creating new API endpoints, React Query hooks, or API services

**Template**:
```
Create a new API service for [resource name] with the following endpoints:
- GET /api/v1/[resources] - List all
- GET /api/v1/[resources]/:id - Get by ID
- POST /api/v1/[resources] - Create new
- PUT /api/v1/[resources]/:id - Update
- DELETE /api/v1/[resources]/:id - Delete

Include:
1. Interface definitions in config/interface.ts
2. API service in lib/apis/[resource].ts
3. React Query hook in hooks/use-[resource].ts
```

**Example**:
```
Create a new API service for comments with endpoints for CRUD operations.
Include TypeScript interfaces, API service using authorizedAxiosInstance, 
and React Query hook with mutations for create/update/delete.
```

---

### 2. Component Generation

**When to use**: Creating new UI components

**Template**:
```
Create a [component name] component in components/[domain]/ with:
- Props: [list props]
- Features: [list features]
- Styling: Use theme colors (bg-theme-main, text-theme-neutral-11)
- i18n: All text must use t() function

Follow the component-generator.md pattern.
```

**Example**:
```       
Create a CommentCard component in components/admin/ with:
- Props: comment object, onEdit, onDelete callbacks
- Features: Display author, timestamp, content, edit/delete buttons
- Styling: Use theme colors and hover effects
- i18n: All labels and buttons must use translation keys
```

---

### 3. Form Generation

**When to use**: Creating forms with validation

**Template**:
```
Create a [FormName] form component with:
- Fields: [list fields with types]
- Validation: [validation rules]
- Submit action: [what happens on submit]

Use react-hook-form + zod validation following form-generator.md.
```

**Example**:
```
Create a CommentForm with:
- Fields: content (textarea, required, min 10 chars)
- Validation: Zod schema
- Submit: Call createComment mutation, show toast on success/error
```

---

### 4. React Query Hook

**When to use**: Creating data fetching/mutation hooks

**Template**:
```
Create a use[Resource] hook with:
- Query: fetch[Resource]ById
- Mutations: create[Resource], update[Resource], delete[Resource]
- Features: Auto-invalidate queries, toast notifications

Follow react-query-hook-generator.md pattern.
```

**Example**:
```
Create a useComment hook with:
- Query: fetchCommentById (enabled when id exists)
- Mutations: createComment, updateComment, deleteComment
- Features: Invalidate 'comments' query on success, show toasts
```

---

### 5. Enum/Constants

**When to use**: Adding new status types, categories, or constants

**Template**:
```
Add a new enum [EnumName] to config/enum.ts with values:
- [VALUE_1]: '[value_1]'
- [VALUE_2]: '[value_2]'

Also add i18n keys to i18n/locales/[lang].ts for each value.
```

**Example**:
```
Add a new enum CommentStatus to config/enum.ts with:
- PENDING: 'pending'
- APPROVED: 'approved'
- REJECTED: 'rejected'

Add i18n keys: admin.comments.statusOptions.pending/approved/rejected
```

---

## Best Practices for Prompts

### ✅ DO:

1. **Be specific about file locations**:
   ```
   Create CommentService in lib/apis/comment.ts
   ```

2. **Reference existing patterns**:
   ```
   Follow the same pattern as BoardService in lib/apis/board.ts
   ```

3. **Specify all requirements upfront**:
   ```
   Include TypeScript interfaces, API service, React Query hook, 
   and update the interface.ts file
   ```

4. **Mention i18n requirements**:
   ```
   All text must use t() function with keys in admin.comments.*
   ```

5. **Specify theme usage**:
   ```
   Use theme colors: bg-theme-main, text-theme-neutral-11, 
   border-theme-neutral-4
   ```

### ❌ DON'T:

1. **Don't be vague**:
   ```
   ❌ Create a comment feature
   ✅ Create CommentCard component with edit/delete actions
   ```

2. **Don't forget TypeScript**:
   ```
   ❌ Create an API service
   ✅ Create an API service with TypeScript interfaces
   ```

3. **Don't skip i18n**:
   ```
   ❌ Add a button with label "Delete"
   ✅ Add a button with label t('admin.common.delete')
   ```

4. **Don't hardcode colors**:
   ```
   ❌ Use bg-blue-600
   ✅ Use bg-theme-main
   ```

---

## Common Workflows

### Adding a New Feature (Full Stack)

```
1. Create API service for [resource]:
   - Interfaces in config/interface.ts
   - API service in lib/apis/[resource].ts
   - React Query hook in hooks/use-[resource].ts

2. Create UI components:
   - [Resource]List component for displaying list
   - [Resource]Form component for create/edit
   - [Resource]Card component for individual items

3. Add i18n keys to i18n/locales/vi.ts, en.ts, ja.ts

4. Add routes if needed
```

### Updating Existing Feature

```
Update [ComponentName] to add [feature]:
- Modify props interface to include [new prop]
- Add [new UI element] with theme colors
- Update i18n keys if needed
- Follow existing component patterns
```

---

## File Structure Reference

```
FE/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── ui/             # Reusable UI components
│   └── shared/         # Shared components
├── lib/
│   └── apis/           # API services
├── hooks/              # React Query hooks
├── config/
│   ├── interface.ts    # TypeScript interfaces
│   └── enum.ts         # Enums/constants
├── i18n/
│   └── locales/        # Translation files
└── .claude/
    ├── rules/          # AI rules
    └── skill/          # AI skills/templates
```

---

## Tips

1. **Always specify the mode** you're working in (API, UI, Full)
2. **Reference existing files** as examples when possible
3. **Be explicit about TypeScript types** and interfaces
4. **Don't forget i18n** - all user-facing text needs translation
5. **Use theme colors** - never hardcode colors
6. **Follow the patterns** in .claude/skill/ files
