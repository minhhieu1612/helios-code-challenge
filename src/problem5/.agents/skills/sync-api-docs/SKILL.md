---
name: sync-api-docs
description: Synchronizes Swagger annotations, OpenAPI configuration, Postman Collection, and Express REST API routes to eliminate duplication and prevent spec drift.
---

# REST API & Documentation Synchronization Skill

This agent skill enforces single-source-of-truth API documentation by synchronizing TypeScript Express routes, Swagger OpenAPI JSDoc specs, and Postman Collections.

## Overview & Architecture

When developing or updating endpoints in this backend service:
1. **Single Source of Truth**: Route definitions & OpenAPI JSDoc annotations in `src/routes/studentRoutes.ts`.
2. **Swagger OpenAPI Spec**: Generated dynamically via `src/swagger/swagger.ts` (`/api-docs` UI and `/api-docs.json` endpoint).
3. **Postman Collection**: Auto-generated from Swagger spec to `postman_collection.json` via `npm run sync:docs`.

---

## Workflow Instructions for Agents & Developers

### 1. Adding or Modifying REST Endpoints
- Edit `src/routes/studentRoutes.ts` or add new route files in `src/routes/`.
- Always update `@openapi` JSDoc annotations directly above each route handler method to reflect:
  - Request body schemas (`CreateStudentInput`, `UpdateStudentInput`)
  - Query parameters (search, filter, pagination, sorting)
  - Path parameters (`id`)
  - Response codes (`200`, `201`, `400`, `404`, `500`) and schemas (`ApiResponse`)

### 2. Updating Data Models
- If model properties change in `src/models/studentModel.ts` or DTO interfaces in `src/services/studentService.ts`:
  - Update Mongoose schema validation rules.
  - Update `components.schemas` in `src/routes/studentRoutes.ts` or `src/swagger/swagger.ts`.

### 3. Synchronizing Postman Collection
- Run the synchronization script:
  ```bash
  npm run sync:docs
  ```
- This executes `scripts/generate-postman.ts` which converts the updated OpenAPI specification into `postman_collection.json`.

### 4. Verification & Validation Checklist
- [ ] Run `npm run build` to verify TypeScript compile-time safety.
- [ ] Start server (`npm run dev`) and navigate to `http://localhost:5000/api-docs` to inspect Swagger UI.
- [ ] Verify `postman_collection.json` contains updated endpoints and sample request payloads.
