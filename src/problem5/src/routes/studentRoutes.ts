import { Router } from 'express';
import { StudentController } from '../controllers/studentController';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "6622df149b12e3456789abcd"
 *         name:
 *           type: string
 *           example: "Alice Smith"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "2001-05-15"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "female"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateStudentInput:
 *       type: object
 *       required:
 *         - name
 *         - dateOfBirth
 *         - gender
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "2000-01-01"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *     UpdateStudentInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe Updated"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "2000-01-02"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Student'
 */

/**
 * @openapi
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentInput'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation Error
 *   get:
 *     summary: List students with optional search and gender filter
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search string matching student name
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, other]
 *         description: Filter by student gender
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Property name to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
 */
router.route('/')
  .post(StudentController.create)
  .get(StudentController.list);

/**
 * @openapi
 * /api/students/{id}:
 *   get:
 *     summary: Get details of a specific student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Student details
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Student not found
 *   put:
 *     summary: Update details of a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStudentInput'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Invalid ID or validation error
 *       404:
 *         description: Student not found
 *   delete:
 *     summary: Delete a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Student not found
 */
router.route('/:id')
  .get(StudentController.getById)
  .put(StudentController.update)
  .delete(StudentController.delete);

export default router;
