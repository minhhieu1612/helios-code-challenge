# Problem 5: Student CRUD Service

A production-grade backend REST API service managing `Student` data (containing `name`, `dateOfBirth`, and `gender`), built with **ExpressJS**, **TypeScript**, and **MongoDB**. Includes full **Swagger UI** OpenAPI documentation, a **Postman Collection**, an **Agent Skill** for API documentation synchronization, and CLI MongoDB health checking guidelines.

---

## Technologies Used

- **Framework**: ExpressJS (v4)
- **Language**: TypeScript (v5)
- **Database**: MongoDB (via Mongoose v8)
- **API Documentation**: Swagger UI Express (`swagger-ui-express`, `swagger-jsdoc`)
- **API Testing**: Postman Collection v2.1 (`openapi-to-postmanv2`)

---

## 1. MongoDB Installation & Setup Guidelines (Prerequisuites)

### Official Download & Installation Links

If MongoDB is not yet installed on your system, download and install MongoDB Community Server and MongoDB Shell from the official pages:

- [MongoDB Community Server Download Page](https://www.mongodb.com/try/download/community)
- [MongoDB Shell (mongosh) Download Page](https://www.mongodb.com/try/download/shell)

---

### Verifying MongoDB Server Usability via Terminal (CLI)

Before running the application, verify whether the MongoDB server is installed, running, and accessible on your machine using terminal commands:

#### On Windows (Command Prompt / PowerShell)

1. **Check Installed Version**:
   ```cmd
   mongod --version
   ```
   _or_
   ```cmd
   mongosh --version
   ```
2. **Check Windows Service Status**:
   ```cmd
   net start | findstr MongoDB
   ```
3. **Ping Database Connection**:
   ```cmd
   mongosh --eval "db.adminCommand('ping')"
   ```
   _(Expected output: `{ ok: 1 }`)_

#### On Linux / macOS (Terminal)

1. **Check Installed Version**:
   ```bash
   mongod --version
   ```
   _or_
   ```bash
   mongosh --version
   ```
2. **Check Service Status**:
   - **Linux (systemd)**:
     ```bash
     systemctl status mongod
     ```
   - **macOS (Homebrew)**:
     ```bash
     brew services list
     ```
3. **Ping Database Connection**:
   ```bash
   mongosh --eval "db.adminCommand('ping')"
   ```

---

## 2. Environment Configuration

1. Copy the example environment file `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Adjust environment variables inside `.env` if necessary:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/student_db
   ```

---

## 3. Installation & How to Run Application

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Seed Sample Data (Optional CLI Command)

Populate MongoDB with sample student records:

```bash
npm run seed
```

### Step 3: Run in Development Mode

Starts the server with hot-reload via `ts-node-dev`:

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

### Step 4: Build & Run Production Bundle

```bash
npm run build
npm start
```

---

## 4. Swagger API Documentation

Interactive Swagger documentation is auto-generated from TypeScript OpenAPI JSDoc annotations.

- **Swagger UI**: Visit [`http://localhost:5000/api-docs`](http://localhost:5000/api-docs) in your browser.
- **OpenAPI JSON Spec**: Access directly at [`http://localhost:5000/api-docs.json`](http://localhost:5000/api-docs.json).

---

## 5. Postman Collection Guidelines

An exportable Postman Collection is provided in [`postman_collection.json`](postman_collection.json).

### How to Import Postman Collection:

1. Open **Postman**.
2. Click **Import** (top left).
3. Choose or drag-and-drop [`postman_collection.json`](postman_collection.json).
4. Ensure the collection environment variable `baseUrl` is set to `http://localhost:5000`.

### Included Endpoints:

1. `POST /api/students` - Create a new student.
2. `GET /api/students` - List students (with name search, gender filter, pagination, and sorting).
3. `GET /api/students/:id` - Get student details by ID.
4. `PUT /api/students/:id` - Update student by ID.
5. `DELETE /api/students/:id` - Delete student by ID.

---

## 6. Agent Skill (`sync-api-docs`) & Documentation Sync

This project includes a dedicated Antigravity Agent Skill located at:
[`.agents/skills/sync-api-docs/SKILL.md`](.agents/skills/sync-api-docs/SKILL.md)

### Synchronizing Swagger & Postman Docs

Whenever Express routes or Swagger annotations are updated, run:

```bash
npm run sync:docs
```

This script executes `scripts/generate-postman.ts` to convert the latest Swagger OpenAPI spec directly into `postman_collection.json`, preventing documentation drift.

---

## 7. Inventory Ownership Report

### Human / User Provided Files

- [`task.md`](task.md) - Original challenge task requirements.
- [`solution.md`](solution.md) - Solution prompt & implementation direction.
- [`extra-solution.md`](solution.md) - (Optional) Additional solution prompts & implementation directions.
- [`history\**`] - Directory contains implementation plans and feedbacks that contribute to the final solution.

### AI-Generated Files & Components (Gemini 3.6 Flash - High)

- **Application Source Code**:
  - [`src/config/db.ts`](src/config/db.ts) - MongoDB connection module.
  - [`src/models/studentModel.ts`](src/models/studentModel.ts) - Mongoose Student schema & TypeScript interface.
  - [`src/services/studentService.ts`](src/services/studentService.ts) - Business logic & DB operations layer.
  - [`src/controllers/studentController.ts`](src/controllers/studentController.ts) - Request & response handlers for CRUD endpoints.
  - [`src/routes/studentRoutes.ts`](src/routes/studentRoutes.ts) - Express router with OpenAPI JSDoc specs.
  - [`src/swagger/swagger.ts`](src/swagger/swagger.ts) - Swagger specification generator.
  - [`src/middlewares/errorHandler.ts`](src/middlewares/errorHandler.ts) - Centralized error middleware.
  - [`src/app.ts`](src/app.ts) - Express application setup.
  - [`src/server.ts`](src/server.ts) - Application entrypoint.
- **CLI Scripts & Agent Skills**:
  - [`scripts/seed.ts`](scripts/seed.ts) - Database seed CLI script.
  - [`scripts/generate-postman.ts`](scripts/generate-postman.ts) - Swagger-to-Postman conversion script.
  - [`.agents/skills/sync-api-docs/SKILL.md`](.agents/skills/sync-api-docs/SKILL.md) - API docs synchronization agent skill.
- **Configurations & Testing Artifacts**:
  - [`package.json`](package.json) - Dependencies & script definitions.
  - [`tsconfig.json`](tsconfig.json) - TypeScript configuration.
  - [`.env.example`](.env.example) & [`.env`](.env) - Environment variables.
  - [`.gitignore`](.gitignore) - Version control exclusions.
  - [`postman_collection.json`](postman_collection.json) - Postman API collection.
  - [`README.md`](README.md) - Project documentation.
