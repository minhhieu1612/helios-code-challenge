import { StudentModel, IStudent, GenderType } from '../models/studentModel';

export interface CreateStudentDTO {
  name: string;
  dateOfBirth: string | Date;
  gender: GenderType;
}

export interface UpdateStudentDTO {
  name?: string;
  dateOfBirth?: string | Date;
  gender?: GenderType;
}

export interface StudentQueryFilters {
  name?: string;
  search?: string;
  gender?: GenderType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedStudentResult {
  data: IStudent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class StudentService {
  static async createStudent(data: CreateStudentDTO): Promise<IStudent> {
    const student = new StudentModel({
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
    });
    return await student.save();
  }

  static async listStudents(filters: StudentQueryFilters): Promise<PaginatedStudentResult> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 10));
    const skip = (page - 1) * limit;

    const query: any = {};

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    } else if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    if (filters.gender) {
      query.gender = filters.gender;
    }

    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
    const sortOptions: any = { [sortField]: sortOrder };

    const [data, total] = await Promise.all([
      StudentModel.find(query).sort(sortOptions).skip(skip).limit(limit),
      StudentModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  static async getStudentById(id: string): Promise<IStudent | null> {
    return await StudentModel.findById(id);
  }

  static async updateStudent(id: string, data: UpdateStudentDTO): Promise<IStudent | null> {
    const updateData: any = { ...data };
    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }
    return await StudentModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  static async deleteStudent(id: string): Promise<IStudent | null> {
    return await StudentModel.findByIdAndDelete(id);
  }
}
