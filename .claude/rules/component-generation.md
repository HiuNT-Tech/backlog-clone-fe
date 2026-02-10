---
description: Rule for generating React components
globs: components/**/*.tsx
alwaysApply: false
---

# Component Generation Rule

This rule enforces the standard component structure defined in [component-generator.md](mdc:.claude/skill/component-generator.md).

## Usage

When asking to create a new component, the AI should follow the pattern defined in the skill file.

## Key Requirements

- Parameters: `className`, `children`, `...props`
- Utility: Use `cn` from `@/lib/utils` for class merging
- Export: Named export

## Reference

Read the full skill at: [.claude/skill/component-generator.md](mdc:.claude/skill/component-generator.md)
