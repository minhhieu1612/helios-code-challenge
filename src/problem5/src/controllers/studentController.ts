import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/studentService';
import mongoose from 'mongoose';

export class StudentController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, dateOfBirth, gender } = req.body;

      if (!name || !dateOfBirth || !gender) {
        res.status(400).json({
          success: false,
          message: 'Validation Error: name, dateOfBirth, and gender are required fields',
        });
        return;
      }

      const student = await StudentService.createStudent({ name, dateOfBirth, gender });
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student,
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, search, gender, page, limit, sortBy, sortOrder } = req.query;

      const result = await StudentService.listStudents({
        name: name as string,
        search: search as string,
        gender: gender as any,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.status(200).json({
        success: true,
        message: 'Students fetched successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid Student ID format',
        });
        return;
      }

      const student = await StudentService.getStudentById(id);

      if (!student) {
        res.status(404).json({
          success: false,
          message: 'Student not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid Student ID format',
        });
        return;
      }

      const updatedStudent = await StudentService.updateStudent(id, req.body);

      if (!updatedStudent) {
        res.status(404).json({
          success: false,
          message: 'Student not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: updatedStudent,
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid Student ID format',
        });
        return;
      }

      const deletedStudent = await StudentService.deleteStudent(id);

      if (!deletedStudent) {
        res.status(404).json({
          success: false,
          message: 'Student not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
        data: deletedStudent,
      });
    } catch (error) {
      next(error);
    }
  }
}
