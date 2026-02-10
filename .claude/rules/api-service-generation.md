---
description: Rule for generating API services
globs: lib/apis/*.ts
alwaysApply: false
---

# API Service Generation Rule

This rule enforces the standard API service structure defined in [api-service-generator.md](mdc:.claude/skill/api-service-generator.md).

## Usage

When asking to create a new API service, the AI should follow the pattern defined in the skill file.

## Key Requirements

- Location: `lib/apis/`
- Client: `authorizedAxiosInstance` from `@/utils/authorizeAxios`
- Naming: Business-specific function names (not generic CRUD)
- return: `.data` for most endpoints, full response for lists if needed
- Types: Import request/response interfaces from `@/config/interface`

## Reference

Read the full skill at: [.claude/skill/api-service-generator.md](mdc:.claude/skill/api-service-generator.md)
