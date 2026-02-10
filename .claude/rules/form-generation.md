---
description: Rule for generating forms with React Hook Form and Zod
globs: components/**/*Form.tsx
alwaysApply: false
---

# Form Generation Rule

This rule enforces the standard form structure defined in [form-generator.md](mdc:.claude/skill/form-generator.md).

## Usage

When asking to create a new form, the AI should follow the pattern defined in the skill file.

## Key Requirements

- Libs: `react-hook-form`, `zod`, `@hookform/resolvers/zod`
- Components: `Input`, `Button` from `@/components/ui/`
- Validation: Zod schema defined outside component

## Reference

Read the full skill at: [.claude/skill/form-generator.md](mdc:.claude/skill/form-generator.md)
