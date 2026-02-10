---
description: Rule for generating React Query hooks
globs: hooks/use-*.ts
alwaysApply: false
---

# React Query Hook Generation Rule

This rule enforces the standard React Query hook structure defined in [react-query-hook-generator.md](mdc:.claude/skill/react-query-hook-generator.md).

## Usage

When asking to create a new hook, the AI should follow the pattern defined in the skill file.

## Key Requirements

- Naming: `use[ResourceName]`
- Dependencies: `@tanstack/react-query`, API service from `lib/apis/`
- Feedback: `toastHelpers` for success/error messages
- Invalidation: `queryClient.invalidateQueries` on mutation success

## Reference

Read the full skill at: [.claude/skill/react-query-hook-generator.md](mdc:.claude/skill/react-query-hook-generator.md)
